#!/usr/bin/env python3
"""NoodleBomb Meta (Facebook/Instagram) Ads build script.

Creates a conversion-focused Meta ad campaign for the NoodleBomb ramen
sauces using the Meta Marketing (Graph) API.

Audience-split (A/B) structure:
  1 campaign
  Per product (Original, Spicy Tokyo, Citrus Shoyu, Trio):
    - 1 ad creative (the studio product photo from uploads/)
    - 2 ad sets sharing that creative:
        "Broad"    — Advantage+ broad audience, Meta picks the buyers
        "Interest" — interest-targeted audience (ramen / cooking / etc.)
  => 8 ad sets, 8 creatives, 8 ads. Creatives split only so each ad set gets
     its own UTM content value; Broad vs. Interest is the A/B variable.

Interest ad sets resolve their interest ids at build time via Meta's
targeting search API, so no brittle hardcoded ids.

SAFETY
  Everything is created with status=PAUSED — campaign, ad sets, and ads.
  Nothing spends money or goes live until you activate it by hand in Meta
  Ads Manager. This script never sets anything ACTIVE.

USAGE
  python nb_meta_ads_build.py --dry-run     # print the plan, no API calls
  python nb_meta_ads_build.py --execute     # create everything (PAUSED)
  python nb_meta_ads_build.py --execute --yes        # skip confirmation
  python nb_meta_ads_build.py --execute --budget 15  # $15/day per ad set

REQUIREMENTS
  pip install requests

ENVIRONMENT VARIABLES (required for --execute)
  META_ACCESS_TOKEN   Long-lived / system-user token with ads_management.
  META_AD_ACCOUNT_ID  Ad account id, e.g. act_1234567890 (act_ optional).
  META_PAGE_ID        Facebook Page id the ads are published from.
  META_PIXEL_ID       (optional) Meta Pixel id. If set, the campaign
                      optimizes for purchases (OUTCOME_SALES); if absent
                      it falls back to link-click traffic (OUTCOME_TRAFFIC).
  META_API_VERSION    (optional) Graph API version, default v21.0.

If those vars are not already set, the script also reads:
  C:/Users/12534/.openclaw/secrets/meta_noodlebomb.env
"""
import argparse
import json
import os
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    import requests
except ImportError:
    sys.exit("This script requires 'requests'.  Install it with:  pip install requests")

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
API_VERSION = os.environ.get("META_API_VERSION", "v21.0")
GRAPH = f"https://graph.facebook.com/{API_VERSION}"

REPO_ROOT = Path(__file__).resolve().parents[2]
UPLOADS = REPO_ROOT / "uploads"
SITE = "https://noodlebomb.co"
META_ENV_FILE_WINDOWS = Path("C:/Users/12534/.openclaw/secrets/meta_noodlebomb.env")
META_ENV_FILE_WSL = Path("/mnt/c/Users/12534/.openclaw/secrets/meta_noodlebomb.env")

CAMPAIGN_NAME = "NoodleBomb — Ramen Sauce | Audience A/B"
DEFAULT_DAILY_BUDGET_USD = 20.0  # per ad set

# Shared geo/age base — identical across both A/B variants so the only
# difference under test is broad vs. interest targeting.
BASE_TARGETING = {
    "geo_locations": {"countries": ["US"]},
    "age_min": 21,
    "age_max": 60,
}

# Keywords resolved to Meta interest ids (via the targeting search API) for
# the "Interest" ad sets. One shared set keeps the A/B clean — the only
# per-product difference is the creative.
INTEREST_KEYWORDS = [
    "Ramen",
    "Instant noodle",
    "Cooking",
    "Asian cuisine",
    "Foodie",
    "Hot sauce",
]

# slug -> ad copy + creative. image is a filename under uploads/.
PRODUCTS = [
    {
        "key": "original",
        "name": "Original Ramen Sauce",
        "path": "/product/original-ramen",
        "price": "$11.99",
        "image": "nb-original-production-front-2026-05.jpeg",
        "headline": "Restaurant Ramen, At Home",
        "primary_text": (
            "One spoonful turns instant noodles into the bowl you'd order "
            "out. NoodleBomb Original — deep, savory umami in seconds."
        ),
        "description": "Original Ramen Sauce — $11.99",
    },
    {
        "key": "spicy",
        "name": "Spicy Tokyo Ramen Sauce",
        "path": "/product/spicy-tokyo",
        "price": "$11.99",
        "image": "nb-spicy-production-front-2026-05.jpeg",
        "headline": "Tokyo Heat in One Pour",
        "primary_text": (
            "Crave the spicy ramen bowl from your favorite Tokyo shop? "
            "NoodleBomb Spicy Tokyo brings the slow-building chili heat "
            "home — no recipe required."
        ),
        "description": "Spicy Tokyo Ramen Sauce — $11.99",
    },
    {
        "key": "citrus",
        "name": "Citrus Shoyu Ramen Sauce",
        "path": "/product/citrus-shoyu",
        "price": "$11.99",
        "image": "nb-citrus-production-front-2026-05.jpeg",
        "headline": "Bright, Citrusy, Crave-Worthy",
        "primary_text": (
            "Citrus-bright shoyu that wakes up any bowl of noodles. "
            "NoodleBomb Citrus Shoyu — balanced, zesty, ridiculously good."
        ),
        "description": "Citrus Shoyu Ramen Sauce — $11.99",
    },
    {
        "key": "trio",
        "name": "The NoodleBomb Trio",
        "path": "/",
        "price": "$29.99",
        "image": "nb-production-trio-hero-2026-05.jpg",
        "headline": "All 3 Flavors. One Box.",
        "primary_text": (
            "Can't pick a favorite? The NoodleBomb Trio has Original, "
            "Spicy Tokyo, and Citrus Shoyu — your whole ramen night "
            "sorted. Save when you bundle."
        ),
        "description": "The NoodleBomb Trio — $29.99",
    },
]

# A/B variants applied to every product.
VARIANTS = ("Broad", "Interest")


class MetaApiError(RuntimeError):
    pass


# --------------------------------------------------------------------------
# Targeting
# --------------------------------------------------------------------------
def make_broad_targeting():
    t = json.loads(json.dumps(BASE_TARGETING))  # deep copy
    t["targeting_automation"] = {"advantage_audience": 1}
    return t


def make_interest_targeting(interests):
    t = json.loads(json.dumps(BASE_TARGETING))  # deep copy
    t["flexible_spec"] = [{
        "interests": [{"id": i["id"], "name": i["name"]} for i in interests]
    }]
    t["targeting_automation"] = {"advantage_audience": 0}
    return t


# --------------------------------------------------------------------------
# Plan
# --------------------------------------------------------------------------
def product_url(product, audience):
    sep = "&" if "?" in product["path"] else "?"
    return (
        f"{SITE}{product['path']}{sep}"
        "utm_source=facebook&utm_medium=cpc"
        "&utm_campaign=nb_launch_2026-05"
        f"&utm_content={audience}&utm_term={product['key']}"
    )


def build_plan(daily_budget_usd, use_conversions):
    objective = "OUTCOME_SALES" if use_conversions else "OUTCOME_TRAFFIC"
    optimization_goal = "OFFSITE_CONVERSIONS" if use_conversions else "LINK_CLICKS"
    budget_cents = int(round(daily_budget_usd * 100))
    items = []
    for p in PRODUCTS:
        adsets = []
        for variant in VARIANTS:
            audience = variant.lower()
            adsets.append({
                "variant": variant,
                "audience": audience,
                "adset_name": f"NB | {p['name']} | {variant}",
                "ad_name": f"NB | {p['name']} | {variant} Ad",
                "creative_name": f"NB Creative | {p['name']} | {variant}",
                "url": product_url(p, audience),
                "daily_budget_cents": budget_cents,
                "optimization_goal": optimization_goal,
            })
        items.append({
            "product": p,
            "image_path": UPLOADS / p["image"],
            "adsets": adsets,
        })
    return {
        "campaign_name": CAMPAIGN_NAME,
        "objective": objective,
        "use_conversions": use_conversions,
        "daily_budget_usd": daily_budget_usd,
        "interest_keywords": list(INTEREST_KEYWORDS),
        "items": items,
    }


def total_adsets(plan):
    return sum(len(item["adsets"]) for item in plan["items"])


def print_plan(plan):
    print("=" * 70)
    print("  NoodleBomb Meta Ads build plan — Broad vs. Interest A/B")
    print("=" * 70)
    print(f"  Campaign      : {plan['campaign_name']}")
    print(f"  Objective     : {plan['objective']}")
    mode = "purchase conversions (pixel)" if plan["use_conversions"] else "link-click traffic (no pixel)"
    print(f"  Optimization  : {mode}")
    n_adsets = total_adsets(plan)
    print(f"  Products      : {len(plan['items'])}  (2 UTM-specific creatives each)")
    print(f"  Ad sets       : {n_adsets}  (Broad + Interest per product)")
    print(f"  Budget        : ${plan['daily_budget_usd']:.2f}/day per ad set")
    total = plan["daily_budget_usd"] * n_adsets
    print(f"  Total at full spend: ${total:.2f}/day  (only once activated by hand)")
    print(f"  Interest set  : {', '.join(plan['interest_keywords'])}")
    print(f"  Status        : everything created PAUSED")
    print("-" * 70)
    missing = []
    for item in plan["items"]:
        p = item["product"]
        exists = item["image_path"].exists()
        flag = "ok" if exists else "MISSING"
        if not exists:
            missing.append(item["image_path"])
        print(f"  ▸ {p['name']}")
        print(f"      image    : uploads/{p['image']}  [{flag}]")
        print(f"      headline : {p['headline']}")
        print(f"      body     : {p['primary_text']}")
        for a in item["adsets"]:
            aud = ("Advantage+ broad audience" if a["audience"] == "broad"
                   else "interest-targeted audience")
            print(f"      • {a['variant']:8s} ad set — {aud}")
            print(f"          url  {a['url']}")
            print(f"          goal {a['optimization_goal']}  "
                  f"budget ${a['daily_budget_cents'] / 100:.2f}/day")
    print("=" * 70)
    return missing


# --------------------------------------------------------------------------
# Meta Graph API
# --------------------------------------------------------------------------
class MetaClient:
    def __init__(self, token, account_id, page_id, pixel_id):
        self.token = token
        self.account = account_id if account_id.startswith("act_") else f"act_{account_id}"
        self.page_id = page_id
        self.pixel_id = pixel_id

    def _post(self, path, data, files=None):
        data = dict(data)
        data["access_token"] = self.token
        resp = requests.post(f"{GRAPH}/{path}", data=data, files=files, timeout=90)
        return self._parse(resp, f"POST {path}")

    def _get(self, path, params):
        params = dict(params)
        params["access_token"] = self.token
        resp = requests.get(f"{GRAPH}/{path}", params=params, timeout=60)
        return self._parse(resp, f"GET {path}")

    @staticmethod
    def _parse(resp, label):
        try:
            body = resp.json()
        except ValueError:
            raise MetaApiError(f"{label} -> HTTP {resp.status_code}, non-JSON body:\n{resp.text}")
        if resp.status_code >= 400 or (isinstance(body, dict) and body.get("error")):
            err = body.get("error", body) if isinstance(body, dict) else body
            raise MetaApiError(f"{label} failed (HTTP {resp.status_code}):\n"
                               f"{json.dumps(err, indent=2)}")
        return body

    def search_interests(self, keywords):
        """Resolve interest keywords to Meta interest {id, name} objects.

        Skips keywords with no match; de-dupes by id. Raises if nothing
        resolved at all (so the build aborts before creating anything).
        """
        resolved = []
        seen = set()
        for kw in keywords:
            body = self._get("search", {"type": "adinterest", "q": kw, "limit": 5})
            hits = body.get("data") or []
            if not hits:
                print(f"    warning: no Meta interest matched '{kw}' — skipped")
                continue
            top = hits[0]
            if top["id"] in seen:
                continue
            seen.add(top["id"])
            resolved.append({"id": top["id"], "name": top.get("name", kw)})
            print(f"    '{kw}' -> {top.get('name', kw)} ({top['id']})")
        if not resolved:
            raise MetaApiError("No interests resolved — cannot build the interest ad sets.")
        return resolved

    def upload_image(self, image_path):
        with open(image_path.as_posix(), "rb") as fh:
            body = self._post(f"{self.account}/adimages",
                              data={}, files={"filename": (image_path.name, fh)})
        images = body.get("images") or {}
        if not images:
            raise MetaApiError(f"Image upload returned no hash for {image_path.name}")
        return next(iter(images.values()))["hash"]

    def create_campaign(self, name, objective):
        body = self._post(f"{self.account}/campaigns", {
            "name": name,
            "objective": objective,
            "status": "PAUSED",
            "special_ad_categories": json.dumps([]),
        })
        return body["id"]

    def create_adset(self, campaign_id, name, daily_budget_cents,
                     optimization_goal, targeting, use_conversions):
        data = {
            "name": name,
            "campaign_id": campaign_id,
            "daily_budget": daily_budget_cents,
            "billing_event": "IMPRESSIONS",
            "optimization_goal": optimization_goal,
            "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
            "status": "PAUSED",
            "targeting": json.dumps(targeting),
        }
        if use_conversions:
            data["destination_type"] = "WEBSITE"
            data["promoted_object"] = json.dumps({
                "pixel_id": self.pixel_id,
                "custom_event_type": "PURCHASE",
            })
        return self._post(f"{self.account}/adsets", data)["id"]

    def create_creative(self, name, url, headline, primary_text,
                        description, image_hash):
        object_story_spec = {
            "page_id": self.page_id,
            "link_data": {
                "link": url,
                "message": primary_text,
                "name": headline,
                "description": description,
                "image_hash": image_hash,
                "call_to_action": {"type": "SHOP_NOW", "value": {"link": url}},
            },
        }
        body = self._post(f"{self.account}/adcreatives", {
            "name": name,
            "object_story_spec": json.dumps(object_story_spec),
        })
        return body["id"]

    def create_ad(self, name, adset_id, creative_id):
        body = self._post(f"{self.account}/ads", {
            "name": name,
            "adset_id": adset_id,
            "creative": json.dumps({"creative_id": creative_id}),
            "status": "PAUSED",
        })
        return body["id"]


# --------------------------------------------------------------------------
# Execute
# --------------------------------------------------------------------------
def load_credentials():
    return {
        "META_ACCESS_TOKEN": os.environ.get("META_ACCESS_TOKEN"),
        "META_AD_ACCOUNT_ID": os.environ.get("META_AD_ACCOUNT_ID"),
        "META_PAGE_ID": os.environ.get("META_PAGE_ID"),
        "META_PIXEL_ID": os.environ.get("META_PIXEL_ID"),
    }


def execute(plan, client):
    created = []  # (kind, id) — printed on success and on failure for cleanup
    try:
        # Resolve interest targeting up front so a lookup failure aborts
        # the build before anything is created in the ad account.
        print("\nResolving interest targeting via Meta search API...")
        interests = client.search_interests(plan["interest_keywords"])
        broad_targeting = make_broad_targeting()
        interest_targeting = make_interest_targeting(interests)

        print(f"\nCreating campaign '{plan['campaign_name']}' (PAUSED)...")
        campaign_id = client.create_campaign(plan["campaign_name"], plan["objective"])
        created.append(("campaign", campaign_id))
        print(f"  campaign id: {campaign_id}")

        for item in plan["items"]:
            p = item["product"]
            print(f"\n{p['name']}")

            print(f"  uploading uploads/{p['image']}...")
            image_hash = client.upload_image(item["image_path"])
            print(f"    image_hash: {image_hash}")

            for a in item["adsets"]:
                targeting = (broad_targeting if a["audience"] == "broad"
                             else interest_targeting)
                print(f"  [{a['variant']}] creating ad creative...")
                creative_id = client.create_creative(
                    a["creative_name"], a["url"], p["headline"],
                    p["primary_text"], p["description"], image_hash)
                created.append(("creative", creative_id))
                print(f"    creative id: {creative_id}")

                print(f"  [{a['variant']}] creating ad set (PAUSED)...")
                adset_id = client.create_adset(
                    campaign_id, a["adset_name"], a["daily_budget_cents"],
                    a["optimization_goal"], targeting, plan["use_conversions"])
                created.append(("adset", adset_id))
                print(f"    adset id: {adset_id}")

                print(f"  [{a['variant']}] creating ad (PAUSED)...")
                ad_id = client.create_ad(a["ad_name"], adset_id, creative_id)
                created.append(("ad", ad_id))
                print(f"    ad id: {ad_id}")
    except MetaApiError as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        if created:
            print("\nObjects created before the failure (all PAUSED — "
                  "review/delete in Ads Manager):", file=sys.stderr)
            for kind, oid in created:
                print(f"  {kind}: {oid}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 70)
    print("  Done. All objects created PAUSED — nothing is spending.")
    print("  Review and activate them in Meta Ads Manager when ready.")
    print("=" * 70)
    for kind, oid in created:
        print(f"  {kind}: {oid}")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def load_env_file_if_present():
    for env_path in (META_ENV_FILE_WINDOWS, META_ENV_FILE_WSL):
        if not env_path.exists():
            continue
        for raw in env_path.read_text(encoding="utf-8-sig").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
        if not os.environ.get("META_ACCESS_TOKEN"):
            os.environ["META_ACCESS_TOKEN"] = os.environ.get("META_NOODLEBOMB_TOKEN", "")
        if not os.environ.get("META_PIXEL_ID"):
            os.environ["META_PIXEL_ID"] = os.environ.get("META_PIXEL_ID_NOODLEBOMB", "")
        if not os.environ.get("META_AD_ACCOUNT_ID"):
            os.environ["META_AD_ACCOUNT_ID"] = os.environ.get("META_NOODLEBOMB_AD_ACCOUNT_ID", "")
        return env_path.as_posix()
    return None


def main():
    parser = argparse.ArgumentParser(
        description="Build NoodleBomb Meta ad campaigns, Broad vs. Interest "
                    "A/B (all created PAUSED).")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true",
                      help="print the plan and validate inputs; no API calls")
    mode.add_argument("--execute", action="store_true",
                      help="create the campaign, ad sets, and ads in Meta")
    parser.add_argument("--budget", type=float, default=DEFAULT_DAILY_BUDGET_USD,
                        help=f"daily budget USD per ad set (default {DEFAULT_DAILY_BUDGET_USD})")
    parser.add_argument("--yes", action="store_true",
                        help="skip the confirmation prompt for --execute")
    args = parser.parse_args()

    if args.budget <= 0:
        sys.exit("--budget must be greater than 0")

    loaded_env = load_env_file_if_present()
    creds = load_credentials()
    use_conversions = bool(creds["META_PIXEL_ID"])
    plan = build_plan(args.budget, use_conversions)
    missing = print_plan(plan)

    if args.dry_run:
        print("\nDRY RUN — no API calls were made.")
        print("Interest ids are resolved live at --execute time via the "
              "Meta targeting search API.")
        print("Credentials check:")
        if loaded_env:
            print(f"  env file            : {loaded_env}")
        for key in ("META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID", "META_PAGE_ID"):
            print(f"  {key:20s}: {'set' if creds[key] else 'MISSING (required for --execute)'}")
        print(f"  {'META_PIXEL_ID':20s}: "
              f"{'set — campaign will optimize for purchases' if creds['META_PIXEL_ID'] else 'not set — campaign falls back to traffic'}")
        if missing:
            print("\nWARNING: missing creative image files:")
            for m in missing:
                print(f"  {m}")
        return

    # --execute
    if missing:
        print("\nERROR: cannot execute — missing creative image files:", file=sys.stderr)
        for m in missing:
            print(f"  {m}", file=sys.stderr)
        sys.exit(1)

    required = ("META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID", "META_PAGE_ID")
    absent = [k for k in required if not creds[k]]
    if absent:
        sys.exit("ERROR: missing required environment variables: " + ", ".join(absent))

    if not args.yes:
        if not sys.stdin.isatty():
            sys.exit("Refusing to --execute non-interactively. Re-run with --yes to confirm.")
        n_adsets = total_adsets(plan)
        total = args.budget * n_adsets
        answer = input(
            f"\nCreate this campaign with {n_adsets} ad sets in Meta? "
            f"All PAUSED; potential ${total:.2f}/day once activated. [y/N] "
        ).strip().lower()
        if answer not in ("y", "yes"):
            sys.exit("Aborted.")

    client = MetaClient(
        creds["META_ACCESS_TOKEN"], creds["META_AD_ACCOUNT_ID"],
        creds["META_PAGE_ID"], creds["META_PIXEL_ID"])
    execute(plan, client)


if __name__ == "__main__":
    main()

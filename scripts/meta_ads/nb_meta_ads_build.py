#!/usr/bin/env python3
"""NoodleBomb Meta (Facebook/Instagram) Ads build script.

Creates a conversion-focused Meta ad campaign for the NoodleBomb ramen
sauces using the Meta Marketing (Graph) API. One campaign, one ad set per
product, one link ad per ad set. Creatives reuse the studio product photos
already committed under uploads/.

SAFETY
  Everything is created with status=PAUSED — campaign, ad sets, and ads.
  Nothing spends money or goes live until you activate it by hand in Meta
  Ads Manager. This script never sets anything ACTIVE.

USAGE
  python nb_meta_ads_build.py --dry-run     # print the plan, no API calls
  python nb_meta_ads_build.py --execute     # create everything (PAUSED)
  python nb_meta_ads_build.py --execute --yes        # skip confirmation
  python nb_meta_ads_build.py --execute --budget 35  # $35/day per ad set

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
"""
import argparse
import json
import os
import sys
from pathlib import Path

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

CAMPAIGN_NAME = "NoodleBomb — Ramen Sauce"
DEFAULT_DAILY_BUDGET_USD = 20.0  # per ad set

# Broad US targeting. Advantage+ audience lets Meta find buyers rather than
# hard-coding brittle interest ids that drift over time.
TARGETING = {
    "geo_locations": {"countries": ["US"]},
    "age_min": 21,
    "age_max": 60,
    "targeting_automation": {"advantage_audience": 1},
}

# slug -> ad copy + creative. image is a filename under uploads/.
PRODUCTS = [
    {
        "key": "original",
        "name": "Original Ramen Sauce",
        "path": "/original-ramen-sauce",
        "price": "$11.99",
        "image": "nb-original-front-studio-v1.jpg",
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
        "path": "/spicy-tokyo-ramen-sauce",
        "price": "$11.99",
        "image": "nb-spicy-front-studio-v1.jpg",
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
        "path": "/citrus-shoyu-ramen-sauce",
        "price": "$11.99",
        "image": "nb-citrus-front-studio-v1.jpg",
        "headline": "Bright, Citrusy, Crave-Worthy",
        "primary_text": (
            "Yuzu-bright shoyu that wakes up any bowl of noodles. "
            "NoodleBomb Citrus Shoyu — balanced, zesty, ridiculously good."
        ),
        "description": "Citrus Shoyu Ramen Sauce — $11.99",
    },
    {
        "key": "trio",
        "name": "The NoodleBomb Trio",
        "path": "/",
        "price": "$29.99",
        "image": "nb-hero-trio-studio-v1.jpg",
        "headline": "All 3 Flavors. One Box.",
        "primary_text": (
            "Can't pick a favorite? The NoodleBomb Trio has Original, "
            "Spicy Tokyo, and Citrus Shoyu — your whole ramen night "
            "sorted. Save when you bundle."
        ),
        "description": "The NoodleBomb Trio — $29.99",
    },
]


class MetaApiError(RuntimeError):
    pass


# --------------------------------------------------------------------------
# Plan
# --------------------------------------------------------------------------
def product_url(product):
    sep = "&" if "?" in product["path"] else "?"
    return (
        f"{SITE}{product['path']}{sep}"
        f"utm_source=facebook&utm_medium=paid"
        f"&utm_campaign=nb-ramen-sauce&utm_content={product['key']}"
    )


def build_plan(daily_budget_usd, use_conversions):
    objective = "OUTCOME_SALES" if use_conversions else "OUTCOME_TRAFFIC"
    optimization_goal = "OFFSITE_CONVERSIONS" if use_conversions else "LINK_CLICKS"
    adsets = []
    for p in PRODUCTS:
        adsets.append(
            {
                "product": p,
                "adset_name": f"NB | {p['name']}",
                "ad_name": f"NB | {p['name']} | Link Ad",
                "creative_name": f"NB Creative | {p['name']}",
                "url": product_url(p),
                "image_path": UPLOADS / p["image"],
                "daily_budget_cents": int(round(daily_budget_usd * 100)),
                "optimization_goal": optimization_goal,
            }
        )
    return {
        "campaign_name": CAMPAIGN_NAME,
        "objective": objective,
        "use_conversions": use_conversions,
        "daily_budget_usd": daily_budget_usd,
        "adsets": adsets,
    }


def print_plan(plan):
    print("=" * 68)
    print(f"  NoodleBomb Meta Ads build plan")
    print("=" * 68)
    print(f"  Campaign      : {plan['campaign_name']}")
    print(f"  Objective     : {plan['objective']}")
    mode = "purchase conversions (pixel)" if plan["use_conversions"] else "link-click traffic (no pixel)"
    print(f"  Optimization  : {mode}")
    print(f"  Ad sets       : {len(plan['adsets'])}")
    print(f"  Budget        : ${plan['daily_budget_usd']:.2f}/day per ad set")
    total = plan["daily_budget_usd"] * len(plan["adsets"])
    print(f"  Total at full spend: ${total:.2f}/day  (only once activated by hand)")
    print(f"  Status        : everything created PAUSED")
    print("-" * 68)
    missing = []
    for a in plan["adsets"]:
        p = a["product"]
        exists = a["image_path"].exists()
        flag = "ok" if exists else "MISSING"
        if not exists:
            missing.append(a["image_path"])
        print(f"  • {a['adset_name']}")
        print(f"      url      : {a['url']}")
        print(f"      image    : uploads/{p['image']}  [{flag}]")
        print(f"      headline : {p['headline']}")
        print(f"      body     : {p['primary_text']}")
        print(f"      goal     : {a['optimization_goal']}  "
              f"budget ${a['daily_budget_cents'] / 100:.2f}/day")
    print("=" * 68)
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

    def _call(self, path, data, files=None):
        data = dict(data)
        data["access_token"] = self.token
        resp = requests.post(f"{GRAPH}/{path}", data=data, files=files, timeout=90)
        try:
            body = resp.json()
        except ValueError:
            raise MetaApiError(f"POST {path} -> HTTP {resp.status_code}, non-JSON body:\n{resp.text}")
        if resp.status_code >= 400 or (isinstance(body, dict) and body.get("error")):
            err = body.get("error", body)
            raise MetaApiError(f"POST {path} failed (HTTP {resp.status_code}):\n"
                               f"{json.dumps(err, indent=2)}")
        return body

    def upload_image(self, image_path):
        with open(image_path, "rb") as fh:
            body = self._call(f"{self.account}/adimages",
                              data={}, files={"filename": (image_path.name, fh)})
        images = body.get("images") or {}
        if not images:
            raise MetaApiError(f"Image upload returned no hash for {image_path.name}")
        return next(iter(images.values()))["hash"]

    def create_campaign(self, name, objective):
        body = self._call(f"{self.account}/campaigns", {
            "name": name,
            "objective": objective,
            "status": "PAUSED",
            "special_ad_categories": json.dumps([]),
        })
        return body["id"]

    def create_adset(self, campaign_id, name, daily_budget_cents,
                     optimization_goal, use_conversions):
        data = {
            "name": name,
            "campaign_id": campaign_id,
            "daily_budget": daily_budget_cents,
            "billing_event": "IMPRESSIONS",
            "optimization_goal": optimization_goal,
            "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
            "status": "PAUSED",
            "targeting": json.dumps(TARGETING),
        }
        if use_conversions:
            data["destination_type"] = "WEBSITE"
            data["promoted_object"] = json.dumps({
                "pixel_id": self.pixel_id,
                "custom_event_type": "PURCHASE",
            })
        return self._call(f"{self.account}/adsets", data)["id"]

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
        body = self._call(f"{self.account}/adcreatives", {
            "name": name,
            "object_story_spec": json.dumps(object_story_spec),
        })
        return body["id"]

    def create_ad(self, name, adset_id, creative_id):
        body = self._call(f"{self.account}/ads", {
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
    creds = {
        "META_ACCESS_TOKEN": os.environ.get("META_ACCESS_TOKEN"),
        "META_AD_ACCOUNT_ID": os.environ.get("META_AD_ACCOUNT_ID"),
        "META_PAGE_ID": os.environ.get("META_PAGE_ID"),
        "META_PIXEL_ID": os.environ.get("META_PIXEL_ID"),
    }
    return creds


def execute(plan, client):
    created = []  # (kind, id) — printed on success and on failure for cleanup
    try:
        print(f"\nCreating campaign '{plan['campaign_name']}' (PAUSED)...")
        campaign_id = client.create_campaign(plan["campaign_name"], plan["objective"])
        created.append(("campaign", campaign_id))
        print(f"  campaign id: {campaign_id}")

        for a in plan["adsets"]:
            p = a["product"]
            print(f"\n{p['name']}")

            print(f"  uploading uploads/{p['image']}...")
            image_hash = client.upload_image(a["image_path"])
            print(f"    image_hash: {image_hash}")

            print(f"  creating ad set (PAUSED)...")
            adset_id = client.create_adset(
                campaign_id, a["adset_name"], a["daily_budget_cents"],
                a["optimization_goal"], plan["use_conversions"])
            created.append(("adset", adset_id))
            print(f"    adset id: {adset_id}")

            print(f"  creating ad creative...")
            creative_id = client.create_creative(
                a["creative_name"], a["url"], p["headline"],
                p["primary_text"], p["description"], image_hash)
            created.append(("creative", creative_id))
            print(f"    creative id: {creative_id}")

            print(f"  creating ad (PAUSED)...")
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

    print("\n" + "=" * 68)
    print("  Done. All objects created PAUSED — nothing is spending.")
    print("  Review and activate them in Meta Ads Manager when ready.")
    print("=" * 68)
    for kind, oid in created:
        print(f"  {kind}: {oid}")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Build NoodleBomb Meta ad campaigns (all created PAUSED).")
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

    creds = load_credentials()
    use_conversions = bool(creds["META_PIXEL_ID"])
    plan = build_plan(args.budget, use_conversions)
    missing = print_plan(plan)

    if args.dry_run:
        print("\nDRY RUN — no API calls were made.")
        print("Credentials check:")
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
        total = args.budget * len(plan["adsets"])
        answer = input(
            f"\nCreate this campaign with {len(plan['adsets'])} ad sets in Meta? "
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

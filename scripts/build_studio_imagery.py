"""Rebuild NoodleBomb bottle imagery from 9 studio shots.

Outputs (under uploads/):
  nb-production-trio-hero-2026-05.jpg      1500x800 — canon-order trio on warm dark backdrop
  nb-original-legacy-studio-front.jpg 1024x1024 — bottle on clean white
  nb-spicy-legacy-studio-front.jpg    1024x1024
  nb-citrus-legacy-studio-front.jpg   1024x1024
  nb-original-legacy-isolated.png           transparent PNG (overwrites old) — bottle isolated
  nb-spicy-legacy-isolated.png        transparent PNG (overwrites old)
  nb-citrus-legacy-isolated.png       transparent PNG (overwrites old)
  nb-production-trio-hero-2026-05.jpg             1200x800 — canon-order trio on warm dark (overwrites old)
  nb-legacy-trio-flatlay.png             same hero composite (overwrites old wrong-order)
  nb-legacy-trio-counter-warm.png   same hero composite (overwrites old)
  nb-legacy-trio-kitchen-action.png same hero composite (overwrites old)
"""
from PIL import Image, ImageFilter, ImageDraw
from pathlib import Path

SRC = Path(r"C:/Users/12534/AppData/Roaming/Claude/local-agent-mode-sessions/014ec544-dc3f-4301-a687-7318e75ffd03/ee922d0f-37d8-4f9b-a9c7-e2f14525a99c/agent/local_ditto_ee922d0f-37d8-4f9b-a9c7-e2f14525a99c/uploads")
OUT = Path(r"C:/tmp/noodlebomb/uploads")

ORIGINAL_FRONT = SRC / "363840f1-A1BCDF735AE54804B640AE8F6F4854A7.png"
SPICY_FRONT    = SRC / "c4803f16-8B9049C342F84792BA79DD5B5798905A.png"
CITRUS_FRONT   = SRC / "68098329-A594AEE6A18C4915969AA9EEED4264E0.png"

DARK_BG = (26, 20, 16)   # #1A1410 warm dark
PAPER_BG = (245, 241, 234)  # site --paper-2 light cream — fallback


def remove_white_bg(img: Image.Image, threshold: int = 240, soft: int = 8) -> Image.Image:
    """Threshold-based near-white removal with soft edge.
    Pure near-neutral pixels above `threshold` go fully transparent;
    a `soft`-pixel ramp keeps anti-aliased edges from looking jagged.
    Trusts the studio backdrop being uniformly white — this is NOT a chroma keyer.
    """
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    # Build alpha by whiteness: alpha = clip((max_chan - threshold) / soft) inverse
    alpha = Image.new("L", (w, h), 255)
    a_px = alpha.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            mn, mx = min(r, g, b), max(r, g, b)
            # near-white = bright AND low channel variance
            if mn >= threshold and (mx - mn) <= 6:
                # Smooth ramp: at threshold alpha=255-fade-start, at 255 alpha=0
                # Map mn from [threshold, threshold+soft] -> alpha [255, 0]
                if mn >= threshold + soft:
                    a_px[x, y] = 0
                else:
                    a_px[x, y] = int(255 * (1 - (mn - threshold) / soft))
            else:
                a_px[x, y] = 255
    # Slight blur on alpha for soft anti-aliased edge
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=1.0))
    img.putalpha(alpha)
    return img


def crop_to_bottle(img_rgba: Image.Image, padding: int = 12) -> Image.Image:
    """Crop to the alpha bbox (the bottle) plus small padding."""
    bbox = img_rgba.getbbox()
    if bbox is None:
        return img_rgba
    x0, y0, x1, y1 = bbox
    w, h = img_rgba.size
    x0 = max(0, x0 - padding)
    y0 = max(0, y0 - padding)
    x1 = min(w, x1 + padding)
    y1 = min(h, y1 + padding)
    return img_rgba.crop((x0, y0, x1, y1))


def fit_to_canvas(bottle: Image.Image, canvas_w: int, canvas_h: int,
                  bg_rgb=None, bottle_height_frac=0.85,
                  shadow=True) -> Image.Image:
    """Place the (transparent) bottle centered on a canvas, scaled so its height
    is bottle_height_frac of the canvas. bg_rgb=None -> transparent PNG.
    """
    bw, bh = bottle.size
    target_h = int(canvas_h * bottle_height_frac)
    scale = target_h / bh
    new_w = int(bw * scale)
    new_h = target_h
    bottle_resized = bottle.resize((new_w, new_h), Image.LANCZOS)

    if bg_rgb is None:
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    else:
        canvas = Image.new("RGBA", (canvas_w, canvas_h), bg_rgb + (255,))

    # Add a subtle drop shadow for grounding (only for non-transparent canvases)
    if shadow and bg_rgb is not None:
        shadow_img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        # Use alpha mask blurred
        sx = (canvas_w - new_w) // 2
        sy = (canvas_h - new_h) // 2 + int(new_h * 0.04)  # slight downward offset
        # Build elliptical shadow under bottle
        shadow_draw = Image.new("L", (canvas_w, canvas_h), 0)
        d = ImageDraw.Draw(shadow_draw)
        sw = int(new_w * 0.85)
        sh = int(new_h * 0.06)
        scx = sx + new_w // 2
        scy = sy + new_h - sh // 2 + int(new_h * 0.02)
        d.ellipse((scx - sw // 2, scy - sh // 2, scx + sw // 2, scy + sh // 2), fill=80)
        shadow_blur = shadow_draw.filter(ImageFilter.GaussianBlur(radius=18))
        shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        shadow_layer.putalpha(shadow_blur)
        canvas = Image.alpha_composite(canvas, shadow_layer)

    px = (canvas_w - new_w) // 2
    py = (canvas_h - new_h) // 2
    canvas.alpha_composite(bottle_resized, (px, py))
    return canvas


def build_trio_composite(canvas_w: int, canvas_h: int, bg_rgb,
                         left_b: Image.Image, mid_b: Image.Image, right_b: Image.Image,
                         shadow=True, bottle_height_frac=0.78) -> Image.Image:
    """Lay 3 bottles canon-order on a single backdrop."""
    canvas = Image.new("RGBA", (canvas_w, canvas_h), bg_rgb + (255,))

    # Normalize all three to same height
    bottles = [left_b, mid_b, right_b]
    target_h = int(canvas_h * bottle_height_frac)
    scaled = []
    for b in bottles:
        bw, bh = b.size
        scale = target_h / bh
        scaled.append(b.resize((int(bw * scale), target_h), Image.LANCZOS))

    total_bottle_w = sum(s.size[0] for s in scaled)
    margin_side = int(canvas_w * 0.06)
    available = canvas_w - 2 * margin_side - total_bottle_w
    gap = available // 2  # 2 gaps between 3 bottles

    if gap < 0:
        # Shrink bottles uniformly to fit
        ratio = (canvas_w - 2 * margin_side - 40) / total_bottle_w
        scaled = [s.resize((int(s.size[0] * ratio), int(s.size[1] * ratio)), Image.LANCZOS)
                  for s in scaled]
        total_bottle_w = sum(s.size[0] for s in scaled)
        gap = (canvas_w - 2 * margin_side - total_bottle_w) // 2
        target_h = scaled[0].size[1]

    y_baseline_offset = int(canvas_h * 0.04)  # bottles slightly below center for grounding
    py = (canvas_h - target_h) // 2 + y_baseline_offset

    # Draw shadows under each bottle
    if shadow:
        shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        cx = margin_side
        for s in scaled:
            sw_ell = int(s.size[0] * 0.85)
            sh_ell = int(s.size[1] * 0.05)
            scx = cx + s.size[0] // 2
            scy = py + s.size[1] - sh_ell // 2 + int(s.size[1] * 0.02)
            sd.ellipse((scx - sw_ell // 2, scy - sh_ell // 2,
                        scx + sw_ell // 2, scy + sh_ell // 2),
                       fill=(0, 0, 0, 110))
            cx += s.size[0] + gap
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=22))
        canvas = Image.alpha_composite(canvas, shadow_layer)

    # Place bottles
    cx = margin_side
    for s in scaled:
        canvas.alpha_composite(s, (cx, py))
        cx += s.size[0] + gap

    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    print("Loading + isolating bottles...")
    orig_iso = remove_white_bg(Image.open(ORIGINAL_FRONT))
    spicy_iso = remove_white_bg(Image.open(SPICY_FRONT))
    citrus_iso = remove_white_bg(Image.open(CITRUS_FRONT))

    orig_iso = crop_to_bottle(orig_iso)
    spicy_iso = crop_to_bottle(spicy_iso)
    citrus_iso = crop_to_bottle(citrus_iso)

    print(f"  orig: {orig_iso.size}, spicy: {spicy_iso.size}, citrus: {citrus_iso.size}")

    # ---- Hero composite (1500x800, dark editorial) ----
    print("Building hero (1500x800, dark backdrop)...")
    hero = build_trio_composite(1500, 800, DARK_BG,
                                 orig_iso, spicy_iso, citrus_iso,
                                 shadow=True, bottle_height_frac=0.80)
    hero_jpg = hero.convert("RGB")
    hero_jpg.save(OUT / "nb-production-trio-hero-2026-05.jpg", "JPEG", quality=92, optimize=True)
    print(f"  -> uploads/nb-production-trio-hero-2026-05.jpg ({(OUT/'nb-production-trio-hero-2026-05.jpg').stat().st_size/1024:.1f}KB)")

    # ---- nb-production-trio-hero-2026-05.jpg — 1200x800 dark backdrop (overwrites old wrong-design) ----
    print("Building nb-production-trio-hero-2026-05.jpg (1200x800, dark)...")
    trio_dark = build_trio_composite(1200, 800, DARK_BG,
                                      orig_iso, spicy_iso, citrus_iso,
                                      shadow=True, bottle_height_frac=0.82)
    trio_dark.convert("RGB").save(OUT / "nb-production-trio-hero-2026-05.jpg", "PNG", optimize=True)
    print(f"  -> uploads/nb-production-trio-hero-2026-05.jpg")

    # ---- Other trio replacements: all use the canon hero composite ----
    print("Replacing wrong-order trio files with hero composite...")
    for name in ["nb-legacy-trio-flatlay.png", "nb-legacy-trio-counter-warm.png",
                 "nb-legacy-trio-kitchen-action.png"]:
        # 1500x800 same composite, light cream backdrop for variety where needed?
        # Spec says replace with canon-order. Keep dark to match site's dark hero frame.
        hero.convert("RGB").save(OUT / name, "PNG", optimize=True)
        print(f"  -> uploads/{name}")

    # ---- Individual SKU PDP shots — clean white BG, 1024x1024 ----
    print("Building individual SKU PDP shots (1024x1024 white)...")
    for iso, name in [(orig_iso, "nb-original-legacy-studio-front.jpg"),
                       (spicy_iso, "nb-spicy-legacy-studio-front.jpg"),
                       (citrus_iso, "nb-citrus-legacy-studio-front.jpg")]:
        canvas = fit_to_canvas(iso, 1024, 1024, bg_rgb=(255, 255, 255),
                                bottle_height_frac=0.86, shadow=True)
        canvas.convert("RGB").save(OUT / name, "JPEG", quality=94, optimize=True)
        print(f"  -> uploads/{name}")

    # ---- Transparent isolated PNGs for legacy audit/reference work ----
    print("Building transparent isolated PNGs for legacy reference...")
    for iso, name in [(orig_iso, "nb-original-legacy-isolated.png"),
                       (spicy_iso, "nb-spicy-legacy-isolated.png"),
                       (citrus_iso, "nb-citrus-legacy-isolated.png")]:
        # Match aspect of original-ish (~600x1450 — tall portrait)
        # Compute target so bottle fits naturally with same padding
        iw, ih = iso.size
        target_w = 700
        scale = target_w / iw
        target_h = int(ih * scale)
        canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
        resized = iso.resize((target_w, target_h), Image.LANCZOS)
        canvas.alpha_composite(resized, (0, 0))
        canvas.save(OUT / name, "PNG", optimize=True)
        print(f"  -> uploads/{name}")

    print("\nDone.")


if __name__ == "__main__":
    main()

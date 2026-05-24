from __future__ import annotations

import csv
import html
import json
import math
import statistics
from collections import Counter
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "data" / "shelf-impact-inputs.json"
OUTPUT_DIR = ROOT / "tmp" / "shelf-impact-analyzer"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


@dataclass
class ImageMetrics:
    id: str
    name: str
    role: str
    path: str
    width: int
    height: int
    average_luminance: float
    average_saturation: float
    contrast: float
    edge_density: float
    colorfulness: float
    white_or_light_ratio: float
    dark_ratio: float
    transparent_ratio: float
    dominant_colors: list[dict[str, object]]
    readability_score: int
    color_uniqueness_score: int
    premium_perception_score: int
    shelf_visibility_score: int
    total_score: int
    risk_tier: str
    recommendations: list[str]


def clamp(value: float, lower: float = 0, upper: float = 100) -> float:
    return max(lower, min(upper, value))


def scale(value: float, low: float, high: float) -> float:
    if high == low:
        return 0
    return clamp(((value - low) / (high - low)) * 100)


def percentile(values: list[float], percent: float) -> float:
    if not values:
        return 0
    ordered = sorted(values)
    index = (len(ordered) - 1) * (percent / 100)
    lower = math.floor(index)
    upper = math.ceil(index)
    if lower == upper:
        return ordered[int(index)]
    weight = index - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def luminance(pixel: tuple[int, int, int]) -> float:
    r, g, b = pixel
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def saturation(pixel: tuple[int, int, int]) -> float:
    r, g, b = [channel / 255 for channel in pixel]
    high = max(r, g, b)
    low = min(r, g, b)
    if high == 0:
        return 0
    return (high - low) / high


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    clean = value.strip().lstrip("#")
    return tuple(int(clean[i : i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(pixel: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*pixel)


def color_distance(left: tuple[int, int, int], right: tuple[int, int, int]) -> float:
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(left, right)))


def resolve_path(value: str) -> Path:
    raw = value.replace("\\", "/")
    if raw.startswith("/"):
        raw = raw.lstrip("/")
    path = Path(raw)
    if path.is_absolute():
        return path
    return ROOT / path


def load_image(path: Path) -> Image.Image:
    image = Image.open(path)
    image = ImageOps.exif_transpose(image)
    return image.convert("RGBA")


def sample_rgba(image: Image.Image, size: int = 180) -> list[tuple[int, int, int, int]]:
    sample = image.copy()
    sample.thumbnail((size, size))
    if hasattr(sample, "get_flattened_data"):
        return list(sample.get_flattened_data())
    return list(sample.getdata())


def dominant_colors(pixels: list[tuple[int, int, int, int]], limit: int = 7) -> list[dict[str, object]]:
    visible = [(r, g, b) for r, g, b, a in pixels if a > 24]
    if not visible:
        return []

    total = len(visible)
    buckets: Counter[tuple[int, int, int]] = Counter()
    for r, g, b in visible:
        bucket = (round(r / 24) * 24, round(g / 24) * 24, round(b / 24) * 24)
        bucket = tuple(int(clamp(channel, 0, 255)) for channel in bucket)
        buckets[bucket] += 1

    colors = []
    for color, count in buckets.most_common(limit):
        colors.append(
            {
                "hex": rgb_to_hex(color),
                "rgb": list(color),
                "share": round(count / total, 4),
                "luminance": round(luminance(color), 1),
                "saturation": round(saturation(color), 3),
            }
        )
    return colors


def colorfulness_score(rgb_pixels: list[tuple[int, int, int]]) -> float:
    if not rgb_pixels:
        return 0
    rg = [r - g for r, g, _ in rgb_pixels]
    yb = [0.5 * (r + g) - b for r, g, b in rgb_pixels]
    std_root = math.sqrt(statistics.pstdev(rg) ** 2 + statistics.pstdev(yb) ** 2)
    mean_root = math.sqrt(statistics.mean(rg) ** 2 + statistics.mean(yb) ** 2)
    return std_root + (0.3 * mean_root)


def competitor_palette(config: dict) -> list[tuple[int, int, int]]:
    colors: list[tuple[int, int, int]] = []
    competitor_dir = resolve_path(config.get("competitorImageDirectory", "data/shelf-impact-competitors"))
    if competitor_dir.exists():
        for file_path in competitor_dir.iterdir():
            if file_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            try:
                metrics = raw_image_metrics(file_path)
                for color in metrics["dominant_colors"]:
                    colors.append(tuple(color["rgb"]))
            except Exception:
                continue

    if colors:
        return colors

    for competitor in config.get("virtualCompetitors", []):
        for color in competitor.get("colors", []):
            colors.append(hex_to_rgb(color))
    return colors


def has_competitor_images(config: dict) -> bool:
    competitor_dir = resolve_path(config.get("competitorImageDirectory", "data/shelf-impact-competitors"))
    return competitor_dir.exists() and any(path.suffix.lower() in IMAGE_EXTENSIONS for path in competitor_dir.iterdir())


def uniqueness_score(dominants: list[dict[str, object]], competitor_colors: list[tuple[int, int, int]]) -> int:
    candidate_colors: list[tuple[int, int, int]] = []
    for color in dominants:
        rgb = tuple(color["rgb"])
        sat = float(color["saturation"])
        lum = float(color["luminance"])
        if sat >= 0.16 and 28 <= lum <= 232:
            candidate_colors.append(rgb)

    if not candidate_colors:
        candidate_colors = [tuple(color["rgb"]) for color in dominants[:3]]

    if not candidate_colors or not competitor_colors:
        return 60

    minimum_distances = []
    for color in candidate_colors[:4]:
        minimum_distances.append(min(color_distance(color, competitor) for competitor in competitor_colors))

    distance = statistics.mean(minimum_distances)
    return int(round(scale(distance, 36, 190)))


def raw_image_metrics(path: Path) -> dict[str, object]:
    image = load_image(path)
    pixels = sample_rgba(image)
    visible_rgb = [(r, g, b) for r, g, b, a in pixels if a > 24]
    lums = [luminance(pixel) for pixel in visible_rgb]
    sats = [saturation(pixel) for pixel in visible_rgb]
    transparent_count = sum(1 for *_, a in pixels if a <= 24)
    white_count = sum(1 for pixel in visible_rgb if luminance(pixel) > 214 and saturation(pixel) < 0.18)
    dark_count = sum(1 for pixel in visible_rgb if luminance(pixel) < 52)

    composited = Image.new("RGBA", image.size, "#ffffff")
    composited.alpha_composite(image)
    gray = composited.convert("L")
    edge = gray.resize((160, 160)).filter(ImageFilter.FIND_EDGES)
    edge_density = ImageStatMean(edge) / 255

    contrast = percentile(lums, 95) - percentile(lums, 5)
    return {
        "width": image.width,
        "height": image.height,
        "average_luminance": statistics.mean(lums) if lums else 0,
        "average_saturation": statistics.mean(sats) if sats else 0,
        "contrast": contrast,
        "edge_density": edge_density,
        "colorfulness": colorfulness_score(visible_rgb),
        "white_or_light_ratio": white_count / len(visible_rgb) if visible_rgb else 0,
        "dark_ratio": dark_count / len(visible_rgb) if visible_rgb else 0,
        "transparent_ratio": transparent_count / len(pixels) if pixels else 0,
        "dominant_colors": dominant_colors(pixels),
    }


def ImageStatMean(image: Image.Image) -> float:
    histogram = image.histogram()
    total = sum(histogram)
    if total == 0:
        return 0
    return sum(value * count for value, count in enumerate(histogram)) / total


def risk_tier(total: int, readability: int) -> str:
    if total >= 78 and readability >= 72:
        return "STRONG"
    if total >= 64 and readability >= 58:
        return "WATCH"
    return "FIX BEFORE PRINT"


def recommendations_for(image_id: str, name: str, metrics: dict[str, object], scores: dict[str, int]) -> list[str]:
    recommendations: list[str] = []

    if scores["readability_score"] < 72:
        recommendations.append(
            "Increase front-panel hierarchy: make the flavor name 15-20% taller and give it a stronger dark/light block behind the text."
        )
    if scores["color_uniqueness_score"] < 68:
        recommendations.append(
            "Own a more distinct shelf cue: add a clear flavor color band or cap/neck mark that is visible from 6-8 feet."
        )
    if scores["premium_perception_score"] < 72:
        recommendations.append(
            "Reduce small secondary copy and keep more negative space around the logo and flavor name."
        )
    if float(metrics["white_or_light_ratio"]) > 0.48 and float(metrics["contrast"]) < 132:
        recommendations.append(
            "Avoid the label disappearing into white shelf tags by adding a darker outer border or deeper masthead."
        )
    if float(metrics["average_saturation"]) > 0.5:
        recommendations.append(
            "Keep the strong color, but anchor it with black or parchment so it reads craft rather than novelty."
        )

    flavor_notes = {
        "original": "Original should stay calm and pantry-premium, but needs one unmistakable NoodleBomb mark so it does not blend into cream labels.",
        "spicy-tokyo": "Spicy Tokyo can win attention, but red-orange is crowded; keep the heat cue and add a sharper black/cream contrast lockup.",
        "citrus-shoyu": "Citrus Shoyu should lean harder into a bright citrus accent so shoppers understand the flavor before reading the details.",
        "shoyu-reserve": "Shoyu Reserve already feels premium; protect that restraint while adding one high-contrast name strip for distance readability.",
    }
    recommendations.append(flavor_notes.get(image_id, f"{name} should keep one dominant shelf cue and cut anything that competes with it."))
    return recommendations[:5]


def analyze_brand_image(item: dict, competitor_colors: list[tuple[int, int, int]]) -> ImageMetrics:
    path = resolve_path(item["path"])
    metrics = raw_image_metrics(path)

    contrast_score = scale(float(metrics["contrast"]), 42, 178)
    edge_score = scale(float(metrics["edge_density"]), 0.012, 0.085)
    if float(metrics["edge_density"]) > 0.13:
        edge_score -= scale(float(metrics["edge_density"]), 0.13, 0.28) * 0.45
    balance_score = 100 - abs(float(metrics["average_luminance"]) - 148) * 0.45
    readability = int(round(clamp((contrast_score * 0.58) + (edge_score * 0.24) + (balance_score * 0.18))))

    uniqueness = uniqueness_score(metrics["dominant_colors"], competitor_colors)
    color_power = scale(float(metrics["colorfulness"]), 18, 78)
    visibility = int(round(clamp((readability * 0.42) + (uniqueness * 0.28) + (color_power * 0.2) + (contrast_score * 0.1))))

    palette_count = len([color for color in metrics["dominant_colors"] if float(color["share"]) > 0.025])
    palette_control = clamp(110 - max(0, palette_count - 5) * 12)
    saturation_balance = 100 - abs(float(metrics["average_saturation"]) - 0.28) * 145
    neutral_foundation = clamp((float(metrics["white_or_light_ratio"]) + float(metrics["dark_ratio"]) + float(metrics["transparent_ratio"]) * 0.45) * 120)
    premium = int(round(clamp((contrast_score * 0.32) + (palette_control * 0.24) + (saturation_balance * 0.22) + (neutral_foundation * 0.22))))

    total = int(round(clamp((visibility * 0.34) + (readability * 0.25) + (uniqueness * 0.21) + (premium * 0.2))))
    scores = {
        "readability_score": readability,
        "color_uniqueness_score": uniqueness,
        "premium_perception_score": premium,
        "shelf_visibility_score": visibility,
    }

    return ImageMetrics(
        id=item["id"],
        name=item["name"],
        role=item.get("role", ""),
        path=str(path.relative_to(ROOT)),
        width=int(metrics["width"]),
        height=int(metrics["height"]),
        average_luminance=round(float(metrics["average_luminance"]), 1),
        average_saturation=round(float(metrics["average_saturation"]), 3),
        contrast=round(float(metrics["contrast"]), 1),
        edge_density=round(float(metrics["edge_density"]), 4),
        colorfulness=round(float(metrics["colorfulness"]), 1),
        white_or_light_ratio=round(float(metrics["white_or_light_ratio"]), 3),
        dark_ratio=round(float(metrics["dark_ratio"]), 3),
        transparent_ratio=round(float(metrics["transparent_ratio"]), 3),
        dominant_colors=metrics["dominant_colors"],
        readability_score=readability,
        color_uniqueness_score=uniqueness,
        premium_perception_score=premium,
        shelf_visibility_score=visibility,
        total_score=total,
        risk_tier=risk_tier(total, readability),
        recommendations=recommendations_for(item["id"], item["name"], metrics, scores),
    )


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def text_fit(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paste_contained(canvas: Image.Image, image_path: Path, box: tuple[int, int, int, int]) -> None:
    image = load_image(image_path)
    image.thumbnail((box[2] - box[0], box[3] - box[1]))
    x = box[0] + ((box[2] - box[0]) - image.width) // 2
    y = box[1] + ((box[3] - box[1]) - image.height) // 2
    shadow = Image.new("RGBA", (image.width, image.height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((12, image.height - 20, image.width - 12, image.height - 2), fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    canvas.alpha_composite(shadow, (x, y + 7))
    canvas.alpha_composite(image, (x, y))


def draw_virtual_competitor(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], competitor: dict) -> None:
    colors = [hex_to_rgb(color) for color in competitor.get("colors", ["#111111", "#ffffff"])]
    x1, y1, x2, y2 = box
    band_width = max(1, (x2 - x1) // len(colors))
    for index, color in enumerate(colors):
        left = x1 + index * band_width
        right = x2 if index == len(colors) - 1 else left + band_width
        draw.rectangle((left, y1, right, y2), fill=color)
    draw.rectangle(box, outline="#d6c6a3", width=2)


def create_shelf_simulation(config: dict, results: list[ImageMetrics]) -> None:
    shelf = config.get("shelf", {})
    slot_width = int(shelf.get("slotWidth", 150))
    slot_height = int(shelf.get("slotHeight", 245))
    gutter = 18
    top = 74
    label_area = 58
    competitors = config.get("virtualCompetitors", [])

    shelf_items: list[dict[str, object]] = []
    for index, result in enumerate(results):
        if index < len(competitors):
            shelf_items.append({"type": "competitor", "data": competitors[index]})
        shelf_items.append({"type": "brand", "data": result})
    for competitor in competitors[len(results) :]:
        shelf_items.append({"type": "competitor", "data": competitor})

    width = gutter + len(shelf_items) * (slot_width + gutter)
    height = top + slot_height + label_area + 34
    canvas = Image.new("RGBA", (width, height), shelf.get("background", "#181310"))
    draw = ImageDraw.Draw(canvas)
    title_font = load_font(26, True)
    label_font = load_font(12, True)
    small_font = load_font(11)

    draw.text((22, 18), "Shelf visibility simulation", fill="#f8ead1", font=title_font)
    draw.text((22, 47), "Actual NoodleBomb labels mixed with benchmark sauce/pantry palettes", fill="#baa98b", font=small_font)

    x = gutter
    for item in shelf_items:
        y = top
        draw.rounded_rectangle((x, y, x + slot_width, y + slot_height), radius=14, fill="#261c17", outline="#594337")
        visual_box = (x + 14, y + 16, x + slot_width - 14, y + slot_height - 52)
        if item["type"] == "brand":
            result: ImageMetrics = item["data"]  # type: ignore[assignment]
            paste_contained(canvas, ROOT / result.path, visual_box)
            name = result.name
            score = f"{result.total_score}/100"
            badge = "#f97316" if result.total_score >= 76 else "#facc15" if result.total_score >= 64 else "#ef4444"
        else:
            competitor = item["data"]
            draw_virtual_competitor(draw, visual_box, competitor)  # type: ignore[arg-type]
            name = str(competitor.get("name", "Benchmark"))
            score = "benchmark"
            badge = "#6b7280"

        draw.rounded_rectangle((x + 15, y + slot_height - 42, x + slot_width - 15, y + slot_height - 16), radius=9, fill=badge)
        draw.text((x + 24, y + slot_height - 36), score, fill="#111111" if badge != "#6b7280" else "#ffffff", font=label_font)

        lines = text_fit(draw, name, label_font, slot_width - 12)[:2]
        line_y = y + slot_height + 10
        for line in lines:
            draw.text((x + 6, line_y), line, fill="#f8ead1", font=label_font)
            line_y += 16
        x += slot_width + gutter

    shelf_path = OUTPUT_DIR / "shelf-simulation.png"
    distance_path = OUTPUT_DIR / "shelf-simulation-distance.png"
    canvas.convert("RGB").save(shelf_path, quality=92)
    distance = canvas.resize((max(1, width // 2), max(1, height // 2))).filter(
        ImageFilter.GaussianBlur(float(shelf.get("distanceBlurRadius", 2.2)))
    )
    distance.resize((width, height)).convert("RGB").save(distance_path, quality=90)


def md_color_chips(colors: list[dict[str, object]]) -> str:
    return ", ".join(f"`{color['hex']}` ({round(float(color['share']) * 100, 1)}%)" for color in colors[:5])


def write_csv(results: list[ImageMetrics]) -> None:
    path = OUTPUT_DIR / "shelf-impact-scorecard.csv"
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(
            [
                "id",
                "name",
                "total_score",
                "risk_tier",
                "shelf_visibility",
                "readability",
                "color_uniqueness",
                "premium_perception",
                "top_colors",
                "first_recommendation",
            ]
        )
        for result in results:
            writer.writerow(
                [
                    result.id,
                    result.name,
                    result.total_score,
                    result.risk_tier,
                    result.shelf_visibility_score,
                    result.readability_score,
                    result.color_uniqueness_score,
                    result.premium_perception_score,
                    " ".join(color["hex"] for color in result.dominant_colors[:5]),
                    result.recommendations[0],
                ]
            )


def write_json(results: list[ImageMetrics], config: dict) -> None:
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "brand": config.get("brand", "NoodleBomb"),
        "competitor_mode": "image directory" if has_competitor_images(config) else "virtual benchmarks",
        "results": [asdict(result) for result in results],
    }
    (OUTPUT_DIR / "shelf-impact.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")


def write_markdown(results: list[ImageMetrics], config: dict) -> None:
    competitor_dir = resolve_path(config.get("competitorImageDirectory", "data/shelf-impact-competitors"))
    competitor_note = (
        f"Competitor image mode: scanned `{competitor_dir.relative_to(ROOT)}`."
        if has_competitor_images(config)
        else "Competitor image mode: no local competitor files found, so this run used virtual sauce/pantry benchmark palettes."
    )
    best = max(results, key=lambda result: result.total_score)
    weakest = min(results, key=lambda result: result.total_score)
    lines = [
        "# NoodleBomb Shelf Impact Analyzer",
        "",
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        competitor_note,
        "",
        "## Executive Read",
        "",
        f"- Strongest current shelf performer: **{best.name}** at **{best.total_score}/100**.",
        f"- Most urgent label to tune: **{weakest.name}** at **{weakest.total_score}/100**.",
        "- Use `shelf-simulation.png` for the normal shelf read and `shelf-simulation-distance.png` for the six-to-eight-foot blur read.",
        "",
        "## Scorecard",
        "",
        "| Flavor | Total | Tier | Shelf | Readability | Unique Color | Premium | Dominant Colors |",
        "| --- | ---: | --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for result in sorted(results, key=lambda item: item.total_score, reverse=True):
        lines.append(
            f"| {result.name} | {result.total_score} | {result.risk_tier} | {result.shelf_visibility_score} | "
            f"{result.readability_score} | {result.color_uniqueness_score} | {result.premium_perception_score} | "
            f"{md_color_chips(result.dominant_colors)} |"
        )

    lines.extend(["", "## Recommendations", ""])
    for result in sorted(results, key=lambda item: item.total_score):
        lines.extend([f"### {result.name}", ""])
        for recommendation in result.recommendations:
            lines.append(f"- {recommendation}")
        lines.append("")

    lines.extend(
        [
            "## How To Use This",
            "",
            "- Drop competitor label photos into `data/shelf-impact-competitors/` and rerun `npm run shelf:analyze` for a true aisle comparison.",
            "- Use the distance simulation before approving any print revision; if the flavor is not readable in the blurred version, shoppers will miss it.",
            "- Treat scores under 64 as a packaging fix queue before retail outreach.",
        ]
    )
    (OUTPUT_DIR / "shelf-impact-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_html(results: list[ImageMetrics], config: dict) -> None:
    rows = []
    for result in sorted(results, key=lambda item: item.total_score, reverse=True):
        image_src = html.escape(result.path.replace("\\", "/"))
        chips = "".join(
            f"<span class='chip' style='background:{html.escape(str(color['hex']))}' title='{html.escape(str(color['hex']))}'></span>"
            for color in result.dominant_colors[:5]
        )
        notes = "".join(f"<li>{html.escape(note)}</li>" for note in result.recommendations[:3])
        rows.append(
            f"""
            <article class="card">
              <div class="card-top">
                <img src="../../{image_src}" alt="{html.escape(result.name)} label" />
                <div>
                  <p class="eyebrow">{html.escape(result.role)}</p>
                  <h2>{html.escape(result.name)}</h2>
                  <strong>{result.total_score}<span>/100</span></strong>
                  <p class="tier">{html.escape(result.risk_tier)}</p>
                </div>
              </div>
              <div class="metrics">
                <span>Shelf {result.shelf_visibility_score}</span>
                <span>Read {result.readability_score}</span>
                <span>Color {result.color_uniqueness_score}</span>
                <span>Premium {result.premium_perception_score}</span>
              </div>
              <div class="chips">{chips}</div>
              <ul>{notes}</ul>
            </article>
            """
        )

    html_doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NoodleBomb Shelf Impact Analyzer</title>
  <style>
    :root {{ color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
    body {{ margin: 0; background: #110d0b; color: #f9ead2; }}
    main {{ width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 64px; }}
    h1 {{ margin: 0; font-size: clamp(2rem, 5vw, 4.5rem); line-height: .92; letter-spacing: 0; }}
    p {{ color: #cdbd9d; line-height: 1.55; }}
    .hero {{ display: grid; gap: 22px; margin-bottom: 30px; }}
    .shelf {{ width: 100%; border-radius: 14px; border: 1px solid #392a22; box-shadow: 0 30px 90px rgb(0 0 0 / .35); }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 22px; }}
    .card {{ background: #1b1410; border: 1px solid #3a2a20; border-radius: 14px; padding: 16px; }}
    .card-top {{ display: grid; grid-template-columns: 92px 1fr; gap: 14px; align-items: center; }}
    .card img {{ max-width: 92px; max-height: 138px; object-fit: contain; filter: drop-shadow(0 18px 22px rgb(0 0 0 / .34)); }}
    .eyebrow {{ margin: 0 0 5px; text-transform: uppercase; font-size: .72rem; letter-spacing: .08em; color: #eab76f; }}
    h2 {{ margin: 0 0 8px; font-size: 1.25rem; }}
    strong {{ display: block; font-size: 2rem; color: #ffb454; }}
    strong span {{ font-size: .95rem; color: #a9987c; }}
    .tier {{ margin: 2px 0 0; font-size: .78rem; text-transform: uppercase; color: #f5d28e; }}
    .metrics {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 14px; }}
    .metrics span {{ background: #2a211a; border: 1px solid #45352a; border-radius: 8px; padding: 7px 6px; text-align: center; font-size: .78rem; color: #f8dec0; }}
    .chips {{ display: flex; gap: 7px; margin: 14px 0; }}
    .chip {{ width: 28px; height: 28px; border-radius: 999px; border: 1px solid rgb(255 255 255 / .35); box-shadow: inset 0 0 0 1px rgb(0 0 0 / .2); }}
    ul {{ margin: 0; padding-left: 18px; color: #deceb2; }}
    li + li {{ margin-top: 7px; }}
    .links {{ display: flex; flex-wrap: wrap; gap: 10px; }}
    .links a {{ color: #111; background: #ffb454; border-radius: 999px; padding: 10px 14px; text-decoration: none; font-weight: 700; }}
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <p class="eyebrow">Packaging intelligence</p>
        <h1>Shelf Impact Analyzer</h1>
        <p>Image-based scoring for shelf visibility, color uniqueness, readability, and premium perception.</p>
      </div>
      <img class="shelf" src="shelf-simulation.png" alt="NoodleBomb shelf impact simulation" />
      <div class="links">
        <a href="shelf-impact-report.md">Read report</a>
        <a href="shelf-simulation-distance.png">Distance blur simulation</a>
        <a href="shelf-impact-scorecard.csv">Download scorecard</a>
      </div>
    </section>
    <section class="grid">
      {''.join(rows)}
    </section>
  </main>
</body>
</html>
"""
    (OUTPUT_DIR / "shelf-impact-dashboard.html").write_text(html_doc, encoding="utf-8")


def main() -> None:
    if not CONFIG_PATH.exists():
        raise SystemExit(f"Missing config: {CONFIG_PATH}")

    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    competitor_colors = competitor_palette(config)
    results = [analyze_brand_image(item, competitor_colors) for item in config.get("brandImages", [])]
    results.sort(key=lambda result: result.total_score, reverse=True)

    create_shelf_simulation(config, results)
    write_csv(results)
    write_json(results, config)
    write_markdown(results, config)
    write_html(results, config)

    print(f"[OK] Shelf analysis complete for {len(results)} labels")
    print(f"[OK] Report: {OUTPUT_DIR / 'shelf-impact-report.md'}")
    print(f"[OK] Dashboard: {OUTPUT_DIR / 'shelf-impact-dashboard.html'}")
    print(f"[OK] Simulation: {OUTPUT_DIR / 'shelf-simulation.png'}")


if __name__ == "__main__":
    main()

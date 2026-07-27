#!/usr/bin/env bash
# Downloads every image referenced by the live gt40marine.com (see gt40-image-manifest.csv)
# into ./gt40-images/, preserving site paths for local assets and using readable
# names for Wix/Shopify CDN files. Intended to be run from the gt40marine-website
# repo to fill in missing image assets.
#
# Usage: ./fetch-gt40-images.sh [output-dir]
set -euo pipefail

OUT="${1:-gt40-images}"
MANIFEST="$(dirname "$0")/gt40-image-manifest.csv"

mkdir -p "$OUT"

tail -n +2 "$MANIFEST" | while IFS=, read -r url page alt; do
  case "$url" in
    https://gt40marine.com/*)
      # keep the site-relative path (e.g. v5/hero1.png, globe/p-stage1-promo.png)
      rel="${url#https://gt40marine.com/}"
      dest="$OUT/$rel"
      ;;
    https://static.wixstatic.com/media/*)
      f="${url##*/}"            # a4d090_<hash>~mv2.png
      f="${f/\~mv2/}"           # strip ~mv2
      dest="$OUT/wix/$f"
      ;;
    https://cdn.shopify.com/*)
      f="${url##*/}"
      f="${f%%\?*}"             # strip ?v= cache param
      dest="$OUT/shopify/$f"
      ;;
    *)
      echo "skip (unknown host): $url" >&2
      continue
      ;;
  esac
  if [ -s "$dest" ]; then
    echo "exists  $dest"
    continue
  fi
  mkdir -p "$(dirname "$dest")"
  echo "fetch   $dest"
  curl -fsSL --retry 3 "$url" -o "$dest"
done

echo "Done. $(find "$OUT" -type f | wc -l) files in $OUT/"

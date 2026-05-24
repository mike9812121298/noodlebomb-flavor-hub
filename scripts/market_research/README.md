# Flavor Review Analyzer

Runs market-research extraction for NoodleBomb flavor and packaging decisions.

```bash
npm run research:flavor
```

Inputs:

- Public Reddit JSON from the subreddits/queries in `data/flavor-review-sources.json`
- Local exports dropped into `data/review-inputs/` as `.txt`, `.csv`, or `.json`
- Optional competitor URLs added to `competitorUrls`

Outputs land in `tmp/flavor-review-analyzer/`:

- `flavor-review-dashboard.html`
- `flavor-review-report.md`
- `flavor-review-analysis.json`
- `flavor-review-quotes.csv`

Use local exports for Amazon reviews instead of scraping Amazon product pages directly. That keeps the workflow stable and avoids building a brittle scraper against account-protected pages.

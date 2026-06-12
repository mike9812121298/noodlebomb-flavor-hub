# What Should Mike Work On Today?

Run the CEO copilot:

```bash
npm run ops:today
```

Smoke test with synthetic signals:

```bash
npm run ops:today:sample
```

The engine automatically reads these generated reports when present:

- `tmp/revenue-watchdog/revenue-watchdog.json`
- `tmp/dead-product-detector/dead-product-detector.json`
- `tmp/shelf-impact-analyzer/shelf-impact.json`
- `tmp/retail-sell-through-predictor/retail-sell-through.json`

Optional manual input:

```text
data/mike-today/manual_signals.json
```

Manual signal shape:

```json
{
  "signals": [
    {
      "title": "Call 10 PNW specialty buyers",
      "type": "opportunity",
      "impact": 420,
      "impact_label": "$420 pipeline value",
      "confidence": 70,
      "effort_minutes": 90,
      "blockers": ["Need fresh contact list"],
      "next_action": "Send first 10 outreach emails."
    }
  ]
}
```

Output files:

- `tmp/mike-today/mike-today-report.md`
- `tmp/mike-today/mike-today-alert.txt`
- `tmp/mike-today/mike-today-actions.csv`
- `tmp/mike-today/mike-today-dashboard.html`
- `tmp/mike-today/mike-today.json`

# Revenue Watchdog Input

Put the real daily metric export at:

```text
data/revenue-watchdog/daily_metrics.csv
```

Then run:

```bash
npm run revenue:watch
```

Required CSV columns:

```text
date,channel,product,sku,flavor,landing_page,campaign,sessions,orders,revenue,units,ad_spend,refunds,inventory_on_hand,change_marker,notes
```

Notes:

- `date` must be `YYYY-MM-DD`.
- `revenue`, `orders`, `sessions`, `units`, `ad_spend`, `refunds`, and `inventory_on_hand` should be numeric.
- `change_marker` is optional, but useful. Examples: `image update`, `price change`, `ad paused`, `inventory low`, `new PDP copy`.
- Missing `daily_metrics.csv` is treated as "not wired yet" and exits cleanly.
- Use `npm run revenue:watch:sample` for the synthetic smoke test.

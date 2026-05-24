# Dead Product Detector Input

Put the real catalog metric export at:

```text
data/dead-products/sku_metrics.csv
```

Then run:

```bash
npm run catalog:dead-products
```

Required CSV columns:

```text
sku,product,category,flavor,channel,status,inventory_on_hand,inventory_age_days,unit_cost,price,gross_margin_pct,sessions_30d,orders_30d,revenue_30d,units_sold_30d,ad_spend_30d,support_mentions_30d,refunds_30d,last_sale_days_ago,related_hero_sku,change_marker,notes
```

Use `npm run catalog:dead-products:sample` for a smoke test with synthetic data.

Decision output:

- `revive`: shoppers are looking, but the page/price/creative/support friction is wasting demand.
- `bundle`: not strong enough alone, but useful as an add-on or AOV lever.
- `liquidate`: too much old inventory or ad waste; turn it into cash.
- `archive`: no meaningful demand; remove from active selling surfaces unless there is a strategic reason.

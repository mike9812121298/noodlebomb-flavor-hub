# NoodleBomb Retail Outreach CRM

Local-only CRM for retail store outreach. It stores records in your browser's localStorage and is blocked from public Netlify access by `/ops/*`.

## Open

Double-click:

```text
A:\noodlebomb-repo\ops\retail-outreach-crm\index.html
```

## Fields

`store, contact, title, email, phone, category, region, employeeCount, storeCount, adjacentBrands, status, outreachDate, sampleSent, sampleDate, sampleFollowUpDate, sampleSecondFollowUpDate, followUpStatus, firstOrderDate, reorder30Date, reorder60Date, reorder90Date, nextAction, nextActionDate, tier, priority, source, dnc, notes`

## Automation

- Setting `Sample sent = Yes` or stage `Sample Sent` calculates +7d and +14d sample follow-ups.
- Setting stage `First Order` or `Reorder` calculates +30d, +60d, and +90d reorder nudges.
- Store tier is derived from store count, employee count, category, and adjacent shelf context.
- Email buttons generate drafts only. They never auto-send, and DNC records disable the mailto action.

## Daily Use

- Add stores as prospects.
- Set `nextActionDate` for the next follow-up.
- Use `Sample sent` and `Sample date` when a buyer gets product.
- Use `First order date` once a store buys, then work the reorder dashboard.
- Export CSV at the end of the day.
- Backup JSON before clearing browser data or switching computers.

## Import

Use `contacts_template.csv` as the CSV header format. Unknown columns are ignored.

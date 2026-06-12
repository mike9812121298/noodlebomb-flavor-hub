# Meta Conversions API Setup

PR #5 adds the receiver and sender code. Do not subscribe Shopify webhooks until Mike has the Shopify Admin token and `META_CAPI_ACCESS_TOKEN` configured in Netlify.

## Netlify

Set these in **Netlify -> Site settings -> Environment variables -> Functions**:

| Variable | Value shape | Notes |
| --- | --- | --- |
| `META_PIXEL_ID` | `1234567890123456` | Same pixel as the browser pixel. |
| `META_CAPI_ACCESS_TOKEN` | `EAAB...` | Events Manager -> Settings -> Conversions API -> Generate access token. |
| `META_GRAPH_API_VERSION` | `v23.0` | Optional override. Code defaults to `v23.0`. |
| `META_TEST_EVENT_CODE` | `TEST12345` | Optional. Use only while testing in Events Manager. |

Webhook endpoint after deploy:

```text
https://noodlebomb.co/.netlify/functions/shopify-meta-capi
```

## Shopify Webhooks

Create these Admin webhooks after the Admin token lands:

| Shopify topic | Meta event sent | Dedupe key |
| --- | --- | --- |
| `orders/create` | `Purchase` | `orders/create:{shopify_order_id}` |
| `checkouts/create` | `InitiateCheckout` | `checkouts/create:{shopify_checkout_id_or_token}` |

The function hashes customer email and phone with SHA-256 before sending to Meta. It also includes `event_id` for deduplication, order value, currency, content IDs, IP, and user agent when Shopify/Netlify provide them.

## Test Flow

1. Add `META_TEST_EVENT_CODE` in Netlify Functions scope.
2. Trigger a Shopify test checkout/order webhook.
3. Confirm events appear in Meta Events Manager Test Events.
4. Remove `META_TEST_EVENT_CODE` before production traffic.

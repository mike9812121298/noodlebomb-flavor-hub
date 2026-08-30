# Photo Reward Code Issuance

This is a private operator tool for approved `/rewards` submissions. It creates
one unguessable code for one selected Pour or Shake variant.

The tool reads the selected variant and price from live Shopify, then refuses to
continue unless they match NoodleBomb canon. A created reward has these controls:

- one total redemption across the store;
- one use per customer;
- one selected product variant only;
- a fixed total discount equal to one live item price, even if the cart contains
  more than one eligible unit;
- one-time purchases only;
- no stacking with order or product discounts (shipping discounts may combine).

## Checklist

1. Approve the submitted photo and confirm the customer chose one eligible item.
2. Dry-run the command and read the product, price, and controls:

   ```powershell
   npm run reward:photo -- issue --product original
   ```

3. Create the live code:

   ```powershell
   npm run reward:photo -- issue --product original --apply
   ```

4. Copy only the returned `code` into the customer email. Do not send the node
   ID, credential path, or terminal output.
5. If a code is exposed or a QA code is finished, expire it and verify readback:

   ```powershell
   npm run reward:photo -- expire --code BOWLSHOT-XXXXXXXXXXXX --apply
   ```

Run `npm run reward:photo -- help` for the accepted product keys. The command
uses the existing private Shopify app credential file by default; it never
prints or stores an access token. The repository redirect rules force `/ops/*`
to return 404, and this tool must never be copied into a public deploy staging
tree without that protection.

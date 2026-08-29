/* NoodleBomb customer reviews — powers the rotating "What customers say"
   marquee on the homepage (section id="reviews").

   HOW TO ADD REVIEWS
   ------------------
   Paste real customer reviews into the `items` array below, newest/best
   first. Amazon reviews are fine to quote VERBATIM with attribution — do
   not edit the wording (trimming with an ellipsis is OK). Never invent or
   paraphrase a review.

   Fields per review:
     quote    (required)  the review text, verbatim
     name     (required)  reviewer display name, e.g. "Sarah M."
     stars    (optional)  1–5, defaults to 5
     source   (optional)  attribution chip, defaults to "Verified Amazon review"
     product  (optional)  which product it's about, e.g. "Original"

   The section stays completely hidden until at least 3 reviews are listed.

   Current entries pasted 2026-07-02 from the live Amazon listings
   (Original B0DVLPBKRN, Spicy Tokyo B0FYBNSL3N, Citrus Shoyu B0FZCTHBF2).
   Reviews without Amazon's "Verified Purchase" badge carry the plain
   "Amazon review" chip.

   NOTE: these quotes are display-only. They are deliberately NOT emitted
   as Product review / aggregateRating structured data — Google requires
   first-party reviews for star snippets (wire that up via Judge.me/Loox
   once installed). */
window.NB_REVIEWS = {
  defaultSource: "Verified Amazon review",
  items: [
    { quote: "I added just a spoonful to my regular instant noodles, and it instantly turned them into restaurant-quality ramen. The flavor is bold, rich, and perfectly balanced — not too salty, not too oily, just pure umami goodness.", name: "Amazon customer", stars: 5, source: "Amazon review", product: "Original" },
    { quote: "Don’t mind the fine China and the begging pups, but marinating chicken thighs in noodle bomb for 24 hours and putting in the air fryer was the best thing ever! Do yourself a favor and get this stuff!", name: "Brandon T.", stars: 5, product: "Spicy Tokyo" },
    { quote: "Turned my instant noodle soup from blehh to BLAM with just a small amount of product. The flavor it gives reminds me of authentic Japanese udon—rich, savory, and super satisfying.", name: "Marcus", stars: 5, product: "Spicy Tokyo" },
    { quote: "Oh wow. Just the right blend.... not salty, adds a kick to your noodles and goes well with whatever chopped veggies you add to your dish. I already ordered 2 more bottles. Great.", name: "K. Beyer", stars: 5, product: "Original" },
    { quote: "Delicious on vegetables, chicken , steak & noodles of course", name: "MaMai", stars: 5, source: "Amazon review", product: "Original" },
    { quote: "Got this for my brother who loves to cook and the sauce is delicious! Lots of flavor and easy to use across different recipes.", name: "Amazon customer", stars: 5, source: "Amazon review", product: "Original" },
    { quote: "My son loves this stuff!", name: "Leslye", stars: 5, product: "Spicy Tokyo" },
    { quote: "Very tasty, would buy again", name: "Timothy D.", stars: 5, product: "Spicy Tokyo" },
    { quote: "Delicious 😋😋🤤🤤", name: "Fulgencio P.", stars: 5, product: "Original" }
  ]
};

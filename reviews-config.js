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

   NOTE: these quotes are display-only. They are deliberately NOT emitted
   as Product review / aggregateRating structured data — Google requires
   first-party reviews for star snippets (wire that up via Judge.me/Loox
   once installed). */
window.NB_REVIEWS = {
  defaultSource: "Verified Amazon review",
  items: [
    // { quote: "…", name: "Sarah M.", stars: 5, product: "Original" },
  ]
};

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    stars: 5,
    quote:
      "I've been making ramen at home for years and this is genuinely the best sauce I've used. The Original is perfectly balanced — not too salty, just deep and savory.",
    name: "Jessica T.",
    location: "Portland OR",
  },
  {
    stars: 5,
    quote:
      "Bought the Spicy Tokyo on a whim and now I put it on everything. Eggs, rice, noodles, grain bowls. It's become a pantry staple.",
    name: "Marcus L.",
    location: "Seattle WA",
  },
  {
    stars: 5,
    quote:
      "The Citrus Shoyu is unlike anything I've tried. Bright but with depth. My whole family fought over the last bottle.",
    name: "Priya M.",
    location: "San Francisco CA",
  },
  {
    stars: 5,
    quote:
      "Ordered the bundle for a dinner party and everyone asked where to buy more. Converted 4 new customers in one night.",
    name: "Kevin R.",
    location: "Vancouver BC",
  },
  {
    stars: 5,
    quote:
      "Finally a ramen sauce that doesn't taste like sodium. The flavor actually builds. Reordering every month.",
    name: "Sarah K.",
    location: "Austin TX",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const ReviewsSection = () => {
  return (
    <section className="py-28">
      <div className="section-divider-animated mb-28" />
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">
            Real People. Real Bowls.
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            What People Are Saying
          </h2>
          <p className="text-foreground/50 mt-3 text-sm max-w-md mx-auto">
            Over 200+ happy bowls and counting.
          </p>
        </motion.div>

        {/* Review Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="relative rounded-2xl bg-gradient-card border border-border/40 p-6 flex flex-col gap-4 hover:border-primary/20 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: review.stars }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-amber-500 text-amber-500 drop-shadow-[0_0_4px_hsl(40_100%_50%/0.45)]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="pt-2 border-t border-border/30">
                <p className="font-display font-bold text-foreground text-sm tracking-tight">
                  {review.name}
                </p>
                <p className="text-[11px] text-foreground/35 font-display uppercase tracking-[0.15em] mt-0.5">
                  {review.location}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;

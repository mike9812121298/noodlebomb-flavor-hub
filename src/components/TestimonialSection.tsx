import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    text: "I put this on literally everything. My ramen game has never been this strong. Original is an everyday must.",
    rating: 5,
    sauce: "Original",
  },
  {
    name: "Sarah K.",
    text: "Spicy Tokyo on wings is insane. That slow burn keeps you coming back. Best hot sauce I've ever had.",
    rating: 5,
    sauce: "Spicy Tokyo",
  },
  {
    name: "James L.",
    text: "Citrus Shoyu on grilled shrimp is a game changer. Fresh, bright, and just the right amount of tang.",
    rating: 5,
    sauce: "Citrus Shoyu",
  },
  {
    name: "Diana R.",
    text: "Ryu Garlic on steak? Life-changing. The roasted garlic flavor is deep and smoky. Can't stop drizzling it.",
    rating: 5,
    sauce: "Ryu Garlic",
  },
];

const TestimonialSection = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container">
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-amber-500 text-amber-500 drop-shadow-[0_0_6px_hsl(40_100%_50%/0.4)]" />
            ))}
          </div>
          <span className="font-display text-4xl font-bold text-foreground ml-3">4.9</span>
        </div>
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-foreground/40 mb-1">
          Average Rating
        </p>
      </motion.div>

      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Don't Take Our Word For It
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 1, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -6, borderColor: "hsl(4 85% 50% / 0.2)" }}
            className="card-premium rounded-2xl p-6 relative group"
          >
            <Quote className="h-8 w-8 text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors" />
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.text}"</p>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-sm font-display font-bold text-foreground">{t.name}</span>
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-primary/80">{t.sauce}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground/50 font-display mt-10 tracking-wide">
        📸 Tag us <span className="font-semibold text-muted-foreground/70">@noodlebomb</span> to be featured here
      </p>
    </div>
  </section>
);

export default TestimonialSection;

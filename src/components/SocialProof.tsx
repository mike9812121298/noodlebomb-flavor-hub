import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import reviewPhoto1 from "@/assets/nb-review-photo-1.png";
import reviewPhoto2 from "@/assets/nb-review-photo-2.png";
import reviewPhoto3 from "@/assets/nb-review-photo-3.png";

const reviews = [
  {
    quote: "Noodle Bomb is a flavor explosion! The richness paired with the perfect spicy kick makes every bowl unforgettable.",
    name: "Ashley",
    rating: 5,
    image: reviewPhoto1,
  },
  {
    quote: "I wasn't expecting this much punch from one sauce. Made my store-bought ramen restaurant-worthy in seconds.",
    name: "Jessica M.",
    rating: 5,
    image: reviewPhoto2,
  },
  {
    quote: "Can't eat ramen without it now. The flavor is unreal — savory, spicy, and totally addictive.",
    name: "Chris L.",
    rating: 5,
    image: reviewPhoto3,
  },
];

const SocialProof = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-16"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">Real People. Real Flavor.</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Loved by Ramen Fans Everywhere
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -8 }}
            className="card-premium rounded-2xl overflow-hidden group"
            style={{ willChange: "transform" }}
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={r.image}
                alt={`Review by ${r.name}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            <div className="p-6 -mt-12 relative z-10">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed mb-3">"{r.quote}"</p>
              <span className="text-[10px] font-display font-bold text-foreground/50 uppercase tracking-[0.2em]">
                — {r.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center mt-12"
      >
        <Link to="/shop" className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary/80 hover:text-primary transition-colors group">
          See All Reviews
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default SocialProof;

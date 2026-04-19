import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Leaf, Shield, Star } from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "Our Story | NoodleBomb";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "How NoodleBomb was crafted in the Pacific Northwest. Real ingredients, bold flavor.";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="pt-32 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Flame className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]" />
          <h1 className="font-display text-5xl font-black text-foreground mb-6 leading-tight">
            We Blew Up Ramen.<br />
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">On Purpose.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            NoodleBomb was born in the Pacific Northwest out of one simple obsession: great ramen flavor shouldn't require a restaurant.
          </p>
        </motion.div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="prose prose-invert max-w-none">

          {/* Founder photo placeholder + story */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
              {/* Founder avatar placeholder */}
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-[0_0_30px_hsl(var(--flame)/0.35)]">
                <span className="font-display text-3xl font-black text-white">A</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Ashley's Story</h2>
                <p className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-primary/70">Founder · Pacific Northwest</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-5">
              Ashley didn't come back from Japan with souvenirs. She came back obsessed. After eating through izakayas, ramen shops, and convenience store shelves that somehow embarrassed American grocery stores, she landed home in the Pacific Northwest and stood in front of a sauce aisle that felt like a letdown. Nothing had the depth. Nothing had the balance. Nothing had whatever that thing was — the thing that made a $9 bowl in Tokyo feel like it was built just for you.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-5">
              She tried everything. Store-bought teriyaki, the "Asian-inspired" sauces, the ones with names that gesture vaguely at Japan without understanding it. They were sweet where they should've been savory. Thin where they needed weight. The frustration wasn't just culinary — it was personal. She'd tasted what was possible. She knew exactly what was missing.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-5">
              So she started making her own. The kitchen in her Pacific Northwest home became a testing ground — dark soy layered with roasted garlic, ginger dialed in, heat calibrated until it landed right. Batch after batch. Some were close. Some weren't. But each one got her closer to something real: a ramen sauce that carried the soul of what she'd eaten in Japan, built from scratch, without shortcuts.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              NoodleBomb is what came out of that obsession. Four flavors, each one developed the same way — start with the feeling you want, work backward until the sauce earns it. Ashley wants every bowl to feel intentional. Not like a shortcut. Not like a condiment you drizzle on and forget. Like someone genuinely cared about what you were about to eat.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Leaf, title: "Real Ingredients", desc: "No mystery fillers. No artificial anything. Just bold, clean flavor." },
              { icon: Flame, title: "Bold Flavor", desc: "Not watered-down sauce. Every bottle is built to hit hard." },
              { icon: Shield, title: "100% Guarantee", desc: "If you don't love it, we refund you. Full stop. No return needed." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-6 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <Star className="w-10 h-10 text-primary mx-auto mb-4" />
            <p className="font-display text-lg text-foreground font-semibold mb-2">Small Batch · Handcrafted · Premium</p>
            <p className="text-muted-foreground mb-6">Ready to taste what the obsession is about?</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
              Shop the Lineup →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

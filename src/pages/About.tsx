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
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">The Origin</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We started with one sauce — Original — and dialed it in until it was perfect. Soy, roasted garlic, ginger, a hint of sweetness. The kind of flavor that makes a $1 pack of instant noodles taste like something you'd pay $18 for.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Then we kept going. Four flavors later, we're on a mission to make every bowl worth remembering. Handcrafted in small batches, no mystery fillers, no shortcuts.
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

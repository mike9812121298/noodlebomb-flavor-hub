import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Users, ChevronRight } from "lucide-react";

const recipes = [
  {
    name: "Classic NoodleBomb Ramen Bowl",
    flavor: "Original",
    flavorLink: "https://www.noodlebomb.co/product-page/noodlebomb-original-ramen-sauce",
    time: "10 min",
    serves: "1",
    desc: "The one that started it all. Simple, bold, unforgettable.",
    steps: [
      "Cook 1 serving of ramen noodles according to package directions. Drain.",
      "Pour half a bottle of NoodleBomb Original directly over the hot noodles.",
      "Toss to coat evenly. Top with a soft-boiled egg, green onions, and sesame seeds.",
      "Optional: Add sliced chashu pork or mushrooms for a fuller bowl.",
    ],
  },
  {
    name: "Spicy Tokyo Fire Ramen",
    flavor: "Spicy Tokyo",
    flavorLink: "https://www.noodlebomb.co/product-page/noodle-bomb-spicy-tokyo-ramen-sauce",
    time: "12 min",
    serves: "1",
    desc: "Dark soy, roasted chili, and sesame — cranked to maximum.",
    steps: [
      "Cook noodles and drain. Slice 1 chicken thigh thin and sear in a hot pan with oil until golden.",
      "Add half a bottle of Spicy Tokyo to the pan off heat. Toss chicken to coat.",
      "Pour sauce and chicken over noodles. Top with crispy garlic, chili oil drizzle, and nori.",
    ],
  },
  {
    name: "NoodleBomb Wing Glaze",
    flavor: "Any flavor",
    flavorLink: "https://www.noodlebomb.co/product-page/noodlebomb-original-ramen-sauce",
    time: "45 min",
    serves: "4",
    desc: "The TikTok-worthy wing recipe everyone asks about.",
    steps: [
      "Bake or air-fry 2 lbs chicken wings at 400°F for 35–40 minutes until crispy.",
      "In a bowl, mix half a bottle of NoodleBomb with 1 tbsp butter and 1 tsp honey.",
      "Toss hot wings in the sauce immediately out of the oven. Serve with ranch.",
    ],
  },
  {
    name: "5-Minute Garlic Noodles",
    flavor: "Original",
    flavorLink: "https://www.noodlebomb.co/product-page/noodlebomb-original-ramen-sauce",
    time: "5 min",
    serves: "1",
    desc: "The fastest upgrade to instant noodles you'll ever make.",
    steps: [
      "Cook any noodle (ramen, spaghetti, udon) and drain.",
      "Toss immediately with half a bottle of NoodleBomb Original and 1 tsp sesame oil.",
      "Top with fried egg, crushed peanuts, and chili flakes. Done.",
    ],
  },
  {
    name: "Citrus Shoyu Cold Noodle Salad",
    flavor: "Citrus Shoyu",
    flavorLink: "https://www.noodlebomb.co/product-page/noodle-bomb-citrus-shoyu-ramen-sauce",
    time: "15 min",
    serves: "2",
    desc: "Bright, tangy, and perfect for summer.",
    steps: [
      "Cook soba noodles, rinse under cold water, and chill.",
      "Toss with half a bottle of Citrus Shoyu, sliced cucumber, shredded purple cabbage, and edamame.",
      "Top with sesame seeds and a drizzle of rice vinegar. Serve cold.",
    ],
  },
  {
    name: "Spicy Tokyo Steak Marinade",
    flavor: "Spicy Tokyo",
    flavorLink: "https://www.noodlebomb.co/product-page/noodle-bomb-spicy-tokyo-ramen-sauce",
    time: "20 min + marinate",
    serves: "2",
    desc: "The chili-oil infusion penetrates deep. Worth every minute of wait.",
    steps: [
      "Pour half a bottle of Spicy Tokyo over 1 lb flank steak in a zip bag. Marinate 10–60 minutes.",
      "Sear steak in a screaming hot cast iron 3–4 minutes per side.",
      "Rest 5 minutes, slice against the grain. Serve over rice with extra sauce on the side.",
    ],
  },
];

const Recipes = () => {
  useEffect(() => {
    document.title = "Recipes | NoodleBomb Ramen Sauce";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Creative recipes using NoodleBomb ramen sauce — ramen bowls, glazes, marinades, and more.";
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl font-black text-foreground mb-3">Recipes</h1>
          <p className="text-muted-foreground text-lg mb-12">Six ways to make any meal worth craving.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors duration-300">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">{r.flavor}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />Serves {r.serves}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">{r.name}</h2>
                <p className="text-muted-foreground text-sm mb-4">{r.desc}</p>
                <ol className="space-y-2 mb-6">
                  {r.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="font-display font-bold text-primary flex-shrink-0">{j + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <a href={r.flavorLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-display font-bold text-primary hover:text-orange-400 transition-colors">
                  Shop {r.flavor} <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;

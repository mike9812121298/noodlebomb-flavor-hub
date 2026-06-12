import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Users, ChevronRight } from "lucide-react";

const recipes = [
  // ===== ORIGINAL (5 total: 2 existing + 3 new) =====
  {
    name: "Classic NoodleBomb Ramen Bowl",
    flavor: "Original",
    flavorLink: "/original-ramen-sauce",
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
    name: "5-Minute Garlic Noodles",
    flavor: "Original",
    flavorLink: "/original-ramen-sauce",
    time: "5 min",
    serves: "1",
    desc: "The fastest weeknight bowl in your rotation.",
    steps: [
      "Cook any noodle (ramen, spaghetti, udon) and drain.",
      "Toss immediately with half a bottle of NoodleBomb Original and 1 tsp sesame oil.",
      "Top with fried egg, crushed peanuts, and chili flakes. Done.",
    ],
  },
  {
    name: "Sunday Night Chashu Ramen",
    flavor: "Original",
    flavorLink: "/original-ramen-sauce",
    time: "2 hr 30 min",
    serves: "4",
    desc: "Project-night ramen — the kind you set music to and finish with a beer.",
    steps: [
      "Tie 1.5 lb pork belly into a tight log with kitchen twine. Sear all sides in a Dutch oven until deep brown.",
      "Add 4 cups dashi or chicken stock, 1/4 cup soy sauce, 1/4 cup mirin, 4 garlic cloves, and a 2-inch knob of ginger sliced thin.",
      "Cover and braise at 300°F for 2 hours, turning the pork halfway through.",
      "Lift the pork out, slice into 1/2-inch coins, and torch or sear the slices for caramelized edges.",
      "Cook 4 portions of fresh ramen noodles. Divide into bowls.",
      "Pour 3 tablespoons of NoodleBomb Original over each bowl, then ladle 1 cup of the hot braising broth on top.",
      "Top with chashu coins, a marinated soft egg, scallions, and sheet of nori.",
    ],
  },
  {
    name: "Crispy Rice Salmon Bowl",
    flavor: "Original",
    flavorLink: "/original-ramen-sauce",
    time: "25 min",
    serves: "2",
    desc: "Crackly rice on the bottom, glazed salmon on top, NoodleBomb pulling it all together.",
    steps: [
      "Pat 2 salmon fillets dry. Brush with NoodleBomb Original and let sit 10 minutes.",
      "Heat 2 tbsp neutral oil in a non-stick pan. Press 2 cups cooked short-grain rice flat into the pan and let it crisp 6-8 minutes without stirring.",
      "Sear salmon skin-side down in a separate pan for 4 minutes, flip, glaze with another spoon of NoodleBomb, finish 2 more minutes.",
      "Slide the crispy rice onto plates, browned-side up. Top with salmon.",
      "Pour on extra NoodleBomb, scatter sliced scallions and toasted sesame seeds, finish with avocado and a wedge of lime.",
    ],
  },
  {
    name: "Charred Broccoli Crunch Bowl",
    flavor: "Original",
    flavorLink: "/original-ramen-sauce",
    time: "15 min",
    serves: "2",
    desc: "Pantry-rescue dinner: one head of broccoli, one bottle, one ripping-hot pan.",
    steps: [
      "Cut 1 large head of broccoli into long flat planks (florets, stems and all).",
      "Heat a cast iron skillet until smoking. Add 2 tbsp neutral oil and lay broccoli planks flat.",
      "Char hard, 3-4 minutes per side, until edges are deep black-brown.",
      "Slide broccoli into a wide bowl. Pour 4 tbsp NoodleBomb Original over while still hot.",
      "Toss with 1/2 cup roasted peanuts, a handful of fried shallots, and torn cilantro.",
      "Serve over rice or noodles, or eat straight from the bowl with a fork.",
    ],
  },

  // ===== SPICY TOKYO (5 total: 2 existing + 3 new) =====
  {
    name: "Spicy Tokyo Fire Ramen",
    flavor: "Spicy Tokyo",
    flavorLink: "/spicy-tokyo-ramen-sauce",
    time: "12 min",
    serves: "1",
    desc: "Savory soy, roasted chili, and sesame — cranked to maximum.",
    steps: [
      "Cook noodles and drain. Slice 1 chicken thigh thin and sear in a hot pan with oil until golden.",
      "Add half a bottle of Spicy Tokyo to the pan off heat. Toss chicken to coat.",
      "Pour sauce and chicken over noodles. Top with crispy garlic, chili oil, and nori.",
    ],
  },
  {
    name: "Spicy Tokyo Steak Marinade",
    flavor: "Spicy Tokyo",
    flavorLink: "/spicy-tokyo-ramen-sauce",
    time: "20 min + marinate",
    serves: "2",
    desc: "The chili-oil infusion penetrates deep. Worth every minute of wait.",
    steps: [
      "Pour half a bottle of Spicy Tokyo over 1 lb flank steak in a zip bag. Marinate 10-60 minutes.",
      "Sear steak in a screaming hot cast iron 3-4 minutes per side.",
      "Rest 5 minutes, slice against the grain. Serve over rice with extra sauce on the side.",
    ],
  },
  {
    name: "Tokyo Heat Mapo Udon",
    flavor: "Spicy Tokyo",
    flavorLink: "/spicy-tokyo-ramen-sauce",
    time: "20 min",
    serves: "2",
    desc: "Sichuan heat meets Tokyo umami in a tangled bowl of fat udon noodles.",
    steps: [
      "Crumble 1/2 lb ground pork into a hot wok. Cook hard until edges crisp, 5 minutes.",
      "Add 4 cloves minced garlic, 1 tbsp grated ginger, 1 tbsp doubanjiang. Stir-fry 1 minute.",
      "Pour in 1 cup chicken stock and 4 tbsp Spicy Tokyo. Bring to a boil.",
      "Slide in 1 block silken tofu cut into cubes. Simmer 3 minutes without stirring (let the tofu hold shape).",
      "Cook 2 portions thick udon, drain, divide into bowls.",
      "Spoon mapo over noodles. Finish with toasted Sichuan peppercorns, scallions, and chili oil.",
    ],
  },
  {
    name: "Tokyo Heat Dumpling Dip",
    flavor: "Spicy Tokyo",
    flavorLink: "/spicy-tokyo-ramen-sauce",
    time: "3 min",
    serves: "4",
    desc: "Three-ingredient dip that ruins every other dumpling sauce forever.",
    steps: [
      "Pour 1/4 cup Spicy Tokyo into a small dipping bowl.",
      "Add 1 tbsp rice vinegar and 1 tsp toasted sesame oil. Whisk with a fork.",
      "Top with thin-sliced scallion, a pinch of sesame seeds, and crushed garlic if you want a heavier hit.",
      "Serve next to pan-fried gyoza, soup dumplings, or wontons.",
      "Tell people you make it from scratch. They will never know.",
    ],
  },
  {
    name: "Spicy Tokyo Smashburger",
    flavor: "Spicy Tokyo",
    flavorLink: "/spicy-tokyo-ramen-sauce",
    time: "15 min",
    serves: "2",
    desc: "The umami-bomb burger that turns Tuesday night into a chef-table moment.",
    steps: [
      "Divide 1 lb ground beef (80/20) into 4 loose 4-oz balls. Do not pack.",
      "Heat a cast iron skillet until smoking. Lay the balls in, season tops with salt.",
      "Smash flat with a stiff spatula. Cook hard 90 seconds for crust, flip.",
      "Brush each patty with 1 tsp Spicy Tokyo, top with American cheese, finish 30 seconds.",
      "Stack two patties per bun. Add shredded iceberg, dill pickle, and a swipe of Kewpie mayo cut with another spoon of Spicy Tokyo.",
      "Eat over the sink. Have napkins ready.",
    ],
  },

  // ===== CITRUS SHOYU =====
  {
    name: "Citrus Shoyu Cold Noodle Salad",
    flavor: "Citrus Shoyu",
    flavorLink: "/citrus-shoyu-ramen-sauce",
    time: "15 min",
    serves: "2",
    desc: "Bright, tangy, and perfect for summer.",
    steps: [
      "Cook soba noodles, rinse under cold water, and chill.",
      "Toss with half a bottle of Citrus Shoyu, sliced cucumber, shredded purple cabbage, and edamame.",
      "Top with sesame seeds and a splash of rice vinegar. Serve cold.",
    ],
  },
  {
    name: "Citrus Shoyu Glazed Salmon",
    flavor: "Citrus Shoyu",
    flavorLink: "/citrus-shoyu-ramen-sauce",
    time: "20 min",
    serves: "2",
    desc: "Restaurant-bowl finish in twenty weeknight minutes.",
    steps: [
      "Pat 2 skin-on salmon fillets dry, season lightly with salt.",
      "Heat 1 tbsp oil in a non-stick pan over medium-high. Lay salmon skin-side down, press flat for 30 seconds.",
      "Cook undisturbed 5 minutes until skin is shatter-crisp. Flip, cook 2 minutes more.",
      "Pour 3 tbsp Citrus Shoyu around the fillets. Tilt the pan so the sauce reduces and glazes the fish.",
      "Plate over jasmine rice. Spoon any extra glaze from the pan over the top.",
      "Finish with thin-sliced scallions, sesame seeds, and a squeeze of fresh lemon.",
    ],
  },
  {
    name: "Spring Onion Citrus Slaw",
    flavor: "Citrus Shoyu",
    flavorLink: "/citrus-shoyu-ramen-sauce",
    time: "10 min",
    serves: "4",
    desc: "The side that steals every taco-night and grilled-fish dinner.",
    steps: [
      "Shred 1/2 head napa cabbage and 2 carrots on a box grater.",
      "Thin-slice 4 spring onions on a sharp diagonal.",
      "Toss everything in a large bowl with 1/3 cup Citrus Shoyu and 2 tbsp toasted sesame oil.",
      "Add a small handful of cilantro, mint, and Thai basil torn by hand.",
      "Let sit 5 minutes. Toss again before serving.",
      "Pile next to grilled fish, smashburgers, or fish tacos.",
    ],
  },
  {
    name: "Citrus Shoyu Tuna Poke",
    flavor: "Citrus Shoyu",
    flavorLink: "/citrus-shoyu-ramen-sauce",
    time: "10 min",
    serves: "2",
    desc: "Sushi-grade tuna, two minutes of work, bright rice-bowl payoff.",
    steps: [
      "Cube 1/2 lb sushi-grade ahi tuna into 1/2-inch pieces.",
      "In a bowl, whisk 3 tbsp Citrus Shoyu, 1 tsp toasted sesame oil, and 1 tsp grated ginger.",
      "Fold the tuna into the marinade. Rest 5 minutes (no longer, or the citrus cooks the fish).",
      "Build bowls over warm rice with sliced avocado, cucumber matchsticks, and edamame.",
      "Pile the marinated tuna in the center.",
      "Finish with toasted sesame seeds, scallions, and crispy fried shallots.",
    ],
  },

  // ===== ANY FLAVOR =====
  {
    name: "NoodleBomb Wing Glaze",
    flavor: "Any flavor",
    flavorLink: "/original-ramen-sauce",
    time: "45 min",
    serves: "4",
    desc: "The TikTok-worthy wing recipe everyone asks about.",
    steps: [
      "Bake or air-fry 2 lbs chicken wings at 400°F for 35–40 minutes until crispy.",
      "In a bowl, mix half a bottle of NoodleBomb with 1 tbsp butter and 1 tsp honey.",
      "Toss hot wings in the sauce immediately out of the oven. Serve with ranch.",
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
    meta.content = "Fifteen recipes built around NoodleBomb ramen sauce — noodles, rice bowls, wings, glazes, marinades, dips, and salads.";
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl font-black text-foreground mb-3">Recipes</h1>
          <p className="text-muted-foreground text-lg mb-12">Fifteen ways to pour bold.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors duration-300">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                <a href={r.flavorLink}
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

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "tmp/recipe-content-engine");
const BLOG_DIR = path.join(OUT_DIR, "blog-posts");
const GENERATED_TS = path.join(ROOT, "src/lib/generatedRecipeContent.ts");

const FLAVORS = [
  {
    id: "original",
    name: "Original",
    productSlug: "original-ramen",
    productUrl: "/product/original-ramen",
    profile: "deep soy, garlic, ginger, sesame, and balanced umami",
    angle: "the all-purpose bottle",
    color: "Umami",
  },
  {
    id: "spicy-tokyo",
    name: "Spicy Tokyo",
    productSlug: "spicy-tokyo",
    productUrl: "/product/spicy-tokyo",
    profile: "roasted chili heat, dark soy depth, garlic, and sesame",
    angle: "the heat-forward bottle",
    color: "Heat",
  },
  {
    id: "citrus-shoyu",
    name: "Citrus Shoyu",
    productSlug: "citrus-shoyu",
    productUrl: "/product/citrus-shoyu",
    profile: "bright citrus, clean shoyu, light heat, and a crisp finish",
    angle: "the bright bottle",
    color: "Bright",
  },
  {
    id: "shoyu-reserve",
    name: "Shoyu Reserve",
    productSlug: "shoyu-reserve",
    productUrl: "/product/shoyu-reserve",
    profile: "slow-brewed shoyu depth, mellow salt, and savory finish",
    angle: "the finishing and marinade bottle",
    color: "Reserve",
  },
];

const USE_CASES = [
  {
    id: "ramen",
    label: "Ramen",
    base: "ramen noodles",
    time: "10 min",
    serves: "1",
    action: "Turn a plain pack into a real bowl.",
  },
  {
    id: "rice-bowl",
    label: "Rice Bowls",
    base: "warm rice",
    time: "18 min",
    serves: "2",
    action: "Build a bowl that tastes planned.",
  },
  {
    id: "wings",
    label: "Wings",
    base: "crispy wings",
    time: "45 min",
    serves: "4",
    action: "Coat crispy wings without making them soggy.",
  },
  {
    id: "marinade",
    label: "Marinades",
    base: "chicken, steak, tofu, or salmon",
    time: "25 min + marinate",
    serves: "2",
    action: "Use the sauce as the backbone of a fast marinade.",
  },
  {
    id: "stir-fry",
    label: "Stir Fry",
    base: "vegetables, noodles, or rice",
    time: "15 min",
    serves: "2",
    action: "Finish hot food with layered flavor.",
  },
  {
    id: "dipping-sauce",
    label: "Dipping Sauces",
    base: "dumplings, spring rolls, fries, or vegetables",
    time: "3 min",
    serves: "4",
    action: "Make the dip people remember.",
  },
];

const PAIRINGS = {
  original: {
    ramen: ["soft egg", "scallions", "corn", "sesame"],
    "rice-bowl": ["crispy chicken", "cucumber", "sesame rice", "scallions"],
    wings: ["butter", "honey", "toasted sesame"],
    marinade: ["chicken thighs", "ginger", "garlic", "brown sugar"],
    "stir-fry": ["broccoli", "mushrooms", "snap peas", "noodles"],
    "dipping-sauce": ["rice vinegar", "sesame oil", "scallions"],
  },
  "spicy-tokyo": {
    ramen: ["ground pork", "chili oil", "scallions", "nori"],
    "rice-bowl": ["steak", "kimchi", "cucumber", "fried egg"],
    wings: ["butter", "lime", "chili crisp"],
    marinade: ["flank steak", "garlic", "sesame oil", "lime"],
    "stir-fry": ["udon", "bok choy", "pork", "garlic"],
    "dipping-sauce": ["rice vinegar", "chili crisp", "sesame oil"],
  },
  "citrus-shoyu": {
    ramen: ["cold noodles", "cucumber", "edamame", "sesame"],
    "rice-bowl": ["salmon", "avocado", "cucumber", "furikake"],
    wings: ["lime", "honey", "sesame seeds"],
    marinade: ["salmon", "ginger", "orange", "green onion"],
    "stir-fry": ["shrimp", "snap peas", "cabbage", "rice noodles"],
    "dipping-sauce": ["rice vinegar", "ginger", "scallions"],
  },
  "shoyu-reserve": {
    ramen: ["mushrooms", "soft egg", "nori", "scallions"],
    "rice-bowl": ["roasted mushrooms", "jammy egg", "sesame greens"],
    wings: ["brown butter", "black pepper", "sesame"],
    marinade: ["pork chops", "garlic", "ginger", "brown sugar"],
    "stir-fry": ["mushrooms", "onion", "greens", "noodles"],
    "dipping-sauce": ["rice vinegar", "garlic", "sesame oil"],
  },
};

const TITLE_PATTERNS = {
  ramen: {
    original: "Original Weeknight Ramen Bowl",
    "spicy-tokyo": "Spicy Tokyo Fire Ramen",
    "citrus-shoyu": "Citrus Shoyu Cold Noodle Bowl",
    "shoyu-reserve": "Shoyu Reserve Mushroom Ramen",
  },
  "rice-bowl": {
    original: "Original Crispy Chicken Rice Bowl",
    "spicy-tokyo": "Spicy Tokyo Steak Rice Bowl",
    "citrus-shoyu": "Citrus Shoyu Salmon Rice Bowl",
    "shoyu-reserve": "Shoyu Reserve Mushroom Rice Bowl",
  },
  wings: {
    original: "Original Sticky Sesame Wings",
    "spicy-tokyo": "Spicy Tokyo Chili Wings",
    "citrus-shoyu": "Citrus Shoyu Honey Wings",
    "shoyu-reserve": "Shoyu Reserve Black Pepper Wings",
  },
  marinade: {
    original: "Original Garlic Chicken Marinade",
    "spicy-tokyo": "Spicy Tokyo Steak Marinade",
    "citrus-shoyu": "Citrus Shoyu Salmon Marinade",
    "shoyu-reserve": "Shoyu Reserve Pork Chop Marinade",
  },
  "stir-fry": {
    original: "Original Broccoli Noodle Stir Fry",
    "spicy-tokyo": "Spicy Tokyo Udon Stir Fry",
    "citrus-shoyu": "Citrus Shoyu Shrimp Stir Fry",
    "shoyu-reserve": "Shoyu Reserve Mushroom Stir Fry",
  },
  "dipping-sauce": {
    original: "Original Dumpling Dip",
    "spicy-tokyo": "Spicy Tokyo Gyoza Dip",
    "citrus-shoyu": "Citrus Shoyu Spring Roll Dip",
    "shoyu-reserve": "Shoyu Reserve Steak Dip",
  },
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ingredientsFor(flavor, useCase) {
  const pairings = PAIRINGS[flavor.id][useCase.id];
  const sauceAmount = useCase.id === "dipping-sauce" ? "1/4 cup NoodleBomb" : "3-4 tbsp NoodleBomb";
  const base = {
    ramen: [`1 serving ${useCase.base}`, sauceAmount, ...pairings],
    "rice-bowl": [`2 cups ${useCase.base}`, sauceAmount, ...pairings],
    wings: ["2 lb chicken wings", sauceAmount, ...pairings],
    marinade: [`1 lb ${pairings[0]}`, "1/3 cup NoodleBomb", ...pairings.slice(1)],
    "stir-fry": [`2 cups ${useCase.base}`, sauceAmount, ...pairings],
    "dipping-sauce": [sauceAmount, ...pairings],
  };
  return base[useCase.id];
}

function stepsFor(flavor, useCase) {
  const finish = `Finish with ${flavor.name} so the ${flavor.profile} comes through.`;
  const steps = {
    ramen: [
      "Cook noodles until springy, then drain or move into a hot bowl with a little broth.",
      `Add ${flavor.name} and toss until the noodles are glossy.`,
      "Add toppings while everything is still hot.",
      finish,
    ],
    "rice-bowl": [
      "Start with hot rice and one crisp or seared protein.",
      "Add one fresh crunch topping and one rich topping.",
      `Spoon ${flavor.name} over the center and fold lightly before eating.`,
      "Add extra sauce at the table if the bowl needs more punch.",
    ],
    wings: [
      "Bake or air-fry wings at 400 F until crisp.",
      `Warm ${flavor.name} with butter or honey in a small pan.`,
      "Toss hot wings with the sauce in a large bowl.",
      "Rest 2 minutes so the coating sets before serving.",
    ],
    marinade: [
      `Whisk ${flavor.name} with oil and aromatics.`,
      "Coat the protein and marinate 20 minutes to overnight depending on thickness.",
      "Cook hot and fast until browned.",
      "Rest, slice, then spoon a little fresh sauce over the top.",
    ],
    "stir-fry": [
      "Cook vegetables or protein first over high heat.",
      "Add noodles or rice and toss until hot.",
      `Turn off the heat, add ${flavor.name}, and toss hard for 20 seconds.`,
      "Serve immediately with scallions or sesame.",
    ],
    "dipping-sauce": [
      `Whisk ${flavor.name} with vinegar or sesame oil.`,
      "Taste and adjust with lime, scallion, or chili crisp.",
      "Serve in a small bowl next to hot dumplings, rolls, fries, or grilled meat.",
      "Keep extra nearby because the first bowl goes fast.",
    ],
  };
  return steps[useCase.id];
}

function buildRecipes() {
  return FLAVORS.flatMap((flavor) =>
    USE_CASES.map((useCase) => {
      const title = TITLE_PATTERNS[useCase.id][flavor.id];
      const slug = slugify(title);
      return {
        id: slug,
        title,
        slug,
        flavorId: flavor.id,
        flavorName: flavor.name,
        flavorUrl: flavor.productUrl,
        category: useCase.id,
        categoryLabel: useCase.label,
        time: useCase.time,
        serves: useCase.serves,
        difficulty: useCase.id === "marinade" || useCase.id === "wings" ? "Easy" : "Fast",
        hook: `${useCase.action} ${flavor.name} brings ${flavor.profile}.`,
        description: `${title} turns ${useCase.base} into a high-crave NoodleBomb use case with ${flavor.angle}.`,
        ingredients: ingredientsFor(flavor, useCase),
        steps: stepsFor(flavor, useCase),
        tags: [flavor.name, useCase.label, flavor.color, "fast dinner", "NoodleBomb"],
        seoTitle: `${title} | NoodleBomb ${useCase.label}`,
        metaDescription: `${title} made with NoodleBomb ${flavor.name}. Fast ${useCase.label.toLowerCase()} idea with bold flavor and simple steps.`,
      };
    }),
  );
}

function buildSocialPosts(recipes) {
  return recipes.flatMap((recipe) => [
    {
      id: `${recipe.id}-reel`,
      channel: "instagram_reel",
      recipeId: recipe.id,
      flavorName: recipe.flavorName,
      hook: `${recipe.title} in ${recipe.time}.`,
      caption: `${recipe.title}: ${recipe.hook} Save this for the next time dinner feels boring. Shop ${recipe.flavorName} at noodlebomb.co${recipe.flavorUrl}.`,
      shotList: [
        "Bottle next to finished dish",
        "Close-up sauce hitting hot food",
        "Final bite pull or crunch shot",
      ],
      hashtags: ["#NoodleBomb", "#RamenSauce", "#EasyDinner", `#${recipe.flavorName.replace(/\s+/g, "")}`],
    },
    {
      id: `${recipe.id}-pin`,
      channel: "pinterest",
      recipeId: recipe.id,
      flavorName: recipe.flavorName,
      hook: recipe.seoTitle,
      caption: `${recipe.metaDescription} Ingredients: ${recipe.ingredients.slice(0, 4).join(", ")}.`,
      shotList: ["Overhead finished plate", "Ingredient layout", "Bottle in frame"],
      hashtags: ["NoodleBomb", recipe.categoryLabel, recipe.flavorName],
    },
  ]);
}

function buildBlogPosts(recipes) {
  const byUseCase = new Map();
  for (const recipe of recipes) {
    const group = byUseCase.get(recipe.category) ?? [];
    group.push(recipe);
    byUseCase.set(recipe.category, group);
  }

  const useCasePosts = [...byUseCase.entries()].map(([category, group]) => {
    const label = group[0].categoryLabel;
    return {
      slug: slugify(`best-noodlebomb-${label}`),
      title: `Best NoodleBomb ${label} Ideas`,
      description: `${group.length} fast ${label.toLowerCase()} ideas organized by flavor.`,
      recipes: group.map((recipe) => recipe.id),
      body: [
        `# Best NoodleBomb ${label} Ideas`,
        "",
        `These ${label.toLowerCase()} ideas show how each NoodleBomb flavor changes the same use case.`,
        "",
        ...group.flatMap((recipe) => [
          `## ${recipe.title}`,
          recipe.description,
          `Shop: ${recipe.flavorUrl}`,
          "",
        ]),
      ].join("\n"),
    };
  });

  const flavorPosts = FLAVORS.map((flavor) => {
    const group = recipes.filter((recipe) => recipe.flavorId === flavor.id);
    return {
      slug: slugify(`how-to-use-noodlebomb-${flavor.name}`),
      title: `How to Use NoodleBomb ${flavor.name}`,
      description: `${flavor.name} recipe ideas for noodles, rice bowls, wings, marinades, stir fry, and dips.`,
      recipes: group.map((recipe) => recipe.id),
      body: [
        `# How to Use NoodleBomb ${flavor.name}`,
        "",
        `${flavor.name} is ${flavor.angle}: ${flavor.profile}.`,
        "",
        ...group.flatMap((recipe) => [
          `## ${recipe.title}`,
          recipe.hook,
          `Best for: ${recipe.categoryLabel}.`,
          "",
        ]),
      ].join("\n"),
    };
  });

  return [...useCasePosts, ...flavorPosts];
}

function buildEmailCampaigns(recipes) {
  return FLAVORS.map((flavor) => {
    const group = recipes.filter((recipe) => recipe.flavorId === flavor.id);
    return {
      id: `email-${flavor.id}-use-cases`,
      flavorName: flavor.name,
      subject: `6 ways to use ${flavor.name} this week`,
      previewText: `Ramen, rice bowls, wings, marinades, stir fry, and dips with ${flavor.name}.`,
      sections: [
        {
          headline: `${flavor.name} is not just for ramen.`,
          body: `Use it when dinner needs ${flavor.profile}.`,
        },
        ...group.slice(0, 6).map((recipe) => ({
          headline: recipe.title,
          body: `${recipe.time}. ${recipe.hook}`,
        })),
      ],
      ctaLabel: `Shop ${flavor.name}`,
      ctaUrl: flavor.productUrl,
    };
  });
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeMarkdownPosts(posts) {
  ensureDir(BLOG_DIR);
  for (const post of posts) {
    const frontmatter = [
      "---",
      `title: "${post.title.replaceAll('"', '\\"')}"`,
      `description: "${post.description.replaceAll('"', '\\"')}"`,
      `slug: "${post.slug}"`,
      "status: draft",
      "---",
      "",
    ].join("\n");
    fs.writeFileSync(path.join(BLOG_DIR, `${post.slug}.md`), `${frontmatter}${post.body}\n`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRecipeCard(recipe) {
  return `<article class="recipe-card">
          <div class="recipe-meta"><span>${escapeHtml(recipe.time.toUpperCase())}</span><span class="dot"></span><span>${escapeHtml(recipe.categoryLabel.toUpperCase())}</span></div>
          <h3>${escapeHtml(recipe.title)}</h3>
          <p>${escapeHtml(recipe.hook)}</p>
          <p><strong>Ingredients:</strong> ${escapeHtml(recipe.ingredients.join(", "))}.</p>
          <ol style="margin:14px 0 0;padding-left:19px;color:var(--muted);font-size:14px;line-height:1.7;">
            ${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("\n            ")}
          </ol>
          <div class="pairing">Best with &middot; ${escapeHtml(recipe.flavorName)}</div>
          <a class="text-link" href="${recipe.flavorUrl}">Shop ${escapeHtml(recipe.flavorName)} &rarr;</a>
        </article>`;
}

function renderRecipesHtml(payload) {
  const recipesByFlavor = FLAVORS.map((flavor) => ({
    flavor,
    recipes: payload.recipes.filter((recipe) => recipe.flavorId === flavor.id),
  }));
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NoodleBomb Recipe Library",
    itemListElement: payload.recipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.metaDescription,
        recipeCategory: recipe.categoryLabel,
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.steps.map((step) => ({ "@type": "HowToStep", text: step })),
      },
    })),
  };

  return `<!DOCTYPE html>
<html lang="en" style="--accent: #E84A3A; --accent-ink: #0E0D0C;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0E0D0C">
<title>Ramen Sauce Recipes | Bowls, Wings, Marinades | NoodleBomb</title>
<meta name="description" content="Twenty-four NoodleBomb recipes organized by flavor: ramen, rice bowls, wings, marinades, stir fry, and dipping sauces." />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
<link rel="canonical" href="https://noodlebomb.co/recipes" />
<meta property="og:title" content="Ramen Sauce Recipes | NoodleBomb" />
<meta property="og:description" content="Recipe ideas by flavor: ramen, rice bowls, wings, marinades, stir fry, and dipping sauces." />
<meta property="og:image" content="https://noodlebomb.co/uploads/nb-hero-editorial-v2.jpg" />
<meta property="og:url" content="https://noodlebomb.co/recipes" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="NoodleBomb" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Ramen Sauce Recipes | NoodleBomb" />
<meta name="twitter:description" content="Bowls, wings, marinades, stir fry, and dipping sauces built around NoodleBomb." />
<meta name="twitter:image" content="https://noodlebomb.co/uploads/nb-hero-editorial-v2.jpg" />
<meta name="twitter:image:alt" content="NoodleBomb sauces with noodles and aromatics" />
<script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/page-shared.css">
</head>
<body class="grain">
<a href="#main" class="skip-to-content">Skip to main content</a>

<nav class="page-nav" aria-label="Primary">
  <a class="nav-brand" href="/"><span class="nav-brand-mark">N</span><span class="nav-brand-name">noodlebomb</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/shop">Shop Sauces</a>
    <a href="/recipes" aria-current="page">Recipes</a>
    <a href="/about">About</a>
    <a href="/monthly-box">Monthly Ramen Box</a>
    <a href="/faq">FAQ</a>
    <a href="mailto:hello@noodlebomb.co">Contact</a>
  </div>
  <div class="nav-right">
    <a class="nav-cta" href="/shop">Shop sauces &rarr;</a>
    <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false" aria-controls="nav-drawer"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="nav-drawer" id="nav-drawer" aria-hidden="true">
  <a href="/">Home</a>
  <a href="/shop">Shop Sauces</a>
  <a href="/recipes" aria-current="page">Recipes</a>
  <a href="/about">About</a>
  <a href="/monthly-box">Monthly Ramen Box</a>
  <a href="/faq">FAQ</a>
  <a href="mailto:hello@noodlebomb.co">Contact</a>
  <a class="drawer-cta" href="/shop">Shop sauces &rarr;</a>
</div>

<main id="main">
  <section class="page-hero">
    <div class="container">
      <div class="eyebrow">Recipes &middot; Flavor imagination</div>
      <h1 class="display">More ways to eat.<br><em>More reasons to buy.</em></h1>
      <p class="lede">Twenty-four recipe ideas organized by flavor: ramen, rice bowls, wings, marinades, stir fry, and dipping sauces. Pick a bottle, then pick dinner.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:28px;">
        ${USE_CASES.map((useCase) => `<a class="btn btn-secondary" href="#${useCase.id}" style="padding:10px 14px;font-size:12px;">${escapeHtml(useCase.label)}</a>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="container">
      <div class="kicker">Use-case library &middot; Generated from the recipe content engine</div>
      <h2 class="serif">One bottle should answer dinner six ways.</h2>
      <div class="recipe-grid">
        ${USE_CASES.map((useCase) => `<article class="recipe-card" id="${useCase.id}">
          <div class="recipe-meta"><span>${escapeHtml(useCase.label.toUpperCase())}</span><span class="dot"></span><span>${escapeHtml(useCase.time.toUpperCase())}</span></div>
          <h3>${escapeHtml(useCase.action)}</h3>
          <p>Recipes included for Original, Spicy Tokyo, Citrus Shoyu, and Shoyu Reserve.</p>
          <div class="pairing">Base &middot; ${escapeHtml(useCase.base)}</div>
        </article>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${recipesByFlavor.map(({ flavor, recipes }) => `<section class="page-section">
    <div class="container">
      <div class="kicker">${escapeHtml(flavor.name)} &middot; ${escapeHtml(flavor.angle)}</div>
      <h2 class="serif">${escapeHtml(flavor.color)} recipes.</h2>
      <p class="lede" style="max-width:760px;margin-bottom:34px;">${escapeHtml(flavor.profile)} across ${recipes.length} everyday use cases.</p>
      <div class="recipe-grid">
        ${recipes.map(renderRecipeCard).join("\n        ")}
      </div>
    </div>
  </section>`).join("\n\n  ")}

  <section class="page-section">
    <div class="container">
      <div class="inline-capture">
        <h3>Get the next recipe batch.</h3>
        <p>New bowls, wing sauces, marinades, and quick dinners. Built for people who want dinner to taste less accidental.</p>
        <form class="inline-form" action="https://formsubmit.co/hello@noodlebomb.co" method="POST">
          <input type="hidden" name="_subject" value="NoodleBomb Recipes Signup">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_next" value="https://noodlebomb.co/recipes?subscribed=1">
          <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
          <button type="submit">Send recipes &rarr;</button>
        </form>
      </div>
    </div>
  </section>

  <section class="page-cta">
    <div class="container">
      <h2 class="display">People buy <em>flavor imagination.</em></h2>
      <p>Ramen, rice, wings, marinades, stir fry, dumplings. If it is savory, NoodleBomb has a job.</p>
      <a class="btn btn-accent" href="/shop">Shop the range &rarr;</a>
    </div>
  </section>
</main>

<footer class="page-footer">
  <div class="container">
    <div class="footer-newsletter">
      <div>
        <div class="footer-newsletter-h">Sauce drops, restock alerts, the occasional recipe.</div>
        <div class="footer-newsletter-sub">Once a month. Never spam.</div>
      </div>
      <form class="footer-newsletter-form" action="https://formsubmit.co/hello@noodlebomb.co" method="POST">
        <input type="hidden" name="_subject" value="NoodleBomb Newsletter Signup">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_next" value="https://noodlebomb.co/?subscribed=1">
        <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
        <button type="submit">Subscribe</button>
      </form>
    </div>
    <div class="footer-policy" style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;padding:36px 0 18px;border-top:1px solid var(--line);font-size:13px;letter-spacing:-0.005em;">
      <a href="/privacy" style="color:var(--ink);opacity:0.8;text-decoration:none;padding:12px 8px;display:inline-block;">Privacy Policy</a>
      <span style="opacity:0.85;" aria-hidden="true">|</span>
      <a href="/terms" style="color:var(--ink);opacity:0.8;text-decoration:none;padding:12px 8px;display:inline-block;">Terms of Service</a>
      <span style="opacity:0.85;" aria-hidden="true">|</span>
      <a href="/shipping-returns" style="color:var(--ink);opacity:0.8;text-decoration:none;padding:12px 8px;display:inline-block;">Shipping &amp; Returns</a>
      <span style="opacity:0.85;" aria-hidden="true">|</span>
      <a href="/faq" style="color:var(--ink);opacity:0.8;text-decoration:none;padding:12px 8px;display:inline-block;">FAQ</a>
    </div>
    <div class="footer-contact" style="text-align:center;padding:6px 0 18px;">
      <a href="mailto:hello@noodlebomb.co" style="color:var(--ink);opacity:0.85;text-decoration:none;font-size:14px;">hello@noodlebomb.co</a><a href="tel:+12534863445" style="color:var(--ink);opacity:0.85;text-decoration:none;font-size:14px;margin-left:14px;">253-486-3445</a>
    </div>
    <div class="footer-social" style="justify-content:center;border-top:none;padding:6px 0 24px;">
      <a href="https://instagram.com/noodlebombsauce" target="_blank" rel="noopener" aria-label="NoodleBomb on Instagram">Instagram</a>
      <a href="https://tiktok.com/@noodlebombsauce" target="_blank" rel="noopener" aria-label="NoodleBomb on TikTok">TikTok</a>
    </div>
    <div class="footer-bottom" style="justify-content:center;flex-direction:column;gap:6px;text-align:center;border-top:1px solid var(--line);padding-top:20px;">
      <span class="mono">&copy; 2026 NoodleBomb</span>
      <span style="font-size:12.5px;opacity:0.7;letter-spacing:-0.005em;">Handcrafted in Bonney Lake, WA &middot; Small batch &middot; Pour bold.</span>
    </div>
  </div>
</footer>
<script src="/page-shared.js" defer></script>
</body>
</html>
`;
}

function writeOutputs(payload) {
  ensureDir(OUT_DIR);
  ensureDir(path.dirname(GENERATED_TS));
  writeMarkdownPosts(payload.blogPosts);
  fs.writeFileSync(path.join(ROOT, "recipes.html"), renderRecipesHtml(payload));

  fs.writeFileSync(path.join(OUT_DIR, "recipe-content.json"), `${JSON.stringify(payload, null, 2)}\n`);

  const recipeHeaders = ["id", "title", "flavorName", "categoryLabel", "time", "serves", "difficulty", "flavorUrl", "metaDescription"];
  fs.writeFileSync(
    path.join(OUT_DIR, "recipes.csv"),
    `${recipeHeaders.join(",")}\n${payload.recipes.map((recipe) => recipeHeaders.map((key) => csvEscape(recipe[key])).join(",")).join("\n")}\n`,
  );

  const socialHeaders = ["id", "channel", "recipeId", "flavorName", "hook", "caption", "shotList", "hashtags"];
  fs.writeFileSync(
    path.join(OUT_DIR, "social-posts.csv"),
    `${socialHeaders.join(",")}\n${payload.socialPosts.map((post) => socialHeaders.map((key) => csvEscape(post[key])).join(",")).join("\n")}\n`,
  );

  const emailMarkdown = payload.emailCampaigns.map((email) => [
    `# ${email.subject}`,
    "",
    `Preview: ${email.previewText}`,
    "",
    ...email.sections.flatMap((section) => [`## ${section.headline}`, section.body, ""]),
    `[${email.ctaLabel}](${email.ctaUrl})`,
    "",
  ].join("\n")).join("\n---\n\n");
  fs.writeFileSync(path.join(OUT_DIR, "email-campaigns.md"), emailMarkdown);

  const report = [
    "# NoodleBomb Recipe Content Engine",
    "",
    `Generated: ${payload.generatedAt}`,
    "",
    `- Recipes: ${payload.recipes.length}`,
    `- Social posts: ${payload.socialPosts.length}`,
    `- Blog drafts: ${payload.blogPosts.length}`,
    `- Email campaigns: ${payload.emailCampaigns.length}`,
    "",
    "## Recipes by Flavor",
    "",
    ...FLAVORS.map((flavor) => `- ${flavor.name}: ${payload.recipes.filter((recipe) => recipe.flavorId === flavor.id).length}`),
    "",
    "## Recipes by Use Case",
    "",
    ...USE_CASES.map((useCase) => `- ${useCase.label}: ${payload.recipes.filter((recipe) => recipe.category === useCase.id).length}`),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "recipe-content-report.md"), report);

  const ts = `// Auto-generated by scripts/recipe-content-engine.mjs. Do not edit by hand.
export type RecipeContentItem = {
  id: string;
  title: string;
  slug: string;
  flavorId: string;
  flavorName: string;
  flavorUrl: string;
  category: string;
  categoryLabel: string;
  time: string;
  serves: string;
  difficulty: string;
  hook: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  seoTitle: string;
  metaDescription: string;
};

export type RecipeSocialPost = {
  id: string;
  channel: string;
  recipeId: string;
  flavorName: string;
  hook: string;
  caption: string;
  shotList: string[];
  hashtags: string[];
};

export type RecipeBlogPost = {
  slug: string;
  title: string;
  description: string;
  recipes: string[];
  body: string;
};

export type RecipeEmailCampaign = {
  id: string;
  flavorName: string;
  subject: string;
  previewText: string;
  sections: Array<{ headline: string; body: string }>;
  ctaLabel: string;
  ctaUrl: string;
};

export const RECIPE_CONTENT_GENERATED_AT = ${JSON.stringify(payload.generatedAt)};
export const RECIPE_FLAVORS = ${JSON.stringify(FLAVORS.map(({ id, name, productUrl, profile, angle, color }) => ({ id, name, productUrl, profile, angle, color })), null, 2)} as const;
export const RECIPE_USE_CASES = ${JSON.stringify(USE_CASES.map(({ id, label }) => ({ id, label })), null, 2)} as const;
export const GENERATED_RECIPES = ${JSON.stringify(payload.recipes, null, 2)} satisfies RecipeContentItem[];
export const GENERATED_SOCIAL_POSTS = ${JSON.stringify(payload.socialPosts, null, 2)} satisfies RecipeSocialPost[];
export const GENERATED_BLOG_POSTS = ${JSON.stringify(payload.blogPosts, null, 2)} satisfies RecipeBlogPost[];
export const GENERATED_EMAIL_CAMPAIGNS = ${JSON.stringify(payload.emailCampaigns, null, 2)} satisfies RecipeEmailCampaign[];
`;
  fs.writeFileSync(GENERATED_TS, ts);
}

function main() {
  const recipes = buildRecipes();
  const payload = {
    generatedAt: new Date().toISOString(),
    flavors: FLAVORS,
    useCases: USE_CASES,
    recipes,
    socialPosts: buildSocialPosts(recipes),
    blogPosts: buildBlogPosts(recipes),
    emailCampaigns: buildEmailCampaigns(recipes),
  };
  writeOutputs(payload);
  console.log(`Generated ${payload.recipes.length} recipes`);
  console.log(`Generated ${payload.socialPosts.length} social posts`);
  console.log(`Generated ${payload.blogPosts.length} blog drafts`);
  console.log(`Generated ${payload.emailCampaigns.length} email campaigns`);
  console.log(path.join(OUT_DIR, "recipe-content-report.md"));
  console.log(GENERATED_TS);
}

main();

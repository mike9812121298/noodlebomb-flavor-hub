(function () {
  "use strict";

  var CACHE_TTL_MS = 5 * 60 * 1000;
  var STORE_DOMAIN = "nu2vqa-ma.myshopify.com";
  var API_VERSION = "2026-04";
  var STOREFRONT_TOKEN = "f59fc9587d70903d22d0b8cc53e882b7";

  var titleOverrides = {
    "original-chicken-ramen": "Original Chicken Ramen",
    "original-garlic-sesame-ramen": "Original Garlic Sesame Ramen",
    "original-crispy-chicken-rice-bowl": "Original Crispy Chicken Rice Bowl",
    "spicy-tokyo-chili-ramen": "Spicy Tokyo Chili Ramen",
    "spicy-tokyo-air-fryer-wings": "Spicy Tokyo Air Fryer Wings",
    "spicy-tokyo-chicken-rice-bowl": "Spicy Tokyo Chicken Rice Bowl",
    "citrus-shoyu-salmon-ramen": "Citrus Shoyu Salmon Ramen",
    "citrus-shoyu-grilled-wings": "Citrus Shoyu Grilled Wings",
    "citrus-shoyu-salmon-rice-bowl": "Citrus Shoyu Salmon Rice Bowl",
    "citrus-shoyu-cold-noodles": "Citrus Shoyu Cold Noodles"
  };

  function cleanTitle(value) {
    return String(value || "")
      .replace(/\b7\s*(?:fl\.?\s*)?oz\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function titleFromSlug(slug) {
    if (titleOverrides[slug]) return cleanTitle(titleOverrides[slug]);
    return cleanTitle(
      String(slug || "")
        .split("-")
        .filter(Boolean)
        .map(function (part) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ")
    );
  }

  function parseRecipeValue(value) {
    try {
      var parsed = JSON.parse(value || "[]");
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 3) : [];
    } catch (_error) {
      return [];
    }
  }

  function render(container, handles) {
    if (!container || !handles.length) return;
    container.innerHTML = handles
      .slice(0, 3)
      .map(function (slug) {
        var safeSlug = String(slug).replace(/[^a-z0-9-]/gi, "");
        var title = titleFromSlug(safeSlug);
        return (
          '<a class="related-recipe-card" href="/recipes#' +
          safeSlug +
          '">' +
          '<span class="related-recipe-thumb" aria-hidden="true">NB</span>' +
          '<span class="related-recipe-copy">' +
          '<span class="related-recipe-kicker">Recipe</span>' +
          '<strong>' +
          title +
          "</strong>" +
          "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  function cacheKey(handle) {
    return "nb_related_recipes:" + handle;
  }

  function readCache(handle) {
    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey(handle)) || "null");
      if (!cached || Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
      return cached.handles;
    } catch (_error) {
      return null;
    }
  }

  function writeCache(handle, handles) {
    try {
      localStorage.setItem(cacheKey(handle), JSON.stringify({ savedAt: Date.now(), handles: handles }));
    } catch (_error) {
      // localStorage can be unavailable in privacy modes; static fallback remains.
    }
  }

  function fetchMetafield(handle) {
    return fetch("https://" + STORE_DOMAIN + "/api/" + API_VERSION + "/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query:
          "query ProductRelatedRecipes($handle: String!) { product(handle: $handle) { metafield(namespace: \"custom\", key: \"related_recipes\") { value type } } }",
        variables: { handle: handle }
      })
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Storefront API " + response.status);
        return response.json();
      })
      .then(function (payload) {
        var value =
          payload &&
          payload.data &&
          payload.data.product &&
          payload.data.product.metafield &&
          payload.data.product.metafield.value;
        return parseRecipeValue(value);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-related-recipes]").forEach(function (section) {
      var handle = section.getAttribute("data-shopify-handle");
      var grid = section.querySelector("[data-related-recipes-grid]");
      if (!handle || !grid) return;

      var cached = readCache(handle);
      if (cached && cached.length) render(grid, cached);

      fetchMetafield(handle)
        .then(function (handles) {
          if (!handles.length) return;
          writeCache(handle, handles);
          render(grid, handles);
        })
        .catch(function () {
          // Keep the static server-rendered fallback.
        });
    });
  });
})();

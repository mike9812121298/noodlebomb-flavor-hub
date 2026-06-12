import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display font-black tracking-tight text-2xl leading-none">
                <span className="text-foreground">noodle</span>
                <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">bomb</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Small-batch ramen sauce crafted in the Pacific Northwest. Bold flavor, no shortcuts.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/noodlebomb" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@noodlebomb" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="mailto:hello@noodlebomb.co"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: "Original", href: "/original-ramen-sauce" },
                { label: "Spicy Tokyo", href: "/spicy-tokyo-ramen-sauce" },
                { label: "Citrus Shoyu", href: "/citrus-shoyu-ramen-sauce" },
                { label: "Ramen Sauce Trio", href: "/ramen-sauce-trio" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { label: "Recipes", to: "/recipes" },
                { label: "Our Story", to: "/about" },
                { label: "FAQ", to: "/faq" },
                { label: "Monthly Ramen Box", href: "/monthly-box" },
              ].map((item) => (
                <li key={item.label}>
                  {"href" in item ? (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</a>
                  ) : (
                    <Link to={item.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Promise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🚚 Free shipping $29.99+</li>
              <li>💰 100% money-back guarantee</li>
              <li>🍜 Small batch, handcrafted</li>
              <li>📦 Ships in 1–2 business days</li>
              <li>🌿 Built for big flavor</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-xs text-muted-foreground">© 2026 NoodleBomb. All rights reserved.</p>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <p className="text-xs text-muted-foreground">Bonney Lake, WA 98391</p>
          </div>
          <p className="text-xs text-muted-foreground font-display tracking-widest uppercase">Small Batch · Handcrafted · Premium</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

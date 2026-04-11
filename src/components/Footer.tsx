import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background pt-20 pb-12">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block mb-5">
            <span className="font-display font-black tracking-tight text-2xl leading-none"><span className="text-foreground">noodle</span><span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">bomb</span></span>
          </Link>
          <p className="text-foreground/50 text-sm leading-relaxed max-w-sm">
            Small-batch ramen sauces crafted to bring restaurant-level flavor home. Bold. Balanced. Unforgettable.
          </p>
          <div className="flex items-center gap-4 mt-6">
            {["Instagram", "TikTok", "YouTube"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-5">Shop</h4>
          <div className="flex flex-col gap-3">
            <Link to="/shop" className="text-sm text-foreground/60 hover:text-primary transition-colors">All Sauces</Link>
            <Link to="/ramen-box" className="text-sm text-foreground/60 hover:text-primary transition-colors">Ramen Box</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-5">Explore</h4>
          <div className="flex flex-col gap-3">
            <Link to="/recipes" className="text-sm text-foreground/60 hover:text-primary transition-colors">Recipes</Link>
            <Link to="/sauce-selector" className="text-sm text-foreground/60 hover:text-primary transition-colors">Sauce Finder</Link>
          </div>
        </div>
      </div>
      <div className="section-divider" />
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-foreground/30 font-display tracking-[0.2em] uppercase">© 2026 Noodle Bomb. All rights reserved.</p>
        <p className="text-[10px] text-foreground/20 font-display tracking-[0.15em] uppercase">Small Batch · Handcrafted · Premium</p>
      </div>
    </div>
  </footer>
);

export default Footer;
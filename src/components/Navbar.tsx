import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";

const navItems = [
  { label: "Shop", path: "/shop" },
  { label: "Ramen Box", path: "/ramen-box" },
  { label: "Recipes", path: "/recipes" },
  { label: "Sauce Finder", path: "/sauce-selector" },
  { label: "About", path: "/about" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/50 bg-background/95 backdrop-blur-xl shadow-[0_2px_20px_hsl(0_0%_0%/0.3)]"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-display font-black tracking-tight text-xl leading-none">
            <span className="text-foreground">noodle</span>
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              bomb
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-display text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Cart icon */}
          <Link
            to="/cart"
            aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            className="relative p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-gradient-fire text-[10px] font-display font-bold text-white flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <Link
            to="/shop"
            className="bg-gradient-fire px-5 py-2 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-fire"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-gradient-fire text-[10px] font-display font-bold text-white flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="font-display text-lg font-medium uppercase tracking-wider text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="bg-gradient-fire text-center px-5 py-3 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

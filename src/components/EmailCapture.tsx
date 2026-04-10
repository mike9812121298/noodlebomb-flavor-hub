import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame } from "lucide-react";

const EmailCapture = () => {
  const [show, setShow] = useState(() => {
    return !sessionStorage.getItem("nb-email-dismissed");
  });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("nb-email-dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(dismiss, 2000);
  };

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 30 seconds
    const timer = setTimeout(() => setVisible(true), 30000);

    // Exit intent: mouse leaves viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!show || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-card border border-border rounded-3xl p-8 md:p-12 max-w-md w-full text-center"
        >
          <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <>
              <Flame className="h-10 w-10 text-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">GET ON THE LIST.</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our 50-gallon runs sell out fast. Join the Inner Circle to get early access to new drops, secret recipes, and 15% off your first bottle.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-gradient-fire px-6 py-3 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:shadow-fire transition-all"
                >
                  GET MINE
                </button>
              </form>
              <button onClick={dismiss} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
                No thanks, I'll pay full price
              </button>
            </>
          ) : (
            <>
              <span className="text-4xl mb-4 block">🔥</span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">You're In!</h3>
              <p className="text-sm text-muted-foreground">Check your inbox for your 15% off code.</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailCapture;

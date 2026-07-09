import { motion } from "framer-motion";

const messages = [
  "Free US shipping on orders $29.99+",
  "Sauces $12.99 - Spices $10.99",
  "Real reviews are coming next - no fake stars",
];

const AnnouncementBar = () => (
  <div className="bg-gradient-fire text-primary-foreground overflow-hidden">
    <motion.div
      animate={{ x: [0, -1000] }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      className="flex whitespace-nowrap py-2"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="mx-8 font-display text-xs font-semibold uppercase tracking-[0.2em]">
          {messages.map((msg, j) => (
            <span key={j}>
              {msg}
              {j < messages.length - 1 && "  |  "}
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  </div>
);

export default AnnouncementBar;

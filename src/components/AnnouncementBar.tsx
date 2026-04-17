import { motion } from "framer-motion";

const messages = [
  "Loved by Ramen Fans Everywhere",
    "Free Shipping on All Orders Over $45",
      "Bundle & Save Up to 20%",
        "4.9 Stars \u00B7 31,000+ Reviews",
        ];

        const AnnouncementBar = () => (
          <div className="bg-gradient-fire text-primary-foreground overflow-hidden">
              <motion.div
                    animate={{ x: [0, -1200] }}
                          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                                className="flex whitespace-nowrap py-2"
                                    >
                                          {Array.from({ length: 6 }).map((_, i) => (
                                                  <span key={i} className="mx-8 font-display text-xs font-semibold uppercase tracking-[0.2em]">
                                                            {messages.map((msg, j) => (
                                                                        <span key={j}>
                                                                                      {msg}
                                                                                                    {j < messages.length - 1 && " \u00A0\u00A0\u2022\u00A0\u00A0 "}
                                                                                                                </span>
                                                                                                                          ))}
                                                                                                                                  </span>
                                                                                                                                        ))}
                                                                                                                                            </motion.div>
                                                                                                                                              </div>
                                                                                                                                              );

                                                                                                                                              export default AnnouncementBar;
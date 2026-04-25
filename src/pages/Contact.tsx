import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact | NoodleBomb Ramen Sauce";

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Get in touch with the NoodleBomb team. We'd love to hear from you.";

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://noodlebomb.co/contact";

    return () => {
      canonical?.remove();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fire-and-forget mailto fallback — swap for your form backend (Formspree, Resend, etc.)
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:hello@noodlebomb.co?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <h1 className="font-display text-4xl font-black text-foreground mb-3">Contact</h1>
          <p className="text-muted-foreground text-lg mb-10">
            Questions? We&rsquo;d love to hear from you.
          </p>

          {/* Email CTA card */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center gap-4 mb-10">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-fire flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-0.5">Email us directly</p>
              <a
                href="mailto:hello@noodlebomb.co"
                className="font-display font-bold text-foreground hover:text-primary transition-colors"
              >
                hello@noodlebomb.co
              </a>
            </div>
          </div>

          {/* Contact form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-10 text-center"
            >
              <Send className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Message sent!</h2>
              <p className="text-muted-foreground">We'll get back to you within 24 hours, Monday–Friday.</p>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-fire text-primary-foreground font-display font-bold text-sm uppercase tracking-wider py-3 rounded-full transition-all hover:shadow-fire flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-muted-foreground text-sm mt-8">
            We respond within 24 hours, Monday–Friday.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

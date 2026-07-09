import { Link } from "react-router-dom";

const SocialProof = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container max-w-4xl text-center">
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">
        Real Proof, Not Placeholder Proof
      </span>
      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
        Real reviews are coming next.
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        Until NoodleBomb has verified customer reviews wired in, this site should sell with product clarity, real photos, pricing, and use cases - not fabricated social proof.
      </p>
      <p className="mt-6 font-display text-xs uppercase tracking-[0.28em] text-primary/70">
        No fake stars. No fake review counts.
      </p>
      <Link to="/shop" className="inline-flex mt-8 px-7 py-3 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold uppercase tracking-wider">
        Shop the lineup
      </Link>
    </div>
  </section>
);

export default SocialProof;

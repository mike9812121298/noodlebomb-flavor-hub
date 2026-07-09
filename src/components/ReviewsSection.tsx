const ReviewsSection = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container max-w-4xl text-center">
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">
        Reviews
      </span>
      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
        Real reviews are coming next.
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        We are not filling this section with fake stars, borrowed quotes, or made-up buyer names. Customer reviews will appear here after the real review platform is connected and collecting verified feedback.
      </p>
      <p className="mt-6 font-display text-xs uppercase tracking-[0.28em] text-primary/70">
        No fake stars. No fake counts. No fake testimonials.
      </p>
    </div>
  </section>
);

export default ReviewsSection;

import { useEffect, useRef } from "react";

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
};

/**
 * Pure enhancement scroll reveal.
 * Content is ALWAYS visible (opacity: 1). JS never sets opacity to 0.
 * When element scrolls into view, adds "revealed" class to trigger
 * a CSS translateY animation — purely decorative.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: RevealOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return ref;
}

/**
 * Same as useScrollReveal but for staggered children.
 * Adds "revealed" + transition-delay to [data-reveal] children.
 * Content is ALWAYS visible. Animation is purely decorative.
 */
export function useScrollRevealChildren<T extends HTMLElement = HTMLDivElement>(
  options?: RevealOptions
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (!("IntersectionObserver" in window)) return;

    const children = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!children.length) return;

    const staggerMs = options?.staggerMs ?? 80;
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * staggerMs}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => child.classList.add("revealed"));
          observer.unobserve(container);
        }
      },
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.staggerMs, options?.threshold]);

  return ref;
}

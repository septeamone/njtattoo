/** Scroll to a section by id; smooth unless the visitor asked for reduced motion. */
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // wait one frame so a closing mobile menu has released the page scroll lock
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    // keyboard users continue from the section they asked for
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
  });
}

let locks = 0;
let originalOverflow = "";

/** Nested dialogs may close in either order; restore only after the last one. */
export function lockBodyScroll() {
  if (locks++ === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = originalOverflow;
  };
}

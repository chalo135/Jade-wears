// Counted so the search overlay and shop menu can't unlock each other.
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks === 1) document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.documentElement.style.overflow = "";
}

// Lets any trigger (header, bottom nav) open the single search overlay without shared React state.
export const OPEN_SEARCH_EVENT = "jw:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

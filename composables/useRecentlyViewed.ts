const STORAGE_KEY = "jigglycard_recently_viewed";
const MAX_ENTRIES = 12;

/**
 * Ultime schede prodotto visitate, tenute nel browser.
 *
 * Serve ai consigliati: senza account non c'è altro modo di sapere cosa
 * interessa a chi sta navigando. Resta tutto sul dispositivo; al server si
 * mandano solo gli slug, e solo nel momento in cui si chiedono i suggerimenti.
 */
export function useRecentlyViewed() {
  const read = (): string[] => {
    if (!import.meta.client) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const remember = (slug: string) => {
    if (!import.meta.client || !slug) return;
    const current = read().filter((entry) => entry !== slug);
    current.unshift(slug);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(current.slice(0, MAX_ENTRIES)),
    );
  };

  return { recentlyViewed: read, remember };
}

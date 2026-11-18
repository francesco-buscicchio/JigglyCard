/**
 * Fascia di prezzo dei filtri catalogo.
 *
 * Il pannello ragiona in euro interi. Min e max si omettono quando coincidono
 * con i bordi del listino: "tutto il catalogo" non è un filtro, ed è lo stesso
 * criterio già usato dal pannello desktop prima di chiamare il CMS (che invece
 * vuole i centesimi).
 */

export type PriceRangeState = {
  boundMin: number;
  boundMax: number;
  selectedMin: number;
  selectedMax: number;
};

export type PriceFilterPayload = {
  min?: number;
  max?: number;
};

export const emptyPriceRange = (): PriceRangeState => ({
  boundMin: 0,
  boundMax: 0,
  selectedMin: 0,
  selectedMax: 0,
});

export const isPriceRangeRestricted = (state: PriceRangeState) =>
  state.selectedMax !== state.boundMax || state.selectedMin !== state.boundMin;

export function toPriceFilterPayload(state: PriceRangeState): PriceFilterPayload {
  return {
    min: state.selectedMin === state.boundMin ? undefined : state.selectedMin,
    max: state.selectedMax === state.boundMax ? undefined : state.selectedMax,
  };
}

/**
 * Allinea i bordi dello slider alle statistiche arrivate dal CMS.
 *
 * Con `preserveBounds` (pannello mobile) i bordi del catalogo restano fermi
 * finché l'utente ha ristretto la fascia. Il CMS rimanda min/max dei soli
 * risultati già filtrati: se diventassero i nuovi bordi, la selezione
 * coinciderebbe con l'intera scala, il badge sparirebbe e l'applicazione
 * successiva invierebbe di nuovo "nessun filtro prezzo".
 */
export function syncPriceBounds(
  state: PriceRangeState,
  stats: { min: number; max: number } | null | undefined,
  options: { preserveBounds?: boolean } = {},
): PriceRangeState {
  if (!stats) return emptyPriceRange();

  const normalizedMin = Math.floor(stats.min ?? 0);
  const normalizedMax = Math.ceil(stats.max ?? 0);
  const safeMax = Math.max(normalizedMin, normalizedMax);
  const restricted = isPriceRangeRestricted(state);

  if (!options.preserveBounds || !restricted) {
    const selectedMin = Math.max(
      normalizedMin,
      Math.min(state.selectedMin || normalizedMin, safeMax),
    );
    const selectedMax = Math.min(
      safeMax,
      Math.max(state.selectedMax || safeMax, selectedMin),
    );
    return {
      boundMin: normalizedMin,
      boundMax: safeMax,
      selectedMin,
      selectedMax,
    };
  }

  const boundMin = Math.min(state.boundMin, normalizedMin);
  const boundMax = Math.max(state.boundMax, safeMax);
  const selectedMin = Math.min(Math.max(state.selectedMin, boundMin), boundMax);
  const selectedMax = Math.min(
    Math.max(state.selectedMax, selectedMin),
    boundMax,
  );

  return { boundMin, boundMax, selectedMin, selectedMax };
}

export function resetPriceRange(state: PriceRangeState): PriceRangeState {
  return {
    ...state,
    selectedMin: state.boundMin,
    selectedMax: state.boundMax,
  };
}

export function selectPriceRange(
  state: PriceRangeState,
  range: { low: number; high: number },
): PriceRangeState {
  return {
    ...state,
    selectedMin: range.low,
    selectedMax: range.high,
  };
}

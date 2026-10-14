/**
 * Paesi in cui si spedisce: l'Unione Europea. Stesso elenco del CMS
 * (`CHECKOUT_COUNTRIES`), che lo controlla di nuovo alla prenotazione.
 *
 * Solo i codici ISO: i nomi li dà `Intl.DisplayNames` nella lingua del sito,
 * così seguono il selettore di lingua senza un dizionario da mantenere.
 */
export const HOME_COUNTRY = "IT";

export const EU_COUNTRIES = [
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;

export const countryName = (code: string, locale = "it") => {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

/** Italia in cima, poi gli altri in ordine alfabetico nella lingua del sito. */
export const countryOptions = (locale = "it") => {
  const collator = new Intl.Collator(locale);
  return EU_COUNTRIES.map((code) => ({ code, name: countryName(code, locale) })).sort(
    (a, b) =>
      Number(b.code === HOME_COUNTRY) - Number(a.code === HOME_COUNTRY) ||
      collator.compare(a.name, b.name),
  );
};

/**
 * Le spedizioni nazionali (`international: false`, Poste) valgono solo per
 * l'Italia, quelle internazionali (UPS) solo per gli altri paesi UE. Il CMS
 * applica la stessa regola alla prenotazione.
 */
export const isShippingAvailableFor = (
  method: { international: boolean },
  country: string,
) => method.international === (country !== HOME_COUNTRY);

/** CAP: cinque cifre in Italia; altrove formati diversi (es. "1012 AB", "LV-1050"). */
export const POSTCODE_PATTERN = (country: string) =>
  country === HOME_COUNTRY ? /^\d{5}$/ : /^[A-Z0-9][A-Z0-9 -]{1,9}$/i;

/**
 * Partita IVA UE senza il prefisso del paese, che si toglie se c'è. La Grecia
 * usa "EL" invece del codice ISO "GR".
 */
export const stripVatPrefix = (vat: string, country: string) => {
  const prefix = country === "GR" ? "(EL|GR)" : country;
  return vat.replace(new RegExp(`^${prefix}`), "");
};

export const VAT_PATTERN = (country: string) =>
  country === HOME_COUNTRY ? /^[0-9]{11}$/ : /^[0-9A-Z]{2,13}$/;

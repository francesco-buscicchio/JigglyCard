/**
 * Palette notturna del sito, la stessa della home immersiva
 * (assets/css/immersive.scss).
 *
 * I nomi restano quelli di prima per non dover riscrivere ogni componente, ma
 * le scale chiare/scure sono girate per il fondo scuro:
 * - `accent-5…50`: superfici, dalla più profonda alla più rialzata;
 * - `accent-500`: il rosa del brand, per azioni e link (testo sopra: `accent-50`);
 * - `accent-950`: testo principale e titoli;
 * - `neutrals-50…950`: dal fondo al testo, cioè invertita rispetto al grigio
 *   classico (`neutrals-200` bordi, `neutrals-500` testo secondario).
 */
export const colors = {
  accent: {
    5: "#0B0E29",
    10: "#0E1131",
    20: "#111538",
    30: "#13183F",
    40: "#161B46",
    50: "#181D4D",
    500: "#EC91A0",
    950: "#F6F3FF",
  },
  primary: {
    10: "#FEFCFC",
    20: "#FEFBFB",
    30: "#FEF9FA",
    40: "#FEF8F9",
    50: "#FDF4F5",
    100: "#FCEEF0",
    200: "#FBE9EC",
    300: "#F9DDE2",
    400: "#F7D2D8",
    500: "#F4C2CA",
    600: "#EC91A0",
    700: "#E05168",
    800: "#C2223C",
    900: "#811728",
    950: "#410B14",
  },
  neutrals: {
    50: "#0C0F2B",
    100: "#13173A",
    200: "#1E2350",
    300: "#2C3266",
    400: "#555B92",
    500: "#9095C4",
    600: "#B0B4DC",
    700: "#CBCDEE",
    800: "#DFE0F8",
    900: "#EEEEFD",
    950: "#F8F7FF",
  },
};

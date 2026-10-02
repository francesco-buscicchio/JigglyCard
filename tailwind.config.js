import { colors } from "./config/tailwind/colors";
import spacing from "./config/tailwind/spacing";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./components/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./formkit.theme.ts",
    "./error.vue",
    "docs/content/**/*.md",
  ],
  theme: {
    extend: {
      colors: {
        accent: colors.accent,
        main: colors.primary,
        neutrals: colors.neutrals,
      },
      spacing: spacing,
      fontFamily: {
        // "Roboto" da solo non è fra i font caricati: i testi senza font
        // esplicito (bottoni, breadcrumb) ripiegavano su un serif di sistema.
        sans: ['"Roboto Flex"', "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

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
        sans: "Roboto",
      },
    },
  },
  plugins: [],
};

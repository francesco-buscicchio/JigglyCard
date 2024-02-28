import { colors } from "./config/tailwind/colors";
import spacing from "./config/tailwind/spacing";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: colors,
      spacing: spacing,
    },
  },
  plugins: [],
};

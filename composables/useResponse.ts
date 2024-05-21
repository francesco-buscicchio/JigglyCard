import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const isDesktop = () => useBreakpoints(breakpointsTailwind).greaterOrEqual("lg");

export const isMobile = () => useBreakpoints(breakpointsTailwind).smaller("lg");

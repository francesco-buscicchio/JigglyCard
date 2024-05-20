import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const isDesktop = () => {
  let isDesktop = () =>
    useBreakpoints(breakpointsTailwind).greaterOrEqual("lg");
  return isDesktop;
};

export const isMobile = () => {
  let isMobile = () => useBreakpoints(breakpointsTailwind).smaller("lg");
  return isMobile;
};

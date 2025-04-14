export const goTo = (path: string, options?: { external?: boolean }) => {
  return navigateTo(path, options);
};

export const goBack = () => {
  return navigateTo({ path: "back" });
};

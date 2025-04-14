export const formatProductName = (productName: string): string => {
  return productName.replace(/\s*\([^)]*\)/g, "");
};

export const extractProductCode = (productName: string): string | null => {
  const match = productName.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
};

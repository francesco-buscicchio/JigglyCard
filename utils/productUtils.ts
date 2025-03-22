export const formatProductName = (productName: string) :string => {
    return productName.replace(/\s*\([^)]*\)/g, "")
}
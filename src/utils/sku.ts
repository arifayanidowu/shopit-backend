// Generate SKU from product
export const generateSku = (product: any): string => {
  const { name } = product;
  const sku = `${name}-n${Math.floor(Math.random() * 1e9)
    .toString()
    .substring(0, 4)}`;
  return sku?.replace(/\s/g, '-')?.toLocaleUpperCase();
};

// Generate SKU from product
export const generateSku = (product: any): string => {
  const { name, color, gender, type, size } = product;
  const sku = `${name.substring(0, 2)}-${color.substring(
    0,
    2,
  )}-${gender.substring(0, 2)}-${type.substring(0, 2)}-${size.substring(
    0,
    2,
  )}-${Math.floor(Math.random() * 1e9)
    .toFixed(4)
    .slice(0, 4)}`;
  return sku?.toUpperCase();
};

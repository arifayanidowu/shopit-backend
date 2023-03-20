// Generate SKU from product
export const generateSku = (product: any): string => {
  const { name, color, description, size } = product;
  const sku = `${name.substring(0, 3)}-${color.substring(
    0,
    2,
  )}-${description.substring(0, 3)}-${size.substring(0, 3)}-n${Math.floor(
    Math.random() * 1e9,
  )
    .toString()
    .substring(0, 4)}`;
  return sku;
};

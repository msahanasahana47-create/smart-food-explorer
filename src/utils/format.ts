export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const prettify = (slug: string): string =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

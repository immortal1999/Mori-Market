export const stages = ['Confirmed', 'Processing', 'Label Created', 'Shipped', 'Delivered'];
export const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export function priceOrder(products, lines, method = 'standard') {
  if (!Array.isArray(lines) || !lines.length) throw new Error('Your cart is empty.');
  const items = lines.map(({productId, quantity}) => {
    const p = products.find(p => p.id === productId);
    if (!p || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Invalid cart item.');
    return { ...p, quantity, quote: p.price === null || p.review };
  });
  const subtotalCents = items.reduce((sum, p) => sum + (p.quote ? 0 : Math.round(p.price * 100) * p.quantity), 0);
  const delivery = method === 'express' ? 9.99 : 4.99;
  return {items, subtotal: subtotalCents / 100, delivery, total: (subtotalCents + Math.round(delivery * 100)) / 100};
}

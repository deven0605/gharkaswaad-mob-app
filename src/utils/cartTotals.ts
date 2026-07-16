import { CartLineItem } from '../store/cartSlice';

export const DELIVERY_CHARGE = 30;
export const GST_RATE = 0.05;

export function lineTotal(item: CartLineItem): number {
  const addOnsTotal = item.addOns.reduce((sum, a) => sum + a.price * a.qty, 0);
  return (item.basePrice + addOnsTotal) * item.quantity;
}

export interface CartTotals {
  subtotal: number;
  delivery: number;
  gst: number;
  discount: number;
  grandTotal: number;
}

export function computeCartTotals(items: CartLineItem[], discount = 0): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const delivery = items.length > 0 ? DELIVERY_CHARGE : 0;
  const gst = Math.ceil(subtotal * GST_RATE);
  const grandTotal = Math.max(0, subtotal + delivery + gst - discount);
  return { subtotal, delivery, gst, discount, grandTotal };
}

// "Standard Thali ×2" for a single line item, "Standard + Mini" for several.
export function summarizeItems(items: CartLineItem[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) {
    return `${items[0].name} ×${items[0].quantity}`;
  }
  return items.map(item => item.name.replace(/\s*Thali$/i, '')).join(' + ');
}

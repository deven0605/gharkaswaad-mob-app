import { CartLineItem } from '../store/cartSlice';
import { createLogger } from './logger';

const log = createLogger('src/utils/cartTotals.ts');

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
  log.info('computeCartTotals', 'start', { itemCount: items.length, discount });
  try {
    const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
    const delivery = items.length > 0 ? DELIVERY_CHARGE : 0;
    const gst = Math.ceil(subtotal * GST_RATE);
    const grandTotal = Math.max(0, subtotal + delivery + gst - discount);
    const totals = { subtotal, delivery, gst, discount, grandTotal };
    log.info('computeCartTotals', 'end', totals);
    return totals;
  } catch (err) {
    log.error('computeCartTotals', 'failed to compute cart totals', { itemCount: items.length, discount }, err);
    throw err;
  }
}

// "Standard Thali ×2" for a single line item, "Standard + Mini" for several.
export function summarizeItems(items: CartLineItem[]): string {
  log.info('summarizeItems', 'start', { itemCount: items.length });
  try {
    if (items.length === 0) {
      log.info('summarizeItems', 'end (empty)');
      return '';
    }
    if (items.length === 1) {
      const summary = `${items[0].name} ×${items[0].quantity}`;
      log.info('summarizeItems', 'end', { summary });
      return summary;
    }
    const summary = items.map(item => item.name.replace(/\s*Thali$/i, '')).join(' + ');
    log.info('summarizeItems', 'end', { summary });
    return summary;
  } catch (err) {
    log.error('summarizeItems', 'failed to summarize items', { itemCount: items.length }, err);
    throw err;
  }
}

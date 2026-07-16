// Central registry for checkout payment methods (S15 Place Order — customer_app_specification.md
// §6 "Live Payment Gateway... mock Place Order in Phase 1"). Only Cash on Delivery is enabled
// today; wiring up a new gateway later means flipping `enabled` (and building that method's
// handoff) here — PlaceOrderScreen and orderApi don't change.

export type PaymentMethodKey = 'upi' | 'card' | 'netbanking' | 'cod';

// order-service's PaymentMethod enum (customer_app_specification.md §8 Order model)
export type PaymentMethodApiCode = 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface PaymentMethodOption {
  key: PaymentMethodKey;
  label: string;
  apiCode: PaymentMethodApiCode;
  enabled: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { key: 'upi', label: 'UPI', apiCode: 'UPI', enabled: false },
  { key: 'card', label: 'Credit/Debit', apiCode: 'CARD', enabled: false },
  { key: 'netbanking', label: 'Net Banking', apiCode: 'NETBANKING', enabled: false },
  { key: 'cod', label: 'Cash on Delivery', apiCode: 'COD', enabled: true },
];

export const DEFAULT_PAYMENT_METHOD: PaymentMethodKey = 'cod';

export function getPaymentMethod(key: PaymentMethodKey): PaymentMethodOption | undefined {
  return PAYMENT_METHODS.find(m => m.key === key);
}

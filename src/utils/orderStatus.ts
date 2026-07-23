export type OrderStatusKey =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'outForDelivery'
  | 'delivered';

export interface OrderStep {
  key: OrderStatusKey;
  label: string;
  atSeconds: number;
  minuteOffset: number;
}

// No order-tracking backend exists (no persisted order, no delivery-partner
// service, no live status feed). Status is derived from real elapsed time
// since the order was placed, against these fixed thresholds — compressed to
// under a minute so the app visibly progresses within a session, while the
// clock times shown to the user (placedAt + minuteOffset) still read as
// plausible order timestamps. Shared by OrderTrackingScreen and OrdersScreen
// so they never disagree about an order's current status.
export const ORDER_STEPS: OrderStep[] = [
  { key: 'placed', label: 'Order Placed', atSeconds: 0, minuteOffset: 0 },
  { key: 'accepted', label: 'Kitchen Accepted', atSeconds: 3, minuteOffset: 2 },
  { key: 'preparing', label: 'Preparing Food', atSeconds: 6, minuteOffset: 3 },
  { key: 'ready', label: 'Ready for Pickup', atSeconds: 10, minuteOffset: 18 },
  { key: 'assigned', label: 'Partner Assigned', atSeconds: 13, minuteOffset: 19 },
  { key: 'outForDelivery', label: 'Out for Delivery', atSeconds: 16, minuteOffset: 19 },
  { key: 'delivered', label: 'Delivered', atSeconds: 46, minuteOffset: 31 },
];

export const OUT_FOR_DELIVERY_INDEX = ORDER_STEPS.findIndex(s => s.key === 'outForDelivery');
export const DELIVERED_INDEX = ORDER_STEPS.findIndex(s => s.key === 'delivered');

export function getElapsedSeconds(placedAt: string, nowMs: number = Date.now()): number {
  return Math.max(0, (nowMs - new Date(placedAt).getTime()) / 1000);
}

export function getActiveStepIndex(elapsedSeconds: number): number {
  let idx = 0;
  ORDER_STEPS.forEach((step, i) => {
    if (elapsedSeconds >= step.atSeconds) idx = i;
  });
  return idx;
}

export function isOrderActive(placedAt: string, nowMs?: number): boolean {
  return getActiveStepIndex(getElapsedSeconds(placedAt, nowMs)) < DELIVERED_INDEX;
}

// Maps order-service's real OrderStatusCode (see orderApi.ts) onto an
// ORDER_STEPS index, so a polled real status can drive the same timeline UI
// that used to be purely simulated. There's no distinct backend status for
// "Partner Assigned" — DISPATCHED covers both "assigned" and "out for
// delivery" — so it maps straight to the outForDelivery step, which also
// retroactively marks "assigned" done (isDone = index < activeIndex).
// REJECTED has no timeline position (returns -1); callers should check for
// it separately and show a rejection state instead of the timeline.
export function backendStatusToStepIndex(
  status: 'PENDING' | 'KITCHEN_ACCEPTED' | 'PREPARING' | 'READY' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED',
): number {
  switch (status) {
    case 'PENDING':
      return ORDER_STEPS.findIndex(s => s.key === 'placed');
    case 'KITCHEN_ACCEPTED':
      return ORDER_STEPS.findIndex(s => s.key === 'accepted');
    case 'PREPARING':
      return ORDER_STEPS.findIndex(s => s.key === 'preparing');
    case 'READY':
      return ORDER_STEPS.findIndex(s => s.key === 'ready');
    case 'DISPATCHED':
      return OUT_FOR_DELIVERY_INDEX;
    case 'DELIVERED':
      return DELIVERED_INDEX;
    case 'REJECTED':
      return -1;
  }
}

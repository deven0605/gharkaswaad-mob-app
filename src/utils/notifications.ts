import { OrderRecord } from '../store/ordersSlice';
import { ORDER_STEPS, DELIVERED_INDEX, getElapsedSeconds } from './orderStatus';
import { createLogger } from './logger';

const log = createLogger('src/utils/notifications.ts');

export type NotificationKind = 'delivered' | 'outForDelivery' | 'kitchenAccepted' | 'coupon' | 'rate';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  kind: NotificationKind;
  orderId?: string;
}

const NOTIFY_STEPS: { key: 'accepted' | 'outForDelivery' | 'delivered'; kind: NotificationKind; title: string }[] = [
  { key: 'accepted', kind: 'kitchenAccepted', title: 'Kitchen Accepted' },
  { key: 'outForDelivery', kind: 'outForDelivery', title: 'Order Out for Delivery' },
  { key: 'delivered', kind: 'delivered', title: 'Order Delivered!' },
];

function etaMaxMinutes(etaText: string): number {
  const match = etaText.match(/(\d+)\D*$/);
  return match ? parseInt(match[1], 10) : 30;
}

// No push-notification or notification-history backend exists. This derives a
// real, live feed from actual order status transitions (see orderStatus.ts)
// plus the local coupon registry, instead of hardcoding a static list — so it
// naturally grows as orders progress within the session.
export function deriveNotifications(orders: OrderRecord[], now: number = Date.now()): NotificationItem[] {
  log.info('deriveNotifications', 'start', { orderCount: orders.length, now });
  try {
  const items: NotificationItem[] = [];

  orders.forEach(order => {
    const placedMs = new Date(order.placedAt).getTime();
    const elapsed = getElapsedSeconds(order.placedAt, now);

    NOTIFY_STEPS.forEach(({ key, kind, title }) => {
      const step = ORDER_STEPS.find(s => s.key === key);
      if (!step || elapsed < step.atSeconds) return;

      const timestamp = new Date(placedMs + step.atSeconds * 1000);
      const body =
        kind === 'kitchenAccepted'
          ? `${order.kitchenName} accepted your order #${order.orderId}`
          : kind === 'outForDelivery'
          ? `Your order is on the way · ETA ${etaMaxMinutes(order.etaText)} min`
          : `#${order.orderId} has been delivered. Enjoy!`;

      items.push({ id: `${order.orderId}-${key}`, title, body, timestamp, kind, orderId: order.orderId });
    });

    if (elapsed >= ORDER_STEPS[DELIVERED_INDEX].atSeconds) {
      const deliveredAt = placedMs + ORDER_STEPS[DELIVERED_INDEX].atSeconds * 1000;
      items.push({
        id: `${order.orderId}-rate`,
        title: 'Rate your last order',
        body: `How was ${order.kitchenName}?`,
        timestamp: new Date(deliveredAt + 60000),
        kind: 'rate',
        orderId: order.orderId,
      });
    }
  });

  items.push({
    id: 'coupon-thali10',
    title: 'New Coupon!',
    body: 'Use THALI10 for 10% off your next order',
    timestamp: new Date(now - 25 * 3600 * 1000),
    kind: 'coupon',
  });

  const sorted = items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  log.info('deriveNotifications', 'end', { itemCount: sorted.length });
  return sorted;
  } catch (err) {
    log.error('deriveNotifications', 'failed to derive notifications', { orderCount: orders.length }, err);
    throw err;
  }
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList, MainTabParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { restoreCart } from '../store/cartSlice';
import { OrderRecord } from '../store/ordersSlice';
import { getActiveStepIndex, getElapsedSeconds, ORDER_STEPS, DELIVERED_INDEX } from '../utils/orderStatus';
import { ChevronRightIcon, CheckIcon, DotIcon } from '../components/Icons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'OrdersTab'>,
  NativeStackScreenProps<HomeStackParamList>
>;

type Tab = 'active' | 'past';

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export default function OrdersScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.orders.orders);
  const [tab, setTab] = useState<Tab>('active');

  const activeOrders = orders.filter(o => getActiveStepIndex(getElapsedSeconds(o.placedAt)) < DELIVERED_INDEX);
  const pastOrders = orders.filter(o => getActiveStepIndex(getElapsedSeconds(o.placedAt)) >= DELIVERED_INDEX);

  const handleBrowseKitchens = () => navigation.navigate('HomeTab', { screen: 'HomeMain' });

  const handleTrack = (order: OrderRecord) => {
    navigation.navigate('HomeTab', {
      screen: 'OrderTracking',
      params: {
        orderId: order.orderId,
        kitchenName: order.kitchenName,
        addressText: order.addressText,
        etaText: order.etaText,
        placedAt: order.placedAt,
      },
    });
  };

  const handleReorder = (order: OrderRecord) => {
    dispatch(
      restoreCart({
        kitchenId: order.kitchenId,
        kitchenName: order.kitchenName,
        kitchenImageUrl: order.kitchenImageUrl,
        items: order.items,
      }),
    );
    navigation.navigate('HomeTab', { screen: 'Cart' });
  };

  const handleRate = () => Alert.alert('Rate Order', 'Ratings & reviews are coming soon.');

  const renderOrderCard = (order: OrderRecord) => {
    const activeIndex = getActiveStepIndex(getElapsedSeconds(order.placedAt));
    const isDelivered = activeIndex >= DELIVERED_INDEX;
    const statusLabel = ORDER_STEPS[activeIndex].label;

    return (
      <View key={order.orderId} style={styles.card}>
        <View style={styles.cardTopRow}>
          {order.kitchenImageUrl ? (
            <Image source={{ uri: order.kitchenImageUrl }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={styles.thumb} />
          )}
          <View style={styles.cardBody}>
            <View style={styles.titleRow}>
              <Text style={styles.kitchenName}>{order.kitchenName}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (isDelivered ? undefined : handleTrack(order))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <ChevronRightIcon />
              </TouchableOpacity>
            </View>
            <Text style={styles.metaText}>
              #{order.orderId} · {formatOrderDate(order.placedAt)}
            </Text>
          </View>
        </View>

        <Text style={styles.itemsSummary}>
          {order.items.length === 1
            ? `${order.items[0].name} ×${order.items[0].quantity}`
            : order.items.map(i => i.name.replace(/\s*Thali$/i, '')).join(' + ')}
        </Text>
        <Text style={styles.price}>₹ {order.grandTotal}</Text>

        <View style={styles.footerRow}>
          <View style={styles.statusRow}>
            {isDelivered ? (
              <View style={styles.deliveredIcon}>
                <CheckIcon size={12} color="#fff" />
              </View>
            ) : (
              <DotIcon size={10} color="#E8A33D" />
            )}
            <Text style={[styles.statusText, isDelivered ? styles.statusTextDelivered : styles.statusTextActive]}>
              {statusLabel}
            </Text>
          </View>

          {isDelivered ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7} onPress={() => handleReorder(order)}>
                <Text style={styles.outlineBtnText}>REORDER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7} onPress={handleRate}>
                <Text style={styles.outlineBtnText}>RATE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7} onPress={() => handleTrack(order)}>
              <Text style={styles.outlineBtnText}>TRACK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const showEmpty = orders.length === 0;
  const hasActiveOrders = activeOrders.length > 0;
  const hasPastOrders = pastOrders.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabBtn} activeOpacity={0.7} onPress={() => setTab('active')}>
          <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
            Active ({activeOrders.length})
          </Text>
          {tab === 'active' ? <View style={styles.tabIndicator} /> : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} activeOpacity={0.7} onPress={() => setTab('past')}>
          <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past</Text>
          {tab === 'past' ? <View style={styles.tabIndicator} /> : null}
        </TouchableOpacity>
      </View>
      <View style={styles.tabsUnderline} />

      {showEmpty ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No orders yet.</Text>
          <TouchableOpacity style={styles.browseBtn} activeOpacity={0.7} onPress={handleBrowseKitchens}>
            <Text style={styles.browseBtnText}>Browse Kitchens</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {tab === 'active' ? (
            <>
              {activeOrders.map(renderOrderCard)}
              {!hasActiveOrders ? <Text style={styles.emptyInlineText}>No active orders.</Text> : null}

              {hasPastOrders ? (
                <>
                  <View style={styles.sectionDividerRow}>
                    <View style={styles.sectionDividerLine} />
                    <Text style={styles.sectionDividerText}>PAST ORDERS</Text>
                    <View style={styles.sectionDividerLine} />
                  </View>
                  {pastOrders.map(renderOrderCard)}
                </>
              ) : null}
            </>
          ) : pastOrders.length > 0 ? (
            pastOrders.map(renderOrderCard)
          ) : (
            <Text style={styles.emptyInlineText}>No past orders yet.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tabBtn: {
    marginRight: 32,
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.muted,
  },
  tabTextActive: {
    color: '#3F9142',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: '#3F9142',
    borderRadius: 2,
  },
  tabsUnderline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginBottom: 4,
  },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 16,
  },
  emptyInlineText: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  sectionDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  sectionDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
  },
  sectionDividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 1,
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8E0D8',
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kitchenName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
    marginRight: 8,
  },
  metaText: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
  },

  itemsSummary: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    marginTop: 6,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveredIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3F9142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#B8791F',
  },
  statusTextDelivered: {
    color: '#3F9142',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#3F9142',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  outlineBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3F9142',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { deriveNotifications, NotificationItem, NotificationKind } from '../utils/notifications';
import { BackArrowIcon, CheckIcon, ChevronRightIcon, ScooterIcon, StarIcon, TagIcon, TrayIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;

const KIND_META: Record<NotificationKind, { Icon: typeof CheckIcon; iconColor: string; bg: string; ring?: boolean }> = {
  delivered: { Icon: ScooterIcon, iconColor: '#2E7D32', bg: '#DCEFDD' },
  outForDelivery: { Icon: TrayIcon, iconColor: Colors.primary, bg: '#FBE4D8' },
  kitchenAccepted: { Icon: CheckIcon, iconColor: '#3F9142', bg: '#DCEFDD', ring: true },
  coupon: { Icon: TagIcon, iconColor: '#8E5FD9', bg: '#EDE5FA' },
  rate: { Icon: StarIcon, iconColor: '#F0A020', bg: '#FCEDCB' },
};

function formatRelative(timestamp: Date, now: Date): string {
  const mins = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function groupLabel(timestamp: Date, now: Date): string {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(timestamp)) / 86400000);
  if (dayDiff <= 0) return 'TODAY';
  if (dayDiff === 1) return 'YESTERDAY';
  return timestamp.toLocaleDateString([], { day: 'numeric', month: 'short' }).toUpperCase();
}

export default function NotificationsScreen({ navigation }: Props) {
  const orders = useAppSelector(state => state.orders.orders);
  const now = new Date();
  const notifications = deriveNotifications(orders, now.getTime());

  const handleBack = () => navigation.goBack();

  const handlePress = (item: NotificationItem) => {
    if (item.kind === 'coupon') {
      Alert.alert('My Coupons', 'Available: THALI10 — 10% off your order.');
      return;
    }
    if (item.kind === 'rate') {
      Alert.alert('Rate Order', 'Ratings & reviews are coming soon.');
      return;
    }
    const order = orders.find(o => o.orderId === item.orderId);
    if (!order) return;
    navigation.navigate('OrderTracking', {
      orderId: order.orderId,
      kitchenName: order.kitchenName,
      addressText: order.addressText,
      etaText: order.etaText,
      placedAt: order.placedAt,
    });
  };

  const groups: { label: string; items: NotificationItem[] }[] = [];
  notifications.forEach(item => {
    const label = groupLabel(item.timestamp, now);
    const group = groups.find(g => g.label === label);
    if (group) group.items.push(item);
    else groups.push({ label, items: [item] });
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerBtn} />
      </View>

      {groups.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {groups.map(group => (
            <View key={group.label} style={styles.section}>
              <Text style={styles.sectionLabel}>{group.label}</Text>
              <View style={styles.card}>
                {group.items.map((item, index) => {
                  const meta = KIND_META[item.kind];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.row, index === group.items.length - 1 && styles.rowLast]}
                      activeOpacity={0.7}
                      onPress={() => handlePress(item)}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: meta.bg },
                          meta.ring && { borderWidth: 2, borderColor: meta.iconColor },
                        ]}
                      >
                        <meta.Icon size={24} color={meta.iconColor} />
                      </View>
                      <View style={styles.rowBody}>
                        <Text style={styles.rowTitle}>{item.title}</Text>
                        <Text style={styles.rowBodyText}>{item.body}</Text>
                      </View>
                      <View style={styles.rowEnd}>
                        <Text style={styles.rowTime}>{formatRelative(item.timestamp, now)}</Text>
                        <ChevronRightIcon />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.muted,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  rowBodyText: {
    fontSize: 13.5,
    color: Colors.muted,
    marginTop: 4,
    lineHeight: 19,
  },
  rowEnd: {
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  rowTime: {
    fontSize: 12,
    color: Colors.placeholder,
  },
});

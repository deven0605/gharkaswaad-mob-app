import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useGetLocationQuery } from '../services/customerApi';
import { useGetOrderStatusQuery } from '../services/orderApi';
import {
  ORDER_STEPS,
  OUT_FOR_DELIVERY_INDEX,
  DELIVERED_INDEX,
  getElapsedSeconds,
  getActiveStepIndex,
  backendStatusToStepIndex,
} from '../utils/orderStatus';
import { BackArrowIcon, CheckIcon, ChatIcon, PhoneIcon, ScooterIcon, UtensilsIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderTracking'>;

const RIDER_NAME = 'Ravi';
const RIDER_PHONE = 'tel:+911234567890';
const DEFAULT_COORD = { latitude: 28.5245, longitude: 77.2066 };
const KITCHEN_OFFSET = { latitude: -0.006, longitude: -0.0045 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function formatStepTime(placedAt: Date, minuteOffset: number): string {
  return new Date(placedAt.getTime() + minuteOffset * 60000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function RiderAvatar() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={32} fill="#DCEFDD" />
      <Circle cx={32} cy={26} r={11} fill="#E5B48C" />
      <Ellipse cx={32} cy={54} rx={18} ry={14} fill="#3F9142" />
    </Svg>
  );
}

export default function OrderTrackingScreen({ navigation, route }: Props) {
  const { orderId, kitchenName, addressText, etaText, placedAt } = route.params;
  const placedAtDate = new Date(placedAt);

  const { data: location } = useGetLocationQuery();
  const customerCoord = location
    ? { latitude: location.latitude, longitude: location.longitude }
    : DEFAULT_COORD;
  const kitchenCoord = {
    latitude: customerCoord.latitude + KITCHEN_OFFSET.latitude,
    longitude: customerCoord.longitude + KITCHEN_OFFSET.longitude,
  };

  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Polls order-service's real status (vendor accept/reject, delivery-partner
  // pickup/delivery OTP) instead of relying solely on the elapsed-time
  // simulation. Falls back to the simulation if the poll hasn't returned yet
  // or the request fails — same "degrade gracefully" spirit used elsewhere
  // in this workspace's best-effort integrations.
  const { data: orderStatus } = useGetOrderStatusQuery(orderId, { pollingInterval: 10000 });

  const elapsed = getElapsedSeconds(placedAt);
  const isRejected = orderStatus?.status === 'REJECTED';
  const activeIndex =
    orderStatus && !isRejected ? backendStatusToStepIndex(orderStatus.status) : getActiveStepIndex(elapsed);

  const transitProgress = Math.min(
    1,
    Math.max(
      0,
      (elapsed - ORDER_STEPS[OUT_FOR_DELIVERY_INDEX].atSeconds) /
        (ORDER_STEPS[DELIVERED_INDEX].atSeconds - ORDER_STEPS[OUT_FOR_DELIVERY_INDEX].atSeconds),
    ),
  );
  const riderVisible = activeIndex >= OUT_FOR_DELIVERY_INDEX;
  const riderCoord = riderVisible
    ? {
        latitude: lerp(kitchenCoord.latitude, customerCoord.latitude, transitProgress),
        longitude: lerp(kitchenCoord.longitude, customerCoord.longitude, transitProgress),
      }
    : kitchenCoord;

  const etaMaxMinutes = (() => {
    const match = etaText.match(/(\d+)\D*$/);
    return match ? parseInt(match[1], 10) : 30;
  })();
  const minutesRemaining = Math.max(1, Math.round(etaMaxMinutes * (1 - transitProgress)));

  const statusHeading =
    activeIndex >= DELIVERED_INDEX
      ? 'Order Delivered!'
      : activeIndex >= OUT_FOR_DELIVERY_INDEX
      ? `${RIDER_NAME} is on the way!`
      : activeIndex >= ORDER_STEPS.findIndex(s => s.key === 'assigned')
      ? `${RIDER_NAME} is heading to the kitchen`
      : 'Your order is being prepared';
  const statusSub =
    activeIndex >= DELIVERED_INDEX
      ? `Delivered at ${formatStepTime(placedAtDate, ORDER_STEPS[DELIVERED_INDEX].minuteOffset)}`
      : activeIndex >= OUT_FOR_DELIVERY_INDEX
      ? `Arriving in ~${minutesRemaining} min`
      : `Estimated: ${etaText}`;

  const handleBack = () => navigation.goBack();
  const handleCall = () => Linking.openURL(RIDER_PHONE);
  const handleChat = () => Alert.alert('Chat', 'Chat with your delivery partner is coming soon.');

  const region = {
    latitude: (kitchenCoord.latitude + customerCoord.latitude) / 2,
    longitude: (kitchenCoord.longitude + customerCoord.longitude) / 2,
    latitudeDelta: Math.abs(kitchenCoord.latitude - customerCoord.latitude) * 2.5 + 0.01,
    longitudeDelta: Math.abs(kitchenCoord.longitude - customerCoord.longitude) * 2.5 + 0.01,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderId}</Text>
        <View style={styles.headerBtn} />
      </View>

      {isRejected ? (
        <View style={styles.rejectedBox}>
          <Text style={styles.rejectedHeading}>Order Rejected</Text>
          <Text style={styles.rejectedSub}>
            {orderStatus?.rejectionReason || 'The kitchen was unable to accept this order.'}
          </Text>
        </View>
      ) : (
      <>
      <View style={styles.mapBox}>
        <MapView style={styles.map} region={region}>
          <Marker coordinate={kitchenCoord} title={kitchenName} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.kitchenMarker}>
              <UtensilsIcon size={16} />
            </View>
          </Marker>

          <Marker coordinate={customerCoord} title={addressText} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.destMarker} />
          </Marker>

          {riderVisible ? (
            <>
              <Polyline
                coordinates={[kitchenCoord, riderCoord]}
                strokeColor="#3F9142"
                strokeWidth={3}
                lineDashPattern={[8, 6]}
              />
              <Marker coordinate={riderCoord} title={RIDER_NAME} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.riderMarker}>
                  <ScooterIcon size={20} color="#3F9142" />
                </View>
              </Marker>
            </>
          ) : null}
        </MapView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <RiderAvatar />
          <View style={styles.statusBody}>
            <Text style={styles.statusHeading}>{statusHeading}</Text>
            <Text style={styles.statusSub}>{statusSub}</Text>
          </View>
          <TouchableOpacity style={styles.callCircle} activeOpacity={0.7} onPress={handleCall}>
            <PhoneIcon size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          {ORDER_STEPS.map((step, index) => {
            const isDone = index < activeIndex || (index === activeIndex && index === DELIVERED_INDEX);
            const isActive = index === activeIndex && index !== DELIVERED_INDEX;
            const isPending = index > activeIndex;

            return (
              <View
                key={step.key}
                style={[styles.timelineRow, isActive && styles.timelineRowActive]}
              >
                <View style={styles.timelineIconCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isActive && styles.stepCircleActive,
                    ]}
                  >
                    {isActive ? <View style={styles.stepDot} /> : null}
                    {isDone ? <CheckIcon size={16} color="#fff" /> : null}
                  </View>
                  {index < ORDER_STEPS.length - 1 ? (
                    <View style={[styles.stepLine, index < activeIndex && styles.stepLineDone]} />
                  ) : null}
                </View>

                <View style={styles.timelineBody}>
                  <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
                  <Text style={styles.stepTime}>
                    {isPending ? 'Pending' : formatStepTime(placedAtDate, step.minuteOffset)}
                  </Text>
                </View>

                {isDone ? (
                  <CheckIcon size={16} />
                ) : isActive ? (
                  <Text style={styles.nowText}>← NOW</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={handleCall}>
          <PhoneIcon size={18} />
          <Text style={styles.actionBtnText}>Call {RIDER_NAME}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={handleChat}>
          <ChatIcon size={18} />
          <Text style={styles.actionBtnText}>Chat</Text>
        </TouchableOpacity>
      </View>
      </>
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },

  rejectedBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  rejectedHeading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 8,
  },
  rejectedSub: {
    fontSize: 14.5,
    color: Colors.muted,
    textAlign: 'center',
  },

  mapBox: {
    height: 300,
  },
  map: {
    flex: 1,
  },
  kitchenMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  destMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.dark,
    borderWidth: 2,
    borderColor: '#fff',
  },
  riderMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3F9142',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: 8,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  statusBody: {
    flex: 1,
  },
  statusHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },
  statusSub: {
    fontSize: 14,
    color: '#3F9142',
    fontWeight: '600',
    marginTop: 4,
  },
  callCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4F3E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timelineCard: {
    padding: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineRowActive: {
    backgroundColor: '#E4F3E5',
    borderRadius: 10,
    marginVertical: 4,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 40,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  stepCircleDone: {
    backgroundColor: '#3F9142',
    borderColor: '#3F9142',
  },
  stepCircleActive: {
    borderColor: '#3F9142',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3F9142',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: Colors.line,
    marginVertical: 2,
  },
  stepLineDone: {
    backgroundColor: '#3F9142',
  },
  timelineBody: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 4,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  stepLabelActive: {
    color: '#2E7D32',
  },
  stepTime: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  nowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
    alignSelf: 'center',
    marginRight: 6,
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.line,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#3F9142',
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#3F9142',
  },
});

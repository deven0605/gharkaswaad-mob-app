import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { addressLabelMeta } from '../utils/addressLabels';
import { BagIcon, CheckIcon, ClockIcon, MapPinIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderPlaced'>;

const CONFETTI: { top: number; left: number; size: number; color: string; rotate?: string; round?: boolean }[] = [
  { top: 8, left: 42, size: 6, color: '#3F9142', round: true },
  { top: 22, left: 172, size: 5, color: '#D4561E', rotate: '20deg' },
  { top: 64, left: 6, size: 6, color: '#2C5C9E', round: true },
  { top: 4, left: 118, size: 5, color: '#C0392B', rotate: '-15deg' },
  { top: 96, left: 208, size: 7, color: '#D98BC0', round: true },
  { top: 156, left: 214, size: 5, color: '#D4561E', rotate: '30deg' },
  { top: 198, left: 22, size: 6, color: '#3F9142', round: true },
  { top: 176, left: 0, size: 5, color: '#2C5C9E', rotate: '10deg' },
  { top: 0, left: 88, size: 5, color: '#C4A882', round: true },
  { top: 214, left: 108, size: 5, color: '#D4561E', round: true },
];

export default function OrderPlacedScreen({ navigation, route }: Props) {
  const { orderId, kitchenName, kitchenImageUrl, itemsSummary, addressLabel, addressText, etaText, placedAt } =
    route.params;
  const addressMeta = addressLabelMeta(addressLabel);

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', { orderId, kitchenName, addressText, etaText, placedAt });
  };
  const handleContinueShopping = () => navigation.navigate('HomeMain');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.celebrationWrap} pointerEvents="none">
          {CONFETTI.map((piece, index) => (
            <View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  top: piece.top,
                  left: piece.left,
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  borderRadius: piece.round ? piece.size / 2 : 2,
                  transform: piece.rotate ? [{ rotate: piece.rotate }] : undefined,
                },
              ]}
            />
          ))}
          <View style={styles.halo}>
            <View style={styles.checkCircle}>
              <CheckIcon size={48} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Order Placed! 🎉</Text>
        <Text style={styles.orderIdText}>
          Order ID: <Text style={styles.orderIdValue}>#{orderId}</Text>
        </Text>

        <View style={styles.card}>
          <View style={styles.kitchenRow}>
            {kitchenImageUrl ? (
              <Image source={{ uri: kitchenImageUrl }} style={styles.kitchenAvatar} contentFit="cover" />
            ) : (
              <View style={styles.kitchenAvatar} />
            )}
            <View style={styles.kitchenBody}>
              <Text style={styles.kitchenName}>{kitchenName}</Text>
              <Text style={styles.itemsSummary}>{itemsSummary}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: addressMeta.bg }]}>
              <addressMeta.Icon size={20} color={addressMeta.iconColor} />
            </View>
            <Text style={styles.addressText}>{addressText}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: '#E4F3E5' }]}>
              <ClockIcon size={20} color="#3F9142" />
            </View>
            <View>
              <Text style={styles.etaLabel}>Estimated Delivery Time</Text>
              <Text style={styles.etaValue}>{etaText}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.trackBtn} activeOpacity={0.85} onPress={handleTrackOrder}>
          <MapPinIcon size={18} color="#fff" />
          <Text style={styles.trackBtnText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.7} onPress={handleContinueShopping}>
          <BagIcon size={18} />
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 32,
  },

  celebrationWrap: {
    width: 230,
    height: 230,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confettiPiece: {
    position: 'absolute',
  },
  halo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#DCEFDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 12,
  },
  orderIdText: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  orderIdValue: {
    color: '#2E7D32',
    fontWeight: '700',
  },

  card: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  kitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  kitchenAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8E0D8',
  },
  kitchenBody: {
    flex: 1,
  },
  kitchenName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },
  itemsSummary: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    flex: 1,
    fontSize: 14.5,
    color: Colors.dark,
    lineHeight: 21,
  },
  etaLabel: {
    fontSize: 13.5,
    color: Colors.muted,
  },
  etaValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 2,
  },

  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
  },
  continueBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

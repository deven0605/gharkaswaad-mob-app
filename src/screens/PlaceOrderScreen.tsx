import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/ordersSlice';
import { computeCartTotals, lineTotal, summarizeItems } from '../utils/cartTotals';
import { addressLabelDisplayName, addressLabelMeta, formatAddress } from '../utils/addressLabels';
import { useGetAddressesQuery, useGetLocationQuery } from '../services/customerApi';
import { useGetKitchenDetailsQuery } from '../services/kitchenApi';
import { usePlaceOrderMutation } from '../services/orderApi';
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD, PaymentMethodKey, getPaymentMethod } from '../config/paymentMethods';
import { BackArrowIcon, CheckIcon, ClockIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'PlaceOrder'>;

export default function PlaceOrderScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  const [payment, setPayment] = useState<PaymentMethodKey>(DEFAULT_PAYMENT_METHOD);
  const [orderError, setOrderError] = useState('');
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

  // currentLocation drives kitchen distance/ETA (M2/M3); the saved delivery
  // address (M6) is a separate concept and is what's actually shown/used below.
  const { data: currentLocation } = useGetLocationQuery();
  const { data: addresses } = useGetAddressesQuery();
  const { data: kitchen } = useGetKitchenDetailsQuery(
    cart.kitchenId && currentLocation
      ? { id: cart.kitchenId, lat: currentLocation.latitude, lng: currentLocation.longitude }
      : skipToken,
  );

  const matchedAddress = addresses?.find(a => a.defaultAddress) ?? addresses?.[0];
  const addressMeta = addressLabelMeta(matchedAddress?.label);
  const addressLabel = addressLabelDisplayName(matchedAddress?.label);
  const addressText = matchedAddress ? formatAddress(matchedAddress) : 'No delivery address set. Please add one.';
  const deliveryLat = matchedAddress?.lat;
  const deliveryLng = matchedAddress?.lng;
  const hasDeliveryAddress = !!matchedAddress && deliveryLat != null && deliveryLng != null;

  const etaText = kitchen ? `${kitchen.etaMinMinutes}–${kitchen.etaMaxMinutes} min` : '25–35 min';

  const totals = computeCartTotals(cart.items, cart.coupon?.discount ?? 0);

  const handleBack = () => navigation.goBack();
  const handleChangeAddress = () => navigation.navigate('SelectAddress');

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    const selectedMethod = getPaymentMethod(payment);
    if (!selectedMethod?.enabled) {
      setOrderError('This payment method is coming soon — please select Cash on Delivery.');
      return;
    }
    if (!hasDeliveryAddress || !cart.kitchenId) {
      setOrderError('Please set a delivery address to continue.');
      return;
    }
    setOrderError('');

    const result = await placeOrder({
      kitchenId: cart.kitchenId,
      items: cart.items,
      deliveryAddress: {
        label: addressLabel,
        fullAddress: addressText,
        latitude: deliveryLat!,
        longitude: deliveryLng!,
      },
      paymentMethod: selectedMethod.apiCode,
      couponCode: cart.coupon?.code,
      discount: cart.coupon?.discount,
    });

    if ('error' in result) {
      setOrderError('Could not place your order. Please check your connection and try again.');
      return;
    }

    const placedOrder = result.data;
    const itemsSummary = summarizeItems(cart.items);

    dispatch(
      addOrder({
        orderId: placedOrder.orderId,
        kitchenId: cart.kitchenId,
        kitchenName: cart.kitchenName,
        kitchenImageUrl: cart.kitchenImageUrl,
        items: cart.items,
        grandTotal: placedOrder.grandTotal,
        addressLabel,
        addressText,
        etaText,
        placedAt: placedOrder.placedAt,
      }),
    );
    dispatch(clearCart());
    navigation.reset({
      index: 1,
      routes: [
        { name: 'HomeMain' },
        {
          name: 'OrderPlaced',
          params: {
            orderId: placedOrder.orderId,
            kitchenName: cart.kitchenName,
            kitchenImageUrl: cart.kitchenImageUrl,
            itemsSummary,
            addressLabel,
            addressText,
            etaText,
            placedAt: placedOrder.placedAt,
          },
        },
      ],
    });
  };

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Place Order</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Order</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>DELIVERY ADDRESS</Text>
        <View style={styles.addressCard}>
          <View style={[styles.addressIcon, { backgroundColor: addressMeta.bg }]}>
            <addressMeta.Icon size={22} color={addressMeta.iconColor} />
          </View>
          <View style={styles.addressBody}>
            <Text style={styles.addressLabel}>{addressLabel}</Text>
            <Text style={styles.addressText}>{addressText}</Text>
          </View>
          <TouchableOpacity style={styles.changeBtn} activeOpacity={0.7} onPress={handleChangeAddress}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
        <View style={styles.summaryCard}>
          <View style={styles.kitchenRow}>
            {cart.kitchenImageUrl ? (
              <Image source={{ uri: cart.kitchenImageUrl }} style={styles.kitchenAvatar} contentFit="cover" />
            ) : (
              <View style={styles.kitchenAvatar} />
            )}
            <Text style={styles.kitchenName}>{cart.kitchenName}</Text>
          </View>

          <View style={styles.divider} />

          {cart.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>× {item.quantity}</Text>
              <Text style={styles.itemPrice}>₹ {lineTotal(item)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹ {totals.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charge</Text>
            <Text style={styles.summaryValue}>₹ {totals.delivery}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%)</Text>
            <Text style={styles.summaryValue}>₹ {totals.gst}</Text>
          </View>
          {cart.coupon ? (
            <View style={styles.summaryRow}>
              <Text style={styles.couponLabel}>Coupon ({cart.coupon.code})</Text>
              <Text style={styles.couponValue}>−₹ {cart.coupon.discount}</Text>
            </View>
          ) : null}

          <View style={styles.dashedDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹ {totals.grandTotal}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        <View style={styles.paymentCard}>
          {PAYMENT_METHODS.map((method, index) => {
            const selected = payment === method.key;
            return (
              <TouchableOpacity
                key={method.key}
                style={[styles.paymentRow, index === PAYMENT_METHODS.length - 1 && styles.paymentRowLast]}
                activeOpacity={method.enabled ? 0.7 : 1}
                disabled={!method.enabled}
                onPress={() => setPayment(method.key)}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={[styles.paymentLabel, !method.enabled && styles.paymentLabelDisabled]}>
                  {method.label}
                </Text>
                {method.enabled ? (
                  selected ? <CheckIcon /> : null
                ) : (
                  <Text style={styles.soonText}>(soon)</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.etaBanner}>
          <ClockIcon size={18} color="#3F9142" />
          <Text style={styles.etaText}>Estimated: {etaText}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {orderError ? <Text style={styles.orderErrorText}>{orderError}</Text> : null}
        <TouchableOpacity
          style={[styles.placeOrderBtn, (isPlacingOrder || !hasDeliveryAddress) && styles.placeOrderBtnDisabled]}
          activeOpacity={0.85}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || !hasDeliveryAddress}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order ₹{totals.grandTotal}</Text>
          )}
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

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressBody: {
    flex: 1,
    marginRight: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  addressText: {
    fontSize: 13.5,
    color: Colors.muted,
    marginTop: 4,
    lineHeight: 19,
  },
  changeBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  kitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kitchenAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E0D8',
  },
  kitchenName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginVertical: 14,
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    borderStyle: 'dashed',
    marginVertical: 10,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 14.5,
    color: Colors.dark,
  },
  itemQty: {
    fontSize: 14,
    color: Colors.muted,
    marginRight: 20,
  },
  itemPrice: {
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.dark,
    minWidth: 56,
    textAlign: 'right',
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14.5,
    color: Colors.dark,
  },
  summaryValue: {
    fontSize: 14.5,
    color: Colors.dark,
  },
  couponLabel: {
    fontSize: 14.5,
    color: '#3F9142',
    fontWeight: '600',
  },
  couponValue: {
    fontSize: 14.5,
    color: '#3F9142',
    fontWeight: '700',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },

  paymentCard: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  paymentRowLast: {
    borderBottomWidth: 0,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  paymentLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },
  paymentLabelDisabled: {
    color: Colors.placeholder,
  },
  soonText: {
    fontSize: 13,
    color: Colors.placeholder,
  },

  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E4F3E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  etaText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#2E7D32',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.line,
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  orderErrorText: {
    fontSize: 13,
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 10,
  },
});

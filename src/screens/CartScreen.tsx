import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { applyCoupon, decrementItem, incrementItem, removeCoupon, removeItem } from '../store/cartSlice';
import { computeCartTotals, lineTotal } from '../utils/cartTotals';
import { useValidateCouponMutation } from '../services/couponApi';
import { BackArrowIcon, PlusCircleIcon, TagIcon, TrashIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validateCoupon, { isLoading: isApplyingCoupon }] = useValidateCouponMutation();

  const totals = computeCartTotals(cart.items, cart.coupon?.discount ?? 0);

  const handleBack = () => navigation.goBack();
  const handleAddMoreItems = () => {
    if (cart.kitchenId) navigation.navigate('KitchenDetail', { kitchenId: cart.kitchenId });
    else navigation.navigate('HomeMain');
  };

  const handleApplyCoupon = async () => {
    Keyboard.dismiss();
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const result = await validateCoupon({ code: couponCode, subtotal: totals.subtotal }).unwrap();
      dispatch(applyCoupon(result));
      setCouponCode('');
    } catch {
      setCouponError('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => dispatch(removeCoupon());

  const handleCheckout = () => navigation.navigate('PlaceOrder');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.headerBtn} />
      </View>

      {cart.items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity style={styles.browseBtn} activeOpacity={0.7} onPress={() => navigation.navigate('HomeMain')}>
            <Text style={styles.browseBtnText}>Browse Kitchens</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <View key={item.id} style={styles.itemCard}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.itemThumb} contentFit="cover" />
                ) : (
                  <View style={styles.itemThumb} />
                )}
                <View style={styles.itemBody}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => dispatch(removeItem(item.id))}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <TrashIcon />
                    </TouchableOpacity>
                  </View>

                  {item.addOns.length > 0 ? (
                    item.addOns.map(addOn => (
                      <Text key={addOn.id} style={styles.addOnLine}>
                        + {addOn.name} × {addOn.qty}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.addOnLine}>No add-ons</Text>
                  )}

                  <View style={styles.itemFooter}>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        activeOpacity={0.7}
                        disabled={item.quantity <= 1}
                        onPress={() => dispatch(decrementItem(item.id))}
                      >
                        <Text
                          style={[styles.stepperBtnText, item.quantity <= 1 && styles.stepperBtnTextDisabled]}
                        >
                          −
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        activeOpacity={0.7}
                        onPress={() => dispatch(incrementItem(item.id))}
                      >
                        <Text style={[styles.stepperBtnText, styles.stepperBtnTextPlus]}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>₹ {lineTotal(item)}</Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addMoreBtn} activeOpacity={0.7} onPress={handleAddMoreItems}>
              <PlusCircleIcon size={18} />
              <Text style={styles.addMoreText}>Add more items</Text>
            </TouchableOpacity>

            <View style={styles.summaryCard}>
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
                  <Text style={styles.couponAppliedLabel}>Coupon ({cart.coupon.code})</Text>
                  <Text style={styles.couponAppliedValue}>−₹ {cart.coupon.discount}</Text>
                </View>
              ) : null}

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>₹ {totals.grandTotal}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.couponHeaderRow}>
                <TagIcon size={16} />
                <Text style={styles.couponHeaderText}>Have a coupon code?</Text>
              </View>

              {cart.coupon ? (
                <View style={styles.couponAppliedRow}>
                  <Text style={styles.couponAppliedChip}>{cart.coupon.code} applied</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={handleRemoveCoupon}>
                    <Text style={styles.couponRemoveText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.couponRow}>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter code"
                      placeholderTextColor={Colors.placeholder}
                      value={couponCode}
                      onChangeText={setCouponCode}
                      autoCapitalize="characters"
                      editable={!isApplyingCoupon}
                    />
                    <TouchableOpacity
                      style={[styles.applyBtn, isApplyingCoupon && styles.applyBtnDisabled]}
                      activeOpacity={0.7}
                      onPress={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                    >
                      {isApplyingCoupon ? (
                        <ActivityIndicator color={Colors.primary} size="small" />
                      ) : (
                        <Text style={styles.applyBtnText}>APPLY</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  {couponError ? <Text style={styles.couponErrorText}>{couponError}</Text> : null}
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
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
    marginBottom: 16,
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
  kitchenName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginTop: 16,
    marginBottom: 16,
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  itemThumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#E8E0D8',
    marginRight: 12,
  },
  itemBody: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginRight: 8,
  },
  addOnLine: {
    fontSize: 12.5,
    color: Colors.muted,
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  stepperBtnTextDisabled: {
    color: Colors.placeholder,
  },
  stepperBtnTextPlus: {
    color: Colors.primary,
  },
  stepperValue: {
    minWidth: 26,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },

  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  summaryLabel: {
    fontSize: 14.5,
    color: Colors.dark,
  },
  summaryValue: {
    fontSize: 14.5,
    color: Colors.dark,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginVertical: 8,
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
  couponAppliedLabel: {
    fontSize: 14.5,
    color: '#3F9142',
    fontWeight: '600',
  },
  couponAppliedValue: {
    fontSize: 14.5,
    color: '#3F9142',
    fontWeight: '700',
  },

  couponHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  couponHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.dark,
  },
  applyBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    opacity: 0.6,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  couponErrorText: {
    fontSize: 12,
    color: '#C0392B',
    marginTop: 8,
  },
  couponAppliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3F9142',
    backgroundColor: '#E4F3E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  couponAppliedChip: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#3F9142',
  },
  couponRemoveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C0392B',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.line,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

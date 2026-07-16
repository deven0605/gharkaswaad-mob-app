import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useGetLocationQuery } from '../services/customerApi';
import {
  useGetKitchenDetailsQuery,
  useGetKitchenMenuQuery,
  useGetAddOnsQuery,
  MenuSlot,
} from '../services/kitchenApi';
import { BreadIcon, RiceBowlIcon, SweetIcon, VegetableIcon, BeverageIcon } from '../components/Icons';
import { useAppDispatch } from '../store';
import { addItem, CartAddOn } from '../store/cartSlice';

type Props = NativeStackScreenProps<HomeStackParamList, 'ThaliCustomize'>;

const CATEGORY_ICONS: Record<string, typeof BreadIcon> = {
  BREAD: BreadIcon,
  RICE: RiceBowlIcon,
  VEGETABLES: VegetableIcon,
  SWEETS: SweetIcon,
  BEVERAGES: BeverageIcon,
};

function baseSummary(slot: MenuSlot | null): string {
  const rotiCount = slot ? slot.chapatiCount : 2;
  return `Base: Dal, Rice, ${rotiCount} Roti, Sabzi, Salad, Pickle`;
}

export default function ThaliCustomizeScreen({ navigation, route }: Props) {
  const { kitchenId, mealTypeId, slot = 'lunch' } = route.params;
  const dispatch = useAppDispatch();
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);

  const { data: location } = useGetLocationQuery();
  const { data: kitchen } = useGetKitchenDetailsQuery(
    location ? { id: kitchenId, lat: location.latitude, lng: location.longitude } : skipToken,
  );
  const { data: menu, isLoading: isMenuLoading, isError, refetch } = useGetKitchenMenuQuery(kitchenId);
  const { data: addOnCategories = [], isLoading: isAddOnsLoading } = useGetAddOnsQuery();
  const isLoading = isMenuLoading || isAddOnsLoading;

  const mealType = menu?.mealTypes.find(m => m.id === mealTypeId);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMenu = menu?.days.find(d => d.date === todayStr) ?? menu?.days[0];
  const slotDetails = todayMenu ? (slot === 'lunch' ? todayMenu.lunch : todayMenu.dinner) : null;

  const handleClose = () => navigation.goBack();

  const setItemQty = (id: string, next: number) => {
    setAddOnQty(prev => ({ ...prev, [id]: Math.max(0, next) }));
  };

  const basePrice = mealType?.price ?? 0;
  const addOnTotal = addOnCategories.flatMap(c => c.items).reduce(
    (sum, item) => sum + (addOnQty[item.id] ?? 0) * item.price,
    0,
  );
  const total = (basePrice + addOnTotal) * quantity;

  const handleAddToCart = () => {
    if (!mealType || !kitchen) return;

    const addOns: CartAddOn[] = addOnCategories.flatMap(c => c.items).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: addOnQty[item.id] ?? 0,
    }));

    dispatch(
      addItem({
        kitchenId,
        kitchenName: kitchen.name,
        kitchenImageUrl: kitchen.imageUrl,
        mealTypeId: mealType.id,
        name: mealType.name,
        imageUrl: kitchen.imageUrl,
        basePrice: mealType.price,
        addOns,
        quantity,
      }),
    );

    navigation.replace('Cart');
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

      <View style={styles.sheet}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClose} style={styles.handleWrap}>
          <View style={styles.handle} />
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={Colors.primary} />
        ) : isError || !mealType ? (
          <View style={styles.errorBox}>
            <Text style={styles.emptyText}>Couldn't load this thali.</Text>
            <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.headRow}>
                {kitchen?.imageUrl ? (
                  <Image source={{ uri: kitchen.imageUrl }} style={styles.thumb} contentFit="cover" />
                ) : (
                  <View style={styles.thumb} />
                )}
                <View style={styles.headBody}>
                  <Text style={styles.name}>{mealType.name}</Text>
                  <Text style={styles.baseText}>{baseSummary(slotDetails)}</Text>
                  <Text style={styles.basePriceRow}>
                    Base price: <Text style={styles.basePriceValue}>₹ {basePrice}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>CUSTOMISE ADD-ONS</Text>

              {addOnCategories.map((category, catIndex) => {
                const CategoryIcon = CATEGORY_ICONS[category.category] ?? BreadIcon;
                return (
                  <View
                    key={category.category}
                    style={[styles.category, catIndex === addOnCategories.length - 1 && styles.categoryLast]}
                  >
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryIconWrap}>
                        <CategoryIcon size={20} />
                      </View>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                    </View>

                    {category.items.map(item => (
                      <View key={item.id} style={styles.addOnRow}>
                        <View style={styles.addOnNameWrap}>
                          <Text style={styles.addOnName}>{item.name}</Text>
                          <Text style={styles.addOnUnit}>{item.unit}</Text>
                        </View>
                        <Text style={styles.addOnPrice}>₹{item.price}</Text>
                        <Stepper
                          value={addOnQty[item.id] ?? 0}
                          onChange={next => setItemQty(item.id, next)}
                        />
                      </View>
                    ))}
                  </View>
                );
              })}

              <View style={styles.quantityRow}>
                <Text style={styles.quantityLabel}>Quantity</Text>
                <Stepper value={quantity} min={1} onChange={setQuantity} />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Add to Cart ₹ {total}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function Stepper({
  value,
  min = 0,
  onChange,
}: {
  value: number;
  min?: number;
  onChange: (next: number) => void;
}) {
  const atMin = value <= min;
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={styles.stepperBtn}
        activeOpacity={0.7}
        disabled={atMin}
        onPress={() => onChange(value - 1)}
      >
        <Text style={[styles.stepperBtnText, atMin && styles.stepperBtnTextDisabled]}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value}</Text>
      <TouchableOpacity style={styles.stepperBtn} activeOpacity={0.7} onPress={() => onChange(value + 1)}>
        <Text style={[styles.stepperBtnText, styles.stepperBtnTextPlus]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.line,
  },

  loader: {
    marginVertical: 40,
  },
  errorBox: {
    alignItems: 'center',
    marginVertical: 40,
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headRow: {
    flexDirection: 'row',
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#E8E0D8',
    marginRight: 14,
  },
  headBody: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.dark,
  },
  baseText: {
    fontSize: 13.5,
    color: Colors.muted,
    marginTop: 6,
    lineHeight: 19,
  },
  basePriceRow: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 10,
  },
  basePriceValue: {
    color: Colors.primary,
    fontWeight: '700',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginTop: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  category: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  categoryLast: {
    borderBottomWidth: 0,
    marginBottom: 4,
    paddingBottom: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E6D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },

  addOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addOnNameWrap: {
    flex: 1,
  },
  addOnName: {
    fontSize: 14.5,
    color: Colors.dark,
  },
  addOnUnit: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  addOnPrice: {
    fontSize: 14,
    color: Colors.muted,
    marginRight: 14,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 15,
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
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 17,
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
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.dark,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.line,
  },
  addToCartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

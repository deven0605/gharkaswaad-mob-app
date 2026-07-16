import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/favoritesSlice';
import { useGetLocationQuery } from '../services/customerApi';
import { useGetKitchenDetailsQuery, useGetKitchenMenuQuery, MenuSlot } from '../services/kitchenApi';
import { BackArrowIcon, CartIcon, ClockIcon, DotIcon, HeartIcon, LeafIcon, StarIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'KitchenDetail'>;

type Slot = 'lunch' | 'dinner';

function slotSummary(slot: MenuSlot): string {
  return `${slot.dal} · ${slot.riceCount} ${slot.riceType} · ${slot.chapatiCount} Roti · ${slot.vegetables.join(', ')}`;
}

export default function KitchenDetailScreen({ navigation, route }: Props) {
  const { kitchenId } = route.params;
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state => state.favorites.ids.includes(kitchenId));
  const [slot, setSlot] = useState<Slot>('lunch');

  const cart = useAppSelector(state => state.cart);
  const cartItemCount =
    cart.kitchenId === kitchenId ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const { data: location } = useGetLocationQuery();
  const {
    data: kitchen,
    isLoading,
    isError,
    refetch,
  } = useGetKitchenDetailsQuery(
    location ? { id: kitchenId, lat: location.latitude, lng: location.longitude } : skipToken,
  );
  const { data: menu, isLoading: isMenuLoading } = useGetKitchenMenuQuery(kitchenId);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMenu = menu?.days.find(d => d.date === todayStr) ?? menu?.days[0];
  const slotDetails = todayMenu ? (slot === 'lunch' ? todayMenu.lunch : todayMenu.dinner) : null;

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Cart')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <CartIcon />
          {cartItemCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount > 99 ? '99+' : cartItemCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : isError || !kitchen ? (
        <View style={styles.errorBox}>
          <Text style={styles.emptyText}>Couldn't load this kitchen.</Text>
          <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {kitchen.imageUrl ? (
            <Image source={{ uri: kitchen.imageUrl }} style={styles.banner} />
          ) : (
            <View style={styles.banner} />
          )}

          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{kitchen.name}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => dispatch(toggleFavorite(kitchenId))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <HeartIcon filled={isFavorite} color={isFavorite ? Colors.primary : Colors.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <StarIcon />
              <Text style={styles.metaText}>
                {kitchen.rating.toFixed(1)} ({kitchen.reviewCount} reviews)
              </Text>
            </View>

            <View style={styles.metaRow}>
              <ClockIcon />
              <Text style={styles.metaText}>
                {kitchen.distanceKm} km · {kitchen.etaMinMinutes}-{kitchen.etaMaxMinutes} min
              </Text>
            </View>

            <View style={styles.metaRow}>
              <DotIcon color={kitchen.isOpen ? '#3F9142' : '#C0392B'} />
              <Text style={styles.metaText}>{kitchen.isOpen ? 'Open now' : 'Closed'}</Text>
            </View>

            {kitchen.isVeg ? (
              <View style={styles.metaRow}>
                <LeafIcon />
                <Text style={styles.metaText}>Veg Only</Text>
              </View>
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>MENU</Text>

            {isMenuLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : !menu?.hasActivePlan || menu.mealTypes.length === 0 ? (
              <Text style={styles.emptyText}>Menu coming soon.</Text>
            ) : (
              <>
                <View style={styles.slotTabs}>
                  <TouchableOpacity
                    style={[styles.slotTab, slot === 'lunch' && styles.slotTabActive]}
                    activeOpacity={0.7}
                    onPress={() => setSlot('lunch')}
                  >
                    <Text style={[styles.slotTabText, slot === 'lunch' && styles.slotTabTextActive]}>LUNCH</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.slotTab, slot === 'dinner' && styles.slotTabActive]}
                    activeOpacity={0.7}
                    onPress={() => setSlot('dinner')}
                  >
                    <Text style={[styles.slotTabText, slot === 'dinner' && styles.slotTabTextActive]}>DINNER</Text>
                  </TouchableOpacity>
                </View>

                {menu.mealTypes.map(mealType => (
                  <TouchableOpacity
                    key={mealType.id}
                    style={styles.thaliCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('MenuDetails', { kitchenId, slot })}
                  >
                    <View style={styles.thaliThumb} />
                    <View style={styles.thaliBody}>
                      <Text style={styles.thaliName}>{mealType.name}</Text>
                      <Text style={styles.thaliDesc} numberOfLines={2}>
                        {slotDetails ? slotSummary(slotDetails) : mealType.description}
                      </Text>
                      <View style={styles.thaliFooter}>
                        <Text style={styles.thaliPrice}>₹ {mealType.price}</Text>
                        <TouchableOpacity
                          style={styles.addBtn}
                          activeOpacity={0.7}
                          onPress={() =>
                            navigation.navigate('ThaliCustomize', { kitchenId, mealTypeId: mealType.id, slot })
                          }
                        >
                          <Text style={styles.addBtnText}>ADD +</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  cartBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },

  loader: {
    marginTop: 40,
  },
  errorBox: {
    alignItems: 'center',
    marginTop: 40,
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

  scrollContent: {
    paddingBottom: 24,
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: '#E8E0D8',
  },

  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark,
    marginRight: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: '500',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
  },

  slotTabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  slotTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  slotTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  slotTabTextActive: {
    color: '#fff',
  },

  thaliCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  thaliThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E8E0D8',
    marginRight: 12,
  },
  thaliBody: {
    flex: 1,
  },
  thaliName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  thaliDesc: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  thaliFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  thaliPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

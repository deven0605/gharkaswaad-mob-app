import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useGetLocationQuery } from '../services/customerApi';
import { useGetKitchenDetailsQuery, useGetKitchenMenuQuery, MealTypeOption, MenuSlot } from '../services/kitchenApi';
import { BackArrowIcon, HeartIcon, LeafIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'MenuDetails'>;

interface InclusionRow {
  title: string;
  subtitle: string;
}

function buildInclusions(slot: MenuSlot | null): InclusionRow[] {
  if (!slot) return [];

  const rows: InclusionRow[] = [{ title: 'Dal', subtitle: `${slot.dal} · 1 bowl` }];

  if (slot.vegetables[0]) {
    rows.push({ title: 'Sabzi (Gravy)', subtitle: `${slot.vegetables[0]} · 1 bowl` });
  }
  if (slot.vegetables[1]) {
    rows.push({ title: 'Sabzi (Dry)', subtitle: `${slot.vegetables[1]} · 1 bowl` });
  }

  rows.push({ title: 'Rice', subtitle: `${slot.riceType} · ${slot.riceCount} bowl${slot.riceCount === 1 ? '' : 's'}` });
  rows.push({ title: 'Roti', subtitle: `${slot.chapatiCount} piece${slot.chapatiCount === 1 ? '' : 's'}` });
  rows.push({ title: 'Salad', subtitle: '1 plate' });
  rows.push({ title: 'Pickle', subtitle: '1 serving' });

  return rows;
}

export default function MenuDetailsScreen({ navigation, route }: Props) {
  const { kitchenId, slot = 'lunch' } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

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
  const inclusions = buildInclusions(slotDetails);

  const handleBack = () => navigation.goBack();

  const loading = isLoading || isMenuLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thali Details</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.7}
          onPress={() => setIsFavorite(prev => !prev)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <HeartIcon filled={isFavorite} color={isFavorite ? Colors.primary : Colors.dark} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : isError || !kitchen ? (
        <View style={styles.errorBox}>
          <Text style={styles.emptyText}>Couldn't load the menu.</Text>
          <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !menu?.hasActivePlan || menu.mealTypes.length === 0 ? (
        <View style={styles.errorBox}>
          <Text style={styles.emptyText}>Menu coming soon.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {menu.mealTypes.map(mealType => (
            <ThaliCard
              key={mealType.id}
              mealType={mealType}
              imageUrl={kitchen.imageUrl}
              inclusions={inclusions}
              isVeg={kitchen.isVeg}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ThaliCard({
  mealType,
  imageUrl,
  inclusions,
  isVeg,
}: {
  mealType: MealTypeOption;
  imageUrl: string | null;
  inclusions: InclusionRow[];
  isVeg: boolean;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={styles.thumb} />
        )}
        <View style={styles.cardTopBody}>
          <View style={styles.titleRow}>
            <Text style={styles.thaliName}>{mealType.name}</Text>
            <Text style={styles.thaliPrice}>₹ {mealType.price}</Text>
          </View>
          <Text style={styles.thaliDesc}>{mealType.description}</Text>
        </View>
      </View>

      {inclusions.length > 0 ? (
        <View style={styles.included}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>What's Included</Text>
            <View style={styles.sectionHeaderLine} />
          </View>

          {inclusions.map((row, index) => (
            <View
              key={row.title}
              style={[styles.inclusionRow, index === inclusions.length - 1 && styles.inclusionRowLast]}
            >
              <View style={styles.inclusionThumb} />
              <View style={styles.inclusionBody}>
                <Text style={styles.inclusionTitle}>{row.title}</Text>
                <Text style={styles.inclusionSubtitle}>{row.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {isVeg ? (
        <View style={styles.vegBadge}>
          <LeafIcon size={14} />
          <Text style={styles.vegBadgeText}>100% Vegetarian · No onion, no garlic</Text>
        </View>
      ) : null}
    </View>
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
  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row',
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E8E0D8',
    marginRight: 12,
  },
  cardTopBody: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  thaliName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
    marginRight: 8,
  },
  thaliPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  thaliDesc: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 6,
  },

  included: {
    marginTop: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  sectionHeaderLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginLeft: 10,
  },

  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  inclusionRowLast: {
    borderBottomWidth: 0,
  },
  inclusionThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E0D8',
    marginRight: 12,
  },
  inclusionBody: {
    flex: 1,
  },
  inclusionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  inclusionSubtitle: {
    fontSize: 12.5,
    color: Colors.muted,
    marginTop: 2,
  },

  vegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E4F3E5',
  },
  vegBadgeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3F9142',
    flexShrink: 1,
  },
});

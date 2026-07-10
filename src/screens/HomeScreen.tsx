import React, { ReactNode, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useGetLocationQuery } from '../services/customerApi';
import { Kitchen, KitchenSortOption, useGetKitchensQuery } from '../services/kitchenApi';
import KitchenCard from '../components/KitchenCard';
import {
  BellIcon,
  ChevronDownIcon,
  DotIcon,
  FilterClockIcon,
  LeafIcon,
  MapPinIcon,
  PersonIcon,
  SearchIcon,
  StarIcon,
} from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

type FilterKey = 'veg' | 'rating' | 'fast' | 'open';

const DEFAULT_RADIUS_KM = 5;
const SORT_OPTIONS: { key: KitchenSortOption; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'rating', label: 'Rating' },
  { key: 'distance', label: 'Distance' },
  { key: 'deliveryTime', label: 'Delivery Time' },
];

export default function HomeScreen({ navigation }: Props) {
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortIndex, setSortIndex] = useState(0);

  const { data: location } = useGetLocationQuery();
  const sort = SORT_OPTIONS[sortIndex];

  const {
    data: kitchens,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetKitchensQuery(
    location
      ? {
          lat: location.latitude,
          lng: location.longitude,
          radiusKm: DEFAULT_RADIUS_KM,
          veg: activeFilters.has('veg') ? true : undefined,
          minRating: activeFilters.has('rating') ? 4 : undefined,
          maxEtaMinutes: activeFilters.has('fast') ? 30 : undefined,
          openNow: activeFilters.has('open') ? true : undefined,
          sort: sort.key,
        }
      : skipToken,
  );

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const cycleSort = () => setSortIndex(prev => (prev + 1) % SORT_OPTIONS.length);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenSearch = () => navigation.navigate('SearchResults');
  const handleOpenKitchen = (kitchen: Kitchen) =>
    navigation.navigate('KitchenDetail', { kitchenId: kitchen.id });

  const locationLabel = useMemo(() => {
    if (!location) return 'Set location';
    return location.city ?? location.address;
  }, [location]);

  const listData = kitchens ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.locationBtn} activeOpacity={0.7}>
          <MapPinIcon size={20} />
          <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
          <ChevronDownIcon />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <BellIcon />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
            <PersonIcon size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching && !isLoading}
        onRefresh={location ? refetch : undefined}
        ListHeaderComponent={
          <>
            <TouchableOpacity style={styles.searchBar} activeOpacity={0.7} onPress={handleOpenSearch}>
              <SearchIcon />
              <Text style={styles.searchPlaceholder}>Search kitchens, food...</Text>
            </TouchableOpacity>

            <View style={styles.chipsRow}>
              <FilterChip
                icon={<LeafIcon />}
                label="Veg Only"
                active={activeFilters.has('veg')}
                onPress={() => toggleFilter('veg')}
              />
              <FilterChip
                icon={<StarIcon size={14} />}
                label="4★+"
                active={activeFilters.has('rating')}
                onPress={() => toggleFilter('rating')}
              />
              <FilterChip
                icon={<FilterClockIcon size={15} />}
                label="<30 min"
                active={activeFilters.has('fast')}
                onPress={() => toggleFilter('fast')}
              />
            </View>
            <View style={styles.chipsRow}>
              <FilterChip
                icon={<DotIcon />}
                label="Open Now"
                active={activeFilters.has('open')}
                onPress={() => toggleFilter('open')}
              />
              <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={cycleSort}>
                <Text style={styles.chipLabel}>Sort: {sort.label}</Text>
                <ChevronDownIcon size={14} />
              </TouchableOpacity>
            </View>

            {isLoading && location ? (
              <ActivityIndicator style={styles.loader} color={Colors.primary} />
            ) : null}
            {isError ? (
              <Text style={styles.emptyText}>Couldn't load kitchens. Pull down to retry.</Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <KitchenCard
            kitchen={item}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={toggleFavorite}
            onPress={handleOpenKitchen}
          />
        )}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Text style={styles.emptyText}>No kitchens match your filters.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function FilterChip({
  icon,
  label,
  active,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  locationText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: Colors.placeholder,
  },

  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 86, 30, 0.08)',
  },
  chipLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.dark,
  },
  chipLabelActive: {
    color: Colors.primary,
  },

  loader: {
    marginTop: 24,
  },

  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    marginTop: 40,
    fontSize: 14,
  },
});

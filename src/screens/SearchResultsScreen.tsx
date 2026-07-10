import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useGetLocationQuery } from '../services/customerApi';
import { Kitchen, FoodItem, useLazySearchKitchensQuery } from '../services/kitchenApi';
import { BackArrowIcon, ChevronRightIcon, SearchIcon, StarIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'SearchResults'>;

type ResultRow =
  | { type: 'header'; key: string; title: string }
  | { type: 'kitchen'; key: string; kitchen: Kitchen }
  | { type: 'foodItem'; key: string; item: FoodItem };

const DEBOUNCE_MS = 300;
const SEARCH_RADIUS_KM = 50;

export default function SearchResultsScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params?.query ?? '');
  const { data: location } = useGetLocationQuery();
  const [triggerSearch, { data: results, isFetching }] = useLazySearchKitchensQuery();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !location) return;

    const handle = setTimeout(() => {
      triggerSearch({
        q: trimmed,
        lat: location.latitude,
        lng: location.longitude,
        radiusKm: SEARCH_RADIUS_KM,
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, location, triggerSearch]);

  const matchedKitchens = query.trim() ? results?.kitchens ?? [] : [];
  const matchedFoodItems = query.trim() ? results?.foodItems ?? [] : [];
  const totalResults = matchedKitchens.length + matchedFoodItems.length;

  const rows: ResultRow[] = useMemo(() => {
    const list: ResultRow[] = [];
    if (matchedKitchens.length) {
      list.push({ type: 'header', key: 'h-kitchens', title: 'KITCHENS' });
      matchedKitchens.forEach(k => list.push({ type: 'kitchen', key: `k-${k.id}`, kitchen: k }));
    }
    if (matchedFoodItems.length) {
      list.push({ type: 'header', key: 'h-food', title: 'FOOD ITEMS' });
      matchedFoodItems.forEach(f => list.push({ type: 'foodItem', key: `f-${f.id}`, item: f }));
    }
    return list;
  }, [matchedKitchens, matchedFoodItems]);

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search kitchens, food..."
            placeholderTextColor={Colors.placeholder}
            autoFocus
            returnKeyType="search"
          />
        </View>
        <View style={styles.searchIconBtn}>
          <SearchIcon size={22} color={Colors.primary} />
        </View>
      </View>

      {query.trim() ? (
        <Text style={styles.resultsCount}>
          {isFetching ? 'Searching…' : `${totalResults} ${totalResults === 1 ? 'result' : 'results'} found`}
        </Text>
      ) : null}
      <View style={styles.divider} />

      <FlatList
        data={rows}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionHeader}>{item.title}</Text>;
          }
          if (item.type === 'kitchen') {
            const k = item.kitchen;
            return (
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('KitchenDetail', { kitchenId: k.id })}
              >
                {k.imageUrl ? (
                  <Image source={{ uri: k.imageUrl }} style={styles.rowImage} />
                ) : (
                  <View style={styles.rowImage} />
                )}
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{k.name}</Text>
                  {k.featuredDish ? (
                    <Text style={styles.rowSubtitle} numberOfLines={1}>{k.featuredDish}</Text>
                  ) : null}
                  <View style={styles.rowMetaRow}>
                    <StarIcon size={14} />
                    <Text style={styles.rowMetaText}>{k.rating.toFixed(1)}</Text>
                    <Text style={styles.metaDivider}>·</Text>
                    <Text style={styles.rowMetaText}>{k.distanceKm} km</Text>
                  </View>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>
            );
          }
          const f = item.item;
          return (
            <TouchableOpacity style={styles.row} activeOpacity={0.75}>
              {f.imageUrl ? (
                <Image source={{ uri: f.imageUrl }} style={styles.rowImage} />
              ) : (
                <View style={styles.rowImage} />
              )}
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={2}>{f.name}</Text>
                <Text style={styles.rowSubtitle} numberOfLines={1}>{f.subtitle}</Text>
                {f.subtitle !== f.kitchenName ? (
                  <Text style={styles.rowKitchen} numberOfLines={1}>{f.kitchenName}</Text>
                ) : null}
              </View>
              <ChevronRightIcon />
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={
          isFetching ? <ActivityIndicator style={styles.loader} color={Colors.primary} /> : null
        }
        ListEmptyComponent={
          !isFetching ? (
            query.trim() ? (
              <Text style={styles.emptyText}>No results for "{query.trim()}".</Text>
            ) : (
              <Text style={styles.emptyText}>Start typing to search kitchens and food.</Text>
            )
          ) : null
        }
      />
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
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F2ECE3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    fontSize: 15,
    color: Colors.dark,
    padding: 0,
  },
  searchIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultsCount: {
    fontSize: 15,
    color: Colors.muted,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginHorizontal: 16,
    marginBottom: 8,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFE7DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rowImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E8E0D8',
  },
  rowBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  rowSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 3,
  },
  rowKitchen: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 3,
  },
  rowMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  rowMetaText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '500',
  },
  metaDivider: {
    color: Colors.line,
    marginHorizontal: 2,
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

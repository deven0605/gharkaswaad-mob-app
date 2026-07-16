import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/favoritesSlice';
import { useGetLocationQuery } from '../services/customerApi';
import { Kitchen, useGetKitchensQuery } from '../services/kitchenApi';
import KitchenCard from '../components/KitchenCard';
import { BackArrowIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Favourites'>;

const DEFAULT_RADIUS_KM = 5;

export default function FavouritesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.ids);

  const { data: location } = useGetLocationQuery();
  const {
    data: kitchens,
    isLoading,
    isError,
    refetch,
  } = useGetKitchensQuery(
    location ? { lat: location.latitude, lng: location.longitude, radiusKm: DEFAULT_RADIUS_KM } : skipToken,
  );

  const favouriteKitchens = (kitchens ?? []).filter(k => favoriteIds.includes(k.id));

  const handleBack = () => navigation.goBack();
  const handleOpenKitchen = (kitchen: Kitchen) => navigation.navigate('KitchenDetail', { kitchenId: kitchen.id });
  const handleToggleFavorite = (id: string) => dispatch(toggleFavorite(id));
  const handleBrowseKitchens = () => navigation.navigate('HomeMain');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favourites</Text>
        <View style={styles.headerBtn} />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.emptyText}>Couldn't load your favourites.</Text>
          <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : favouriteKitchens.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No favourites yet.</Text>
          <TouchableOpacity style={styles.browseBtn} activeOpacity={0.7} onPress={handleBrowseKitchens}>
            <Text style={styles.browseBtnText}>Browse Kitchens</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favouriteKitchens}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <KitchenCard
              kitchen={item}
              isFavorite
              onToggleFavorite={handleToggleFavorite}
              onPress={handleOpenKitchen}
            />
          )}
        />
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
    marginBottom: 16,
  },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  listContent: {
    padding: 16,
  },
});

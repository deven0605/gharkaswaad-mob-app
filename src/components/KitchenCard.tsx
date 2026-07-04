import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Kitchen } from '../services/kitchenApi';
import { ClockIcon, HeartIcon, StarIcon } from './Icons';

interface Props {
  kitchen: Kitchen;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPress: (kitchen: Kitchen) => void;
}

export default function KitchenCard({ kitchen, isFavorite, onToggleFavorite, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(kitchen)}>
      {kitchen.imageUrl ? (
        <Image source={{ uri: kitchen.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{kitchen.name}</Text>
          <TouchableOpacity
            style={styles.favoriteBtn}
            activeOpacity={0.7}
            onPress={() => onToggleFavorite(kitchen.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <HeartIcon filled={isFavorite} color={isFavorite ? Colors.primary : Colors.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <StarIcon />
          <Text style={styles.metaText}>
            {kitchen.rating.toFixed(1)} ({kitchen.reviewCount})
          </Text>
          <Text style={styles.metaDivider}>|</Text>
          <Text style={styles.metaText}>{kitchen.distanceKm} km</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.etaRow}>
            <ClockIcon />
            <Text style={styles.metaText}>
              {kitchen.etaMinMinutes}–{kitchen.etaMaxMinutes} min
            </Text>
          </View>
          <View style={[styles.statusBadge, kitchen.isOpen ? styles.statusOpen : styles.statusClosed]}>
            <Text style={[styles.statusText, kitchen.isOpen ? styles.statusTextOpen : styles.statusTextClosed]}>
              {kitchen.isOpen ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#E8E0D8',
  },
  body: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },
  favoriteBtn: {
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    fontSize: 13.5,
    color: Colors.muted,
    fontWeight: '500',
  },
  metaDivider: {
    color: Colors.line,
    marginHorizontal: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#E4F3E5',
  },
  statusClosed: {
    backgroundColor: '#FBE4E1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusTextOpen: {
    color: '#3F9142',
  },
  statusTextClosed: {
    color: '#C0392B',
  },
});

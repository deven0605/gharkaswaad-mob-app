import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { AuthStackParamList } from '../navigation/types';
import { PlaceSuggestion, useLazySearchLocationQuery } from '../services/customerApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'SearchLocation'>;

// ── Icons ────────────────────────────────────────────────────────────────────

function BackArrowIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        fill={Colors.dark}
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={Colors.placeholder} strokeWidth={2} />
      <Path
        d="M16.5 16.5L21 21"
        stroke={Colors.placeholder}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ClearIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill="#C4C4C4" />
      <Path
        d="M15 9L9 15M9 9l6 6"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MapPinIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={Colors.primary}
      />
      <Circle cx={12} cy={9} r={2.5} fill="white" />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={Colors.placeholder}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MapFoldIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={Colors.primary}>
      <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
    </Svg>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 350;

export default function SearchLocationScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [triggerSearch, { data: suggestions = [], isFetching }] = useLazySearchLocationQuery();

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const timer = setTimeout(() => triggerSearch(q), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, triggerSearch]);

  const handleBack = () => navigation.goBack();
  const handleSelectSuggestion = (item: PlaceSuggestion) => {
    navigation.navigate('ConfirmLocation', {
      address: `${item.name}, ${item.subtitle}`,
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };
  const handleChooseOnMap = () => {
    navigation.navigate('ConfirmLocation', {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
        <BackArrowIcon />
      </TouchableOpacity>

      {/* Search hint row */}
      <View style={styles.hintRow}>
        <SearchIcon />
        <Text style={styles.hintText}>Search area, landmark...</Text>
      </View>

      {/* Active input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search area, landmark..."
          placeholderTextColor={Colors.placeholder}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7} style={styles.clearBtn}>
            <ClearIcon />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Suggestions list */}
      <Text style={styles.sectionLabel}>SUGGESTIONS</Text>

      {isFetching ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : query.trim() && suggestions.length === 0 ? (
        <Text style={styles.emptyText}>No matching places found.</Text>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.placeId}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionRow}
              activeOpacity={0.75}
              onPress={() => handleSelectSuggestion(item)}
            >
              <View style={styles.pinCircle}>
                <MapPinIcon />
              </View>
              <View style={styles.suggestionTexts}>
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionSub}>{item.subtitle}</Text>
              </View>
              <ChevronRightIcon />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Choose on Map button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.mapBtn} activeOpacity={0.85} onPress={handleChooseOnMap}>
          <MapFoldIcon />
          <Text style={styles.mapBtnText}>Choose on Map</Text>
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6F2',
    top: 30,
  },

  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginLeft: 12,
  },

  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 15,
    color: Colors.placeholder,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDE4DC',
    marginTop: 16,
    marginBottom: 14,
    marginHorizontal: 20,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 4,
  },

  list: {
    flex: 1,
    paddingHorizontal: 20,
  },

  loader: {
    marginTop: 24,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },

  separator: {
    height: 1,
    backgroundColor: '#EDE4DC',
  },

  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBE8DC',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  suggestionTexts: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  suggestionSub: {
    fontSize: 13,
    color: Colors.muted,
  },

  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    paddingTop: 8,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF5EF',
    gap: 12,
  },
  mapBtnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});

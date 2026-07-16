import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { Address, useGetAddressesQuery, useSetDefaultAddressMutation } from '../services/customerApi';
import { BackArrowIcon, ChevronRightIcon, PlusCircleIcon } from '../components/Icons';
import { addressLabelDisplayName, addressLabelMeta, formatAddress } from '../utils/addressLabels';

type Props = NativeStackScreenProps<HomeStackParamList, 'SelectAddress'>;

export default function SelectAddressScreen({ navigation }: Props) {
  const { data: addresses, isLoading, isError, refetch } = useGetAddressesQuery();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBack = () => navigation.goBack();

  const handleDeliverHere = async (address: Address) => {
    if (address.defaultAddress) {
      navigation.goBack();
      return;
    }
    setErrorMsg('');
    setSavingId(address.id);
    try {
      await setDefaultAddress(address.id).unwrap();
      navigation.goBack();
    } catch {
      setErrorMsg('Could not set this delivery address. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Address</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.addNewBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <PlusCircleIcon size={22} />
          <Text style={styles.addNewText}>Add New Address</Text>
        </TouchableOpacity>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={Colors.primary} />
        ) : isError ? (
          <View style={styles.errorBox}>
            <Text style={styles.emptyText}>Couldn't load your addresses.</Text>
            <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !addresses || addresses.length === 0 ? (
          <Text style={styles.emptyText}>No saved addresses yet.</Text>
        ) : (
          addresses.map(address => {
            const meta = addressLabelMeta(address.label);
            const isSaving = savingId === address.id;
            return (
              <View key={address.id} style={styles.card}>
                <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
                  <meta.Icon size={24} color={meta.iconColor} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.labelRow}>
                    <View style={styles.labelWithBadge}>
                      <Text style={styles.label}>{addressLabelDisplayName(address.label)}</Text>
                      {address.defaultAddress ? (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                        </View>
                      ) : null}
                    </View>
                    <ChevronRightIcon />
                  </View>
                  <Text style={styles.addressText}>{formatAddress(address)}</Text>
                  <TouchableOpacity
                    style={styles.deliverBtn}
                    activeOpacity={0.7}
                    disabled={isSaving}
                    onPress={() => handleDeliverHere(address)}
                  >
                    {isSaving ? (
                      <ActivityIndicator color={Colors.primary} size="small" />
                    ) : (
                      <Text style={styles.deliverText}>
                        {address.defaultAddress ? 'DELIVERING HERE' : 'DELIVER HERE'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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

  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 24,
  },
  addNewText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
  },

  loader: {
    marginTop: 24,
  },
  errorBox: {
    alignItems: 'center',
    marginTop: 24,
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
  errorText: {
    fontSize: 13,
    color: '#C0392B',
    marginBottom: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },
  defaultBadge: {
    backgroundColor: '#E4F3E5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 0.4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 21,
    marginTop: 6,
  },
  deliverBtn: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 14,
    minWidth: 110,
    alignItems: 'center',
  },
  deliverText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';
import { AddressLabel, DeliveryLocation, useAddAddressMutation } from '../services/customerApi';
import { getCurrentDeliveryLocation } from '../utils/deviceLocation';
import { BackArrowIcon, BriefcaseIcon, HouseIcon, MapPinIcon } from '../components/Icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddAddress'>;

const SAVE_AS_OPTIONS: { key: AddressLabel; label: string; Icon: typeof HouseIcon; color: string }[] = [
  { key: 'HOME', label: 'Home', Icon: HouseIcon, color: Colors.primary },
  { key: 'WORK', label: 'Work', Icon: BriefcaseIcon, color: '#2C5C9E' },
  { key: 'OTHER', label: 'Other', Icon: MapPinIcon, color: '#C0392B' },
];

const REGION_DELTA = 0.01;

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AddAddressScreen({ navigation }: Props) {
  const [addAddress, { isLoading: isSaving }] = useAddAddressMutation();

  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [locateError, setLocateError] = useState('');
  const [saveError, setSaveError] = useState('');

  const [saveAs, setSaveAs] = useState<AddressLabel | null>(null);
  const [flatHouseNo, setFlatHouseNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentDeliveryLocation()
      .then(result => {
        if (cancelled) return;
        setLocation(result);
        setCity(prev => prev || result.city || '');
        setPinCode(prev => prev || result.postalCode || '');
      })
      .catch(() => {
        if (!cancelled) setLocateError('Could not detect your location. You can still fill the form manually.');
      })
      .finally(() => {
        if (!cancelled) setIsLocating(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChangeMapLocation = async () => {
    setLocateError('');
    setIsLocating(true);
    try {
      const result = await getCurrentDeliveryLocation();
      setLocation(result);
    } catch {
      setLocateError('Could not detect your location. Please try again.');
    } finally {
      setIsLocating(false);
    }
  };

  const errors = {
    saveAs: !saveAs,
    flatHouseNo: !flatHouseNo.trim(),
    street: !street.trim(),
    area: !area.trim(),
    city: !city.trim(),
    pinCode: !pinCode.trim(),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleBack = () => navigation.goBack();

  const handleSave = async () => {
    setSubmitted(true);
    setSaveError('');
    if (hasErrors || !saveAs) return;

    try {
      await addAddress({
        label: saveAs,
        flatNo: flatHouseNo.trim(),
        building: buildingName.trim() || undefined,
        street: street.trim(),
        area: area.trim(),
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        pinCode: pinCode.trim(),
        lat: location?.latitude,
        lng: location?.longitude,
      }).unwrap();
      navigation.goBack();
    } catch {
      setSaveError('Could not save this address. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Address</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.mapBox}>
            {location ? (
              <MapView
                style={styles.map}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: REGION_DELTA,
                  longitudeDelta: REGION_DELTA,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              />
            ) : (
              <View style={[styles.map, styles.mapLoading]}>
                <ActivityIndicator color={Colors.primary} size="large" />
              </View>
            )}
            <View style={styles.pinGroup} pointerEvents="none">
              <MapPinIcon size={40} color="#C0392B" />
            </View>
          </View>

          {locateError ? <Text style={styles.errorText}>{locateError}</Text> : null}

          <TouchableOpacity style={styles.changeMapBtn} activeOpacity={0.7} onPress={handleChangeMapLocation}>
            {isLocating ? (
              <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
              <>
                <MapPinIcon size={16} />
                <Text style={styles.changeMapText}>Change map location</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Save As</Text>
          <View style={styles.saveAsRow}>
            {SAVE_AS_OPTIONS.map(option => {
              const selected = saveAs === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.chip,
                    selected && { borderColor: option.color, backgroundColor: hexToRgba(option.color, 0.08) },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSaveAs(option.key)}
                >
                  <option.Icon size={18} color={option.color} />
                  <Text style={[styles.chipText, { color: option.color }]}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {submitted && errors.saveAs ? <Text style={styles.fieldError}>Please choose a label for this address.</Text> : null}

          <Field
            label="Flat / House No."
            required
            value={flatHouseNo}
            onChangeText={setFlatHouseNo}
            placeholder="Enter flat, house or apartment number"
            error={submitted && errors.flatHouseNo}
          />
          <Field
            label="Building Name"
            value={buildingName}
            onChangeText={setBuildingName}
            placeholder="Enter building or society name"
          />
          <Field
            label="Street"
            required
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street name"
            error={submitted && errors.street}
          />
          <Field
            label="Area / Locality"
            required
            value={area}
            onChangeText={setArea}
            placeholder="Enter area or locality"
            error={submitted && errors.area}
          />
          <Field
            label="Landmark (Optional)"
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Enter nearby landmark"
          />

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Field
                label="City"
                required
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
                error={submitted && errors.city}
              />
            </View>
            <View style={styles.rowField}>
              <Field
                label="Pin Code"
                required
                value={pinCode}
                onChangeText={setPinCode}
                placeholder="Enter pin code"
                keyboardType="number-pad"
                error={submitted && errors.pinCode}
              />
            </View>
          </View>

          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Address</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  error,
  ...inputProps
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={Colors.placeholder}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>This field is required.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
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
    paddingBottom: 32,
  },

  mapBox: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.line,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  mapLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEE6',
  },
  pinGroup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -40 }],
  },

  errorText: {
    fontSize: 13,
    color: '#C0392B',
    marginTop: 10,
  },

  changeMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 24,
  },
  changeMapText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 12,
  },
  saveAsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    paddingVertical: 14,
  },
  chipText: {
    fontSize: 14.5,
    fontWeight: '700',
  },

  field: {
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 8,
  },
  required: {
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.dark,
  },
  inputError: {
    borderColor: '#C0392B',
  },
  fieldError: {
    fontSize: 12,
    color: '#C0392B',
    marginTop: 6,
  },

  row: {
    flexDirection: 'row',
    gap: 14,
  },
  rowField: {
    flex: 1,
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

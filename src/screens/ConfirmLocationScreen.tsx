import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { AuthStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { setLocationSaved } from '../store/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmLocation'>;

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

function MapPinIcon({ size = 24, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <Circle cx={12} cy={9} r={2.5} fill="white" />
    </Svg>
  );
}

function CrosshairIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={Colors.dark} strokeWidth={2} />
      <Line x1={12} y1={2} x2={12} y2={7} stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
      <Line x1={12} y1={17} x2={12} y2={22} stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
      <Line x1={2} y1={12} x2={7} y2={12} stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
      <Line x1={17} y1={12} x2={22} y2={12} stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PencilIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill={Colors.muted}
      />
    </Svg>
  );
}

function InfoIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={Colors.primary} strokeWidth={2} />
      <Line x1={12} y1={11} x2={12} y2={17} stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={8} r={1} fill={Colors.dark} />
    </Svg>
  );
}

function ArrowRightIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="white">
      <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </Svg>
  );
}

function DragIllustration() {
  return (
    <Svg width={64} height={56} viewBox="0 0 64 56" fill="none">
      {/* Up arrow */}
      <Path d="M32 4L28 11H36L32 4Z" fill={Colors.muted} />
      <Line x1={32} y1={11} x2={32} y2={19} stroke={Colors.muted} strokeWidth={1.5} />
      {/* Left arrow */}
      <Path d="M4 32L11 28V36L4 32Z" fill={Colors.muted} />
      <Line x1={11} y1={32} x2={19} y2={32} stroke={Colors.muted} strokeWidth={1.5} />
      {/* Right arrow */}
      <Path d="M60 32L53 28V36L60 32Z" fill={Colors.muted} />
      <Line x1={53} y1={32} x2={45} y2={32} stroke={Colors.muted} strokeWidth={1.5} />
      {/* Center pin */}
      <Path
        d="M32 18C29.24 18 27 20.24 27 23C27 26.75 32 34 32 34S37 26.75 37 23C37 20.24 34.76 18 32 18Z"
        fill={Colors.primary}
      />
      <Circle cx={32} cy={23} r={2.2} fill="white" />
      {/* Pointing hand (simplified) */}
      <Path
        d="M38 36C38 36 40 37.5 40 40C40 42 38.5 43 36 43H28C27 43 26 42 26 41V38C26 37 26.5 36 28 36H29V33C29 32.45 29.45 32 30 32C30.55 32 31 32.45 31 33V36H32V34C32 33.45 32.45 33 33 33S34 33.45 34 34V36H35C35.55 36 36 36.45 36 37V37.5L38 36Z"
        fill="#D4A870"
        opacity={0.75}
      />
      {/* Down arrow — below the hand */}
      <Path d="M32 52L28 45H36L32 52Z" fill={Colors.muted} />
      <Line x1={32} y1={45} x2={32} y2={44} stroke={Colors.muted} strokeWidth={1.5} />
    </Svg>
  );
}

export default function ConfirmLocationScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const handleBack = () => navigation.goBack();
  const handleEdit = () => navigation.navigate('SearchLocation');
  const handleLocateMe = () => { /* re-centre to device GPS — requires expo-location */ };
  const handleConfirm = () => {
    dispatch(setLocationSaved());
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Location</Text>
        <View style={styles.headerEnd} />
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <Image
          source={require('../../assets/map_image.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Centred pin + ripple */}
        <View style={styles.pinGroup} pointerEvents="none">
          <MapPinIcon size={54} color={Colors.primary} />
          <View style={styles.pinRipple} />
        </View>

        {/* Locate-me FAB */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleLocateMe}>
          <CrosshairIcon />
        </TouchableOpacity>
      </View>

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        {/* Detected Location heading */}
        <View style={styles.detectedRow}>
          <MapPinIcon size={20} color={Colors.primary} />
          <Text style={styles.detectedTitle}>Detected Location</Text>
        </View>

        {/* Address + edit */}
        <View style={styles.addressRow}>
          <View style={styles.addressLines}>
            <Text style={styles.addressMain}>Saket, New Delhi 110017</Text>
            <Text style={styles.addressCountry}>India</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
            <PencilIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Not accurate hint */}
        <View style={styles.hintRow}>
          <View style={styles.infoCircle}>
            <InfoIcon />
          </View>
          <View style={styles.hintTexts}>
            <Text style={styles.hintTitle}>Not accurate?</Text>
            <Text style={styles.hintSub}>Drag the pin to adjust.</Text>
          </View>
          <DragIllustration />
        </View>

        {/* Confirm button */}
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Location</Text>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E0D8',
    top: 30,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },
  headerEnd: {
    width: 40,
  },

  // ── Map ─────────────────────────────────────────────────────────────────────
  mapWrapper: {
    flex: 1,
  },
  mapImage: {
    flex: 1,
    width: '100%',
  },
  pinGroup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    // shift so pin tip sits at the centre point
    transform: [{ translateX: -27 }, { translateY: -54 }],
  },
  pinRipple: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 86, 30, 0.18)',
    marginTop: -10,
  },
  fab: {
    position: 'absolute',
    bottom: 18,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },

  // ── Bottom card ─────────────────────────────────────────────────────────────
  bottomCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 14,
  },

  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detectedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressLines: {
    flex: 1,
  },
  addressMain: {
    fontSize: 15,
    color: Colors.muted,
    fontWeight: '500',
    lineHeight: 22,
  },
  addressCountry: {
    fontSize: 15,
    color: Colors.muted,
    fontWeight: '500',
  },
  editBtn: {
    padding: 4,
    marginTop: -2,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.line,
    marginBottom: 16,
  },

  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  infoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FBF0E4',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hintTexts: {
    flex: 1,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  hintSub: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },

  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

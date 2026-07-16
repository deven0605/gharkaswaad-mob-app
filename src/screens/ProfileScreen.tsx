import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { AuthStackParamList, HomeStackParamList, MainTabParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { useGetProfileQuery } from '../services/customerApi';
import {
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  MapPinIcon,
  HeartIcon,
  BellIcon,
  WalletIcon,
  TagIcon,
  HelpIcon,
  DocumentIcon,
  InfoIcon,
  LogoutIcon,
  ChevronRightIcon,
} from '../components/Icons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'ProfileTab'>,
  NativeStackScreenProps<HomeStackParamList>
>;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  return raw;
}

function AvatarPlaceholder() {
  return (
    <Svg width={110} height={110} viewBox="0 0 110 110">
      <Circle cx={55} cy={55} r={55} fill="#DCEFDD" />
      <Circle cx={55} cy={42} r={18} fill="#7CC47F" />
      <Ellipse cx={55} cy={94} rx={30} ry={24} fill="#7CC47F" />
    </Svg>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();

  const handleEditProfile = () => Alert.alert('Edit Profile', 'Editing your profile is coming soon.');
  const handleSavedAddresses = () => navigation.navigate('HomeTab', { screen: 'SelectAddress' });
  const handleFavourites = () => navigation.navigate('HomeTab', { screen: 'Favourites' });
  const handleNotifications = () => Alert.alert('Notification Settings', 'Notification preferences are coming soon.');
  const handleCoupons = () => Alert.alert('My Coupons', 'Available: THALI10 — 10% off your order.');
  const handleWallet = () => Alert.alert('Wallet', 'Wallet is coming soon.');
  const handleHelp = () => Alert.alert('Help & Support', 'Support is coming soon. Reach us at help@thalicloud.example.');
  const handleTerms = () => Alert.alert('Terms & Privacy', 'Terms of service and privacy policy are coming soon.');
  const handleAbout = () => Alert.alert('About ThaliCloud', 'ThaliCloud v1.0.0\nHome-style meal delivery.');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation
            .getParent<NativeStackNavigationProp<AuthStackParamList>>()
            ?.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  };

  const MENU_ITEMS = [
    { key: 'addresses', label: 'Saved Addresses', Icon: MapPinIcon, color: '#3F9142', onPress: handleSavedAddresses },
    { key: 'favourites', label: 'Favourites', Icon: HeartIcon, color: '#E53935', onPress: handleFavourites },
    { key: 'wallet', label: 'Wallet', Icon: WalletIcon, color: '#2E7D32', onPress: handleWallet },
    { key: 'notifications', label: 'Notification Settings', Icon: BellIcon, color: '#E8A33D', onPress: handleNotifications },
    { key: 'coupons', label: 'My Coupons', Icon: TagIcon, color: '#8E5FD9', onPress: handleCoupons },
    { key: 'help', label: 'Help & Support', Icon: HelpIcon, color: '#3B7DD8', onPress: handleHelp },
    { key: 'terms', label: 'Terms & Privacy', Icon: DocumentIcon, color: '#1E9E8A', onPress: handleTerms },
    { key: 'about', label: 'About ThaliCloud', Icon: InfoIcon, color: Colors.muted, onPress: handleAbout },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          {profile?.profilePicUrl ? (
            <Image source={{ uri: profile.profilePicUrl }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <AvatarPlaceholder />
          )}

          {isLoading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : isError ? (
            <View style={styles.errorBox}>
              <Text style={styles.emptyText}>Couldn't load your profile.</Text>
              <TouchableOpacity style={styles.retryBtn} activeOpacity={0.7} onPress={refetch}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{profile?.fullName}</Text>
              <View style={styles.contactRow}>
                <PhoneIcon size={16} />
                <Text style={styles.contactText}>{formatPhone(profile?.mobileNumber ?? '')}</Text>
              </View>
              <View style={styles.contactRow}>
                <EnvelopeIcon size={16} color={Colors.muted} />
                <Text style={styles.contactText}>{profile?.email}</Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={handleEditProfile}>
            <PencilIcon size={16} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuRow, index === MENU_ITEMS.length - 1 && styles.menuRowLast]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <item.Icon size={24} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={handleLogout}>
          <LogoutIcon size={18} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E8E0D8',
  },
  loader: {
    marginTop: 16,
  },
  errorBox: {
    alignItems: 'center',
    marginTop: 16,
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
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark,
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  contactText: {
    fontSize: 15,
    color: Colors.muted,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#3F9142',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 18,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3F9142',
  },

  menuCard: {
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    marginTop: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.line,
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
    fontWeight: '500',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#C0392B',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C0392B',
  },
});

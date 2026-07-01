import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { bgSource } from '../theme/assets';
import { commonStyles } from '../theme/styles';
import BrandLogo from '../components/BrandLogo';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPermission'>;

function LocationPinIcon({ size = 22, color = 'white' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </Svg>
  );
}

function MapFoldIcon({ size = 22, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
    </Svg>
  );
}

function ShieldCheckIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </Svg>
  );
}


export default function LocationPermissionScreen({ navigation }: Props) {
  const handleUseLocation = () => {
    navigation.navigate('ConfirmLocation', {});
  };

  const handleEnterManually = () => {
    navigation.navigate('SearchLocation');
  };

  return (
    <ImageBackground source={bgSource} style={commonStyles.root} resizeMode="cover">
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <BrandLogo />

          <View style={styles.illustrationWrap}>
            <Image
              source={require('../../assets/map_image.png')}
              style={styles.mapImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textSection}>
            <Text style={styles.titleDark}>Find Kitchens</Text>
            <Text style={styles.titleOrange}>Near You</Text>
            <Text style={styles.description}>
              Allow GharKaSwaad to access your location to show nearby kitchens.
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleUseLocation}
            >
              <LocationPinIcon size={22} color="white" />
              <Text style={styles.primaryBtnText}>Use My Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={handleEnterManually}
            >
              <MapFoldIcon size={22} color={Colors.primary} />
              <Text style={styles.secondaryBtnText}>Enter Manually</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyRow}>
            <ShieldCheckIcon size={16} color={Colors.primary} />
            <Text style={styles.privacyText}>Your location is safe with us.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 36,
  },

  illustrationWrap: {
    alignItems: 'center',
    marginTop: -30,
    paddingHorizontal: 20,
  },
  mapImage: {
    width: '100%',
    height: 240,
  },

  textSection: {
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 32,
  },
  titleDark: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.dark,
    lineHeight: 36,
  },
  titleOrange: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 40,
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
  },

  buttons: {
    marginTop: 30,
    paddingHorizontal: 22,
    gap: 14,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    gap: 6,
  },
  privacyText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '500',
  },
});

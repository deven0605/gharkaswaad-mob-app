import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { bgSource } from '../theme/assets';
import { commonStyles, SW } from '../theme/styles';
import BrandLogo from '../components/BrandLogo';

function ShieldCheckIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5.5V11C4 15.55 7.41 19.74 12 21C16.59 19.74 20 15.55 20 11V5.5L12 2Z"
        fill={Colors.primary}
      />
      <Path
        d="M9 12L11 14L15 10"
        stroke={Colors.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');

  return (
    <ImageBackground source={bgSource} style={commonStyles.root} resizeMode="cover">
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.safe}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Logo + brand */}
        <BrandLogo />

        {/* Welcome heading */}
        <View style={styles.headingSection}>
          <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
          <Text style={styles.welcomeSub}>Enter your mobile number</Text>
        </View>

        {/* Phone input */}
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.countryPicker} activeOpacity={0.7}>
            <Text style={styles.countryCode}>+91</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.phoneField}
            placeholder="9876543210"
            placeholderTextColor={Colors.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* OTP notice */}
        <View style={styles.otpNotice}>
          <ShieldCheckIcon />
          <Text style={styles.otpNoticeText}>
            We'll send you an OTP to{'\n'}verify your number
          </Text>
        </View>

        <View style={commonStyles.spacer} />

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.sendOtpBtn} activeOpacity={0.85}>
            <Text style={styles.sendOtpBtnText}>Send OTP</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.termsText}>
            By continuing you agree{'\n'}to{' '}
            <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
          </Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginTop: 10,
    marginLeft: 18,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: Colors.dark,
    fontWeight: '600',
  },

  headingSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 18,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 14.5,
    color: Colors.muted,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderRadius: 14,
    backgroundColor: Colors.white,
    height: 58,
    paddingHorizontal: 14,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginRight: 3,
  },
  chevron: {
    fontSize: 13,
    color: Colors.dark,
    lineHeight: 18,
  },
  inputDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E0C9B4',
    marginRight: 12,
  },
  phoneField: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },

  otpNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 22,
    marginTop: 14,
    gap: 10,
  },
  otpNoticeText: {
    fontSize: 13.5,
    color: Colors.muted,
    lineHeight: 20,
    marginTop: 2,
  },

  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 36,
    top: -100,
  },
  sendOtpBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  sendOtpBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.line,
  },
  orText: {
    marginHorizontal: 14,
    color: Colors.orText,
    fontSize: 13,
    fontWeight: '500',
  },

  termsText: {
    textAlign: 'center',
    fontSize: 13.5,
    color: Colors.muted,
    lineHeight: 21,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

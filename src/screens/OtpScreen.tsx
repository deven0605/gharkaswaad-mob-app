import React, { useState, useRef, useEffect } from 'react';
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
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { bgSource } from '../theme/assets';
import { commonStyles, SW } from '../theme/styles';
import BrandLogo from '../components/BrandLogo';

function ClockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={Colors.primary} strokeWidth={2} />
      <Path
        d="M12 7V12L15 14"
        stroke={Colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;
const BOX_SIZE = Math.floor((SW - 80) / 4);

export default function OtpScreen({ navigation, route }: any) {
  const phone = route?.params?.phone ?? '+91 98765 43210';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (text: string, idx: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (seconds > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setSeconds(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
  };

  const canVerify = otp.every(d => d !== '');
  const timerStr = `00:${String(seconds).padStart(2, '0')}`;

  return (
    <ImageBackground source={bgSource} style={commonStyles.root} resizeMode="cover">
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.safe}>

        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <BrandLogo />

        <View style={styles.headingSection}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Sent to <Text style={styles.phone}>{phone}</Text>
          </Text>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={ref => { inputRefs.current[idx] = ref; }}
              style={styles.otpBox}
              value={digit}
              onChangeText={text => handleChange(text, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={Colors.primary}
            />
          ))}
        </View>

        <View style={styles.timerRow}>
          <ClockIcon />
          <Text style={styles.timerText}>
            {'  '}Resend OTP in <Text style={styles.timerHighlight}>{timerStr}</Text>
          </Text>
        </View>

        <View style={commonStyles.spacer} />

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.verifyBtn, !canVerify && styles.verifyBtnDisabled]}
            activeOpacity={0.85}
            disabled={!canVerify}
          >
            <Text style={styles.verifyBtnText}>Verify</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.resendLabel}>Didn't receive OTP?</Text>

          <TouchableOpacity
            style={[styles.resendBtn, seconds > 0 && styles.resendBtnDisabled]}
            activeOpacity={seconds > 0 ? 1 : 0.75}
            onPress={handleResend}
            disabled={seconds > 0}
          >
            <Text style={[styles.resendBtnText, seconds > 0 && styles.resendBtnTextDisabled]}>
              {seconds > 0 ? 'Resend (disabled)' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
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
    marginTop: -46,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  phone: {
    color: Colors.primary,
    fontWeight: '600',
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginHorizontal: 22,
    marginBottom: 20,
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    backgroundColor: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
  },

  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 14,
    color: Colors.muted,
  },
  timerHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },

  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 36,
    top: -30,
  },
  verifyBtn: {
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
  verifyBtnDisabled: {
    opacity: 0.6,
  },
  verifyBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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

  resendLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 12,
  },
  resendBtn: {
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resendBtnDisabled: {
    backgroundColor: '#E8DDD4',
    shadowOpacity: 0,
    elevation: 0,
  },
  resendBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  resendBtnTextDisabled: {
    color: Colors.muted,
  },
});

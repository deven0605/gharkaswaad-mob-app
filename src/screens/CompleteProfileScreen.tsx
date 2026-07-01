import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { bgSource } from '../theme/assets';
import { commonStyles, SW } from '../theme/styles';
import BrandLogo from '../components/BrandLogo';
import { AuthStackParamList } from '../navigation/types';
import { useCreateProfileMutation } from '../services/customerApi';

type Props = NativeStackScreenProps<AuthStackParamList, 'CompleteProfile'>;

const AVATAR_SIZE = Math.floor(SW * 0.36);

function PersonIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.placeholder}>
      <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </Svg>
  );
}

function EnvelopeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.placeholder}>
      <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={Colors.white}>
      <Path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </Svg>
  );
}

function AvatarPicker({ onPress }: { onPress?: () => void }) {
  const R = AVATAR_SIZE / 2;
  const SIZE = AVATAR_SIZE + 6;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const headR = R * 0.28;
  const headY = cy - R * 0.2;
  const bodyY = cy + R * 0.52;

  return (
    <View style={styles.avatarOuter}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={cx}
          cy={cy}
          r={R}
          fill="#F0E6DC"
          stroke="#C8A07A"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <Circle cx={cx} cy={headY} r={headR} fill="#D5C2B0" />
        <Ellipse cx={cx} cy={bodyY} rx={headR * 1.55} ry={headR * 1.15} fill="#D5C2B0" />
      </Svg>
      <TouchableOpacity style={styles.cameraBadge} onPress={onPress} activeOpacity={0.8}>
        <CameraIcon />
      </TouchableOpacity>
    </View>
  );
}

export default function CompleteProfileScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createProfile, { isLoading, error }] = useCreateProfileMutation();

  const canSave = name.trim().length > 0 && email.trim().length > 0;

  const handleSave = async () => {
    await createProfile({ fullName: name.trim(), email: email.trim() }).unwrap();
    navigation.navigate('LocationPermission');
  };

  return (
    <ImageBackground source={bgSource} style={commonStyles.root} resizeMode="cover">
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.goBack?.()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <BrandLogo />

            <View style={styles.progressSection}>
              <Text style={styles.stepLabel}>Step 1 of 1</Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressDot} />
                <View style={styles.progressLine} />
              </View>
            </View>

            <View style={styles.headingSection}>
              <Text style={styles.title}>Complete Profile</Text>
              <Text style={styles.subtitle}>Tell us a bit about you</Text>
            </View>

            <View style={styles.avatarSection}>
              <AvatarPicker />
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>
                Full Name <Text style={styles.req}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputIcon}>
                  <PersonIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Devendra Lokhande"
                  placeholderTextColor={Colors.placeholder}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <Text style={[styles.label, styles.labelTop]}>
                Email Address <Text style={styles.req}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputIcon}>
                  <EnvelopeIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="dev@example.com"
                  placeholderTextColor={Colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={{ flex: 1, minHeight: 28 }} />

            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[styles.saveBtn, (!canSave || isLoading) && styles.saveBtnOff]}
                activeOpacity={0.85}
                disabled={!canSave || isLoading}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>{isLoading ? 'Saving…' : 'Save & Continue'}</Text>
                <Text style={styles.saveBtnArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

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

  progressSection: {
    alignItems: 'center',
    marginTop: -50,
    marginHorizontal: 24,
    marginBottom: 14,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    marginLeft: -2,
  },

  headingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 5,
  },
  avatarOuter: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  form: {
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 8,
  },
  labelTop: {
    marginTop: 16,
  },
  req: {
    color: Colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },

  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnOff: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginRight: 10,
  },
  saveBtnArrow: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
});

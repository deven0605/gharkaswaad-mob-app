import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import { bgSource, foodLeafSource } from '../theme/assets';
import { commonStyles, SW } from '../theme/styles';
import BrandLogo from '../components/BrandLogo';

export default function WelcomeScreen() {
  return (
    <ImageBackground source={bgSource} style={commonStyles.root} resizeMode="cover">
      <StatusBar style="light" />
      <SafeAreaView style={commonStyles.safe}>
        <BrandLogo />
        <View style={styles.foodLeafContainer}>
          <Image source={foodLeafSource} style={styles.foodLeaf} resizeMode="contain" />
        </View>
        <View style={commonStyles.spacer} />
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.getStartedBtn} activeOpacity={0.82}>
            <Text style={styles.getStartedBtnText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.72}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  foodLeafContainer: {
    alignItems: 'center',
  },
  foodLeaf: {
    width: SW * 0.99,
    height: SW * 0.99,
    position: 'absolute',
  },

  buttons: {
    paddingHorizontal: 32,
    paddingBottom: 35,
    paddingTop: 24,
    alignItems: 'center',
  },

  getStartedBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 26,
    paddingVertical: 15,
    width: '85%',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  alreadyText: {
    color: '#a13737',
    fontSize: 13.5,
    letterSpacing: 0.25,
    marginBottom: 12,
  },

  loginBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 26,
    paddingHorizontal: 52,
    paddingVertical: 13,
  },
  loginBtnText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

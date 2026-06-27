import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { logoSource, khaneKaSwaadSource } from '../theme/assets';
import { SW } from '../theme/styles';

interface Props {
  /** compact=true stacks tagline below logo (LoginScreen); false overlays it (WelcomeScreen) */
  compact?: boolean;
}

export default function BrandLogo({ compact = false }: Props) {
  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      <Image
        source={khaneKaSwaadSource}
        style={compact ? styles.taglineCompact : styles.taglineOverlay}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: -50,
  },
  logo: {
    width: SW * 0.80,
    height: SW * 0.80,
  },
  taglineOverlay: {
    width: SW * 0.70,
    height: SW * 0.20,
    marginTop: 167,
    opacity: 0.9,
    position: 'absolute',
  },
  taglineCompact: {
    width: SW * 0.64,
    height: SW * 0.20,
    marginTop: 4,
  },
});

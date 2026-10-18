import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const StatCard = ({ title, value, subtitle, icon, onPress, variant = 'blue', isAlert }) => {
  // Variant color definitions: Blue (Emanet), Purple (Alacak), Red (Geciken)
  const getTheme = () => {
    if (isAlert || variant === 'red') {
      return {
        bg: '#FFFFFF',
        borderColor: THEME.colors.dangerBorder,
        topBar: THEME.colors.danger,
        iconBg: THEME.colors.dangerBg,
        iconColor: THEME.colors.danger,
        valColor: THEME.colors.danger,
      };
    }
    if (variant === 'purple') {
      return {
        bg: '#FFFFFF',
        borderColor: THEME.colors.purpleBorder,
        topBar: THEME.colors.purple,
        iconBg: THEME.colors.purpleBg,
        iconColor: THEME.colors.purple,
        valColor: THEME.colors.purpleDark,
      };
    }
    // Default blue (Emanet)
    return {
      bg: '#FFFFFF',
      borderColor: THEME.colors.blueBorder,
      topBar: THEME.colors.blue,
      iconBg: THEME.colors.blueBg,
      iconColor: THEME.colors.blue,
      valColor: THEME.colors.blueDark,
    };
  };

  const currentTheme = getTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: currentTheme.borderColor,
          backgroundColor: currentTheme.bg,
        },
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={[styles.colorStripe, { backgroundColor: currentTheme.topBar }]} />

      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={[styles.iconWrapper, { backgroundColor: currentTheme.iconBg }]}>
          <MaterialCommunityIcons
            name={icon}
            size={14}
            color={currentTheme.iconColor}
          />
        </View>
      </View>

      <Text style={[styles.value, { color: currentTheme.valColor }]} numberOfLines={1}>
        {value}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    borderWidth: 1.5,
    minWidth: 98,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  colorStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    letterSpacing: -0.2,
    flex: 1,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: THEME.borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const StatCard = ({ title, value, subtitle, icon, onPress, isAlert }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isAlert && styles.alertCard,
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={isAlert ? THEME.colors.danger : THEME.colors.textMuted}
        />
      </View>
      <Text style={[styles.value, isAlert && styles.alertValue]} numberOfLines={1}>
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
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minWidth: 95,
  },
  alertCard: {
    borderColor: THEME.colors.dangerBorder,
    backgroundColor: THEME.colors.dangerBg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    letterSpacing: -0.2,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  alertValue: {
    color: THEME.colors.danger,
  },
  subtitle: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
});

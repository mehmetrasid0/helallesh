import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { resetToDefaults, stats } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="scale-balance" size={24} color="#6366F1" />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>helallesh</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>BETA v1.0</Text>
            </View>
          </View>
          <Text style={styles.tagline}>Agalar Arası Emanet & Borç Adalet Asistanı</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => {
          if (confirm('Örnek veriler sıfırlansın mı?')) {
            resetToDefaults();
          }
        }}
        accessibilityLabel="Verileri Yenile"
      >
        <MaterialCommunityIcons name="refresh" size={20} color={THEME.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: THEME.colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pillBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  pillText: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  resetButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

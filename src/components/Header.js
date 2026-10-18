import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { resetToDefaults } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="scale-balance" size={20} color={THEME.colors.primary} />
        </View>
        <View>
          <Text style={styles.brandTitle}>helallesh</Text>
          <Text style={styles.brandSubtitle}>Emanet & Hesap Takibi</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={() => {
          if (confirm('Varsayılan veriler yenilensin mi?')) {
            resetToDefaults();
          }
        }}
        accessibilityLabel="Yenile"
      >
        <MaterialCommunityIcons name="refresh" size={18} color={THEME.colors.textSecondary} />
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
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
    marginTop: -1,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

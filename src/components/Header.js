import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { resetToDefaults, stats } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="scale-balance" size={20} color="#38BDF8" />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>helallesh</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Canlı</Text>
            </View>
          </View>
          <Text style={styles.brandSubtitle}>Emanet & Ortak Hesap Takibi</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {stats.overdueCount > 0 && (
          <View style={styles.alertPill}>
            <MaterialCommunityIcons name="alert-circle" size={13} color="#FFFFFF" />
            <Text style={styles.alertPillText}>{stats.overdueCount} Gecikme</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => {
            if (confirm('Varsayılan örnek veriler geri yüklensin mi?')) {
              resetToDefaults();
            }
          }}
          accessibilityLabel="Yenile"
        >
          <MaterialCommunityIcons name="refresh" size={17} color="#94A3B8" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34D399',
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  alertPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
});

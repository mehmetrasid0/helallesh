import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export const StatsScreen = () => {
  const { stats, friends, items } = useApp();

  const sorted = [...friends].sort((a, b) => b.score - a.score);
  const bestFriend = sorted[0];
  const riskyFriend = sorted[sorted.length - 1];

  const totalRecords = items.length;
  const successRate = totalRecords > 0 
    ? Math.round((stats.totalResolvedCount / totalRecords) * 100) 
    : 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Genel Özet & Rapor</Text>
        <Text style={styles.headerSubtitle}>Emanet ve borç istatistikleri</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Metric Cards Row */}
        <View style={styles.metricsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Başarı Oranı</Text>
            <Text style={styles.statNumber}>%{successRate}</Text>
            <Text style={styles.statSub}>{stats.totalResolvedCount} / {totalRecords} kayıt kapandı</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Kurtarılan Para</Text>
            <Text style={[styles.statNumber, { color: THEME.colors.success }]}>
              {formatCurrency(stats.totalRecoveredMoney)}
            </Text>
            <Text style={styles.statSub}>Tahsil edilen toplam</Text>
          </View>
        </View>

        {/* Highlighted Friends (Best & Risky) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Güvenilirlik Dengesi</Text>

          {bestFriend && (
            <View style={styles.personCard}>
              <View style={[styles.iconSquare, { backgroundColor: THEME.colors.successBg }]}>
                <MaterialCommunityIcons name="check-decagram-outline" size={18} color={THEME.colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTag}>En Yüksek Sadakat Puanı</Text>
                <Text style={styles.cardName}>{bestFriend.name}</Text>
                <Text style={styles.cardScore}>Skor: {bestFriend.score}/100 • Kayıtları vaktinde kapatır</Text>
              </View>
            </View>
          )}

          {riskyFriend && (
            <View style={styles.personCard}>
              <View style={[styles.iconSquare, { backgroundColor: THEME.colors.warningBg }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={THEME.colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTag, { color: THEME.colors.warning }]}>Takip Gerektiren</Text>
                <Text style={styles.cardName}>{riskyFriend.name}</Text>
                <Text style={styles.cardScore}>Skor: {riskyFriend.score}/100 • İadeler gecikmeye yatkın</Text>
              </View>
            </View>
          )}
        </View>

        {/* Insight Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriye Göre İade Eğilimleri</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Giyim & Sweatshirt</Text>
                <Text style={styles.insightVal}>%45 geri dönüş</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '45%', backgroundColor: THEME.colors.warning }]} />
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Elektronik & Şarj Cihazları</Text>
                <Text style={styles.insightVal}>%65 geri dönüş</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '65%', backgroundColor: THEME.colors.accent }]} />
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Yemek & Taksi Payı</Text>
                <Text style={styles.insightVal}>%80 geri dönüş</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '80%', backgroundColor: THEME.colors.success }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Academic Project Info Box */}
        <View style={styles.academicCard}>
          <Text style={styles.academicHeader}>Proje Bilgileri</Text>
          <Text style={styles.academicRow}>
            • <Text style={styles.bold}>Uygulama:</Text> Helallesh (v1.0.0)
          </Text>
          <Text style={styles.academicRow}>
            • <Text style={styles.bold}>Mimari:</Text> React Native, Context API, AsyncStorage
          </Text>
          <Text style={styles.academicRow}>
            • <Text style={styles.bold}>Ders:</Text> Mobil Uygulama Geliştirme Final Projesi
          </Text>
          <Text style={styles.academicRow}>
            • <Text style={styles.bold}>Hedef Kitle:</Text> Öğrenci evleri, kampüs ve arkadaş çevreleri
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
  },
  headerRow: {
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  statSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 1,
  },
  cardScore: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  insightCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  insightVal: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  track: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.surfaceSubtle,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2.5,
  },
  academicCard: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 4,
  },
  academicHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  academicRow: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 3,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
});

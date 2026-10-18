import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export const StatsScreen = () => {
  const { stats, friends, items, resetToDefaults } = useApp();

  // Find best and worst friends
  const sorted = [...friends].sort((a, b) => b.score - a.score);
  const bestFriend = sorted[0];
  const riskyFriend = sorted[sorted.length - 1];

  // Success rate
  const totalRecords = items.length;
  const successRate = totalRecords > 0 
    ? Math.round((stats.totalResolvedCount / totalRecords) * 100) 
    : 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Helallesh Raporu 📊</Text>
        <Text style={styles.headerSubtitle}>Agalar arası adalet ve helallik bilançosu</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Success Hero Card */}
        <View style={styles.heroMetricCard}>
          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons name="trophy-award" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.heroPercent}>%{successRate}</Text>
          <Text style={styles.heroLabel}>Genel Helalleşme Başarı Oranı</Text>
          <Text style={styles.heroDesc}>
            {stats.totalResolvedCount} emanet ve borç sağ salim kapatıldı, {stats.activeCount} işlem takip altında.
          </Text>
        </View>

        {/* Financial Balance Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Kurtarılan Para</Text>
            <Text style={[styles.summaryValue, { color: THEME.colors.emerald }]}>
              {formatCurrency(stats.totalRecoveredMoney)}
            </Text>
            <Text style={styles.summarySub}>Tahsil edilen tutar</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Bekleyen Alacak</Text>
            <Text style={[styles.summaryValue, { color: THEME.colors.amber }]}>
              {formatCurrency(stats.totalReceivable)}
            </Text>
            <Text style={styles.summarySub}>Agaların üstündeki</Text>
          </View>
        </View>

        {/* Awards: Ayın Kankası & Ayın Çökücüsü */}
        <View style={styles.awardsSection}>
          <Text style={styles.sectionHeader}>Agalar Onur & Ceza Kürsüsü</Text>

          {bestFriend && (
            <View style={styles.awardCard}>
              <View style={[styles.awardIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={{ fontSize: 24 }}>👑</Text>
              </View>
              <View style={styles.awardDetails}>
                <Text style={styles.awardTag}>Ayın En Güvenilir Kankası</Text>
                <Text style={styles.awardName}>{bestFriend.name}</Text>
                <Text style={styles.awardScore}>Skor: {bestFriend.score}/100 • Her şeyi gününde getirir</Text>
              </View>
            </View>
          )}

          {riskyFriend && (
            <View style={[styles.awardCard, styles.riskyAwardCard]}>
              <View style={[styles.awardIcon, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
                <Text style={{ fontSize: 24 }}>🚨</Text>
              </View>
              <View style={styles.awardDetails}>
                <Text style={[styles.awardTag, { color: THEME.colors.rose }]}>Ayın Zula & Çöküş Adayı</Text>
                <Text style={styles.awardName}>{riskyFriend.name}</Text>
                <Text style={styles.awardScore}>Skor: {riskyFriend.score}/100 • Emanet verirken iki kere düşün</Text>
              </View>
            </View>
          )}
        </View>

        {/* Category Breakdown Mock Insights */}
        <View style={styles.insightBox}>
          <Text style={styles.sectionHeader}>En Çok Çökülenler Endeksi 📈</Text>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>1. Kıyafet & Sweatshirt (Geri dönme şansı %45)</Text>
            <View style={[styles.insightBar, { width: '80%', backgroundColor: THEME.colors.amber }]} />
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>2. Şarj Aleti & Adaptör (Geri dönme şansı %35)</Text>
            <View style={[styles.insightBar, { width: '65%', backgroundColor: THEME.colors.primary }]} />
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>3. Taksi & Döner Hesabı (Geri dönme şansı %55)</Text>
            <View style={[styles.insightBar, { width: '50%', backgroundColor: THEME.colors.emerald }]} />
          </View>
        </View>

        {/* Academic Project Info Card */}
        <View style={styles.projectInfoCard}>
          <View style={styles.academicRow}>
            <MaterialCommunityIcons name="school" size={20} color={THEME.colors.primaryLight} />
            <Text style={styles.academicTitle}>Proje Künyesi & Değerlendirme</Text>
          </View>
          <Text style={styles.projectDetailText}>
            • <Text style={styles.boldText}>Uygulama Adı:</Text> Helallesh v1.0
          </Text>
          <Text style={styles.projectDetailText}>
            • <Text style={styles.boldText}>Tech Stack:</Text> React Native, Expo, AsyncStorage, Vector Icons
          </Text>
          <Text style={styles.projectDetailText}>
            • <Text style={styles.boldText}>Mimarisi:</Text> MVVM / Context Pattern, Persistent Storage
          </Text>
          <Text style={styles.projectDetailText}>
            • <Text style={styles.boldText}>Git Version Control:</Text> Modüler ve düzenli commit geçmişi
          </Text>
          <Text style={styles.projectDetailText}>
            • <Text style={styles.boldText}>Hedef Kitle:</Text> Arkadaş grupları, üniversite öğrencileri, ortak ev arkadaşları
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
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroMetricCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroPercent: {
    fontSize: 38,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: THEME.spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 4,
  },
  summarySub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  awardsSection: {
    marginBottom: THEME.spacing.md,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  awardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 10,
  },
  riskyAwardCard: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  awardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  awardDetails: {
    flex: 1,
  },
  awardTag: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.emerald,
    textTransform: 'uppercase',
  },
  awardName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 1,
  },
  awardScore: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  insightBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  insightRow: {
    marginBottom: 10,
  },
  insightLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  insightBar: {
    height: 6,
    borderRadius: 3,
  },
  projectInfoCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 10,
  },
  academicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primaryLight,
  },
  projectDetailText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  boldText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
});

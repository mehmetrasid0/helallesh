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
            <Text style={[styles.statNumber, { color: THEME.colors.blue }]}>%{successRate}</Text>
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
          <Text style={styles.sectionTitle}>GÜVENİLİRLİK DENGESİ</Text>

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
              <View style={[styles.iconSquare, { backgroundColor: THEME.colors.dangerBg }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={THEME.colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTag, { color: THEME.colors.danger }]}>Takip Gerektiren</Text>
                <Text style={styles.cardName}>{riskyFriend.name}</Text>
                <Text style={styles.cardScore}>Skor: {riskyFriend.score}/100 • İadeler gecikmeye yatkın</Text>
              </View>
            </View>
          )}
        </View>

        {/* Insight Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KATEGORİYE GÖRE İADE EĞİLİMLERİ</Text>
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
                <View style={[styles.fill, { width: '65%', backgroundColor: THEME.colors.blue }]} />
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Ortak Yemek & Adisyon</Text>
                <Text style={styles.insightVal}>%85 geri dönüş</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '85%', backgroundColor: THEME.colors.purple }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Academic Project Info Card */}
        <View style={styles.academicCard}>
          <Text style={styles.academicBadge}>MOBİL UYGULAMA GELİŞTİRME FİNAL PROJESİ</Text>
          <Text style={styles.academicTitle}>Helallesh: Emanet ve Ortak Harcama Takip Sistemi</Text>
          <Text style={styles.academicDesc}>
            React Native & Expo mimarisiyle, merkezi durum yönetimi (Context API), kalıcı yerel veritabanı (AsyncStorage), kanıt görseli yönetimi (ImagePicker) ve kademeli tebligat motoru ile geliştirilmiştir.
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
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 17,
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
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  statSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.successDark,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: 1,
  },
  cardScore: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  insightCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
  },
  insightItem: {
    gap: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  insightVal: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  academicCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 6,
  },
  academicBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.blue,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  academicDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
});

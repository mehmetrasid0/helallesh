import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { ItemCard } from '../components/ItemCard';
import { formatCurrency } from '../utils/helpers';

export const DashboardScreen = () => {
  const {
    items,
    stats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    setCurrentScreen,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.friendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return !item.isResolved;
    if (activeFilter === 'receivable') return !item.isResolved && item.type === 'debt' && item.direction !== 'borrowed';
    if (activeFilter === 'payable') return !item.isResolved && item.type === 'debt' && item.direction === 'borrowed';
    if (activeFilter === 'item') return !item.isResolved && item.type === 'item';
    if (activeFilter === 'overdue') return !item.isResolved && item.dueDate && item.dueDate < todayStr;
    if (activeFilter === 'resolved') return item.isResolved;

    return true;
  });

  const filterTabs = [
    { key: 'all', label: 'Tümü', count: stats.activeCount, color: THEME.colors.primary },
    { key: 'receivable', label: 'Alacaklarım', count: items.filter(it => !it.isResolved && it.type === 'debt' && it.direction !== 'borrowed').length, color: THEME.colors.purple },
    { key: 'payable', label: 'Borçlarım', count: items.filter(it => !it.isResolved && it.type === 'debt' && it.direction === 'borrowed').length, color: '#EA580C' },
    { key: 'item', label: 'Emanetler', count: stats.totalActiveLoansCount, color: THEME.colors.blue },
    { key: 'overdue', label: 'Gecikenler', count: stats.overdueCount, color: THEME.colors.danger, isAlert: true },
    { key: 'resolved', label: 'Helalleşilen', count: stats.totalResolvedCount, color: THEME.colors.success },
  ];

  return (
    <View style={styles.container}>
      {/* Net Balance & Summary Hero Banner */}
      <View style={styles.netBanner}>
        <View style={styles.netLeft}>
          <Text style={styles.netSub}>GENEL HESAP DENGESİ</Text>
          <View style={styles.netAmountRow}>
            <Text
              style={[
                styles.netAmount,
                { color: stats.netBalance >= 0 ? '#10B981' : '#F87171' },
              ]}
            >
              {stats.netBalance >= 0 ? `+${formatCurrency(stats.netBalance)}` : formatCurrency(stats.netBalance)}
            </Text>
            <View
              style={[
                styles.netPill,
                { backgroundColor: stats.netBalance >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' },
              ]}
            >
              <Text
                style={[
                  styles.netPillText,
                  { color: stats.netBalance >= 0 ? '#34D399' : '#FCA5A5' },
                ]}
              >
                {stats.netBalance >= 0 ? 'Agalar Sana Borçlu' : 'Agalara Borcun Var'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.quickAddBtn}
          onPress={() => setCurrentScreen('add')}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.quickAddText}>Kayıt</Text>
        </TouchableOpacity>
      </View>

      {/* Two-Way Stat Cards Row */}
      <View style={styles.metricsRow}>
        <StatCard
          title="Alacağım"
          value={formatCurrency(stats.totalReceivable)}
          subtitle="Agalardan gelecek"
          icon="arrow-bottom-left"
          variant="purple"
          onPress={() => setActiveFilter('receivable')}
        />
        <StatCard
          title="Borcum"
          value={formatCurrency(stats.totalPayable)}
          subtitle="Benim ödeyeceğim"
          icon="arrow-top-right"
          variant="red"
          isAlert={stats.totalPayable > 0}
          onPress={() => setActiveFilter('payable')}
        />
        <StatCard
          title="Emanetler"
          value={`${stats.lentItemsCount} Verdim`}
          subtitle={`${stats.borrowedItemsCount} adet bende`}
          icon="package-variant"
          variant="blue"
          onPress={() => setActiveFilter('item')}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={19} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara: kişi, eşya, borç, fiş..."
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={17} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterTab,
                  isActive && {
                    backgroundColor: tab.color,
                    borderColor: tab.color,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.activeFilterTabText,
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    isActive && styles.activeCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isActive && { color: tab.color, fontWeight: '800' },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="scale-balance" size={34} color={THEME.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Kayıt bulunamadı</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'Aramanıza uygun bir kayıt eşleşmedi.'
                : 'Bu filtrede bekleyen herhangi bir alacak veya borç bulunmuyor.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => setCurrentScreen('add')}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.emptyActionText}>Yeni Kayıt Ekle</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  netBanner: {
    backgroundColor: '#0F172A',
    marginHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
    padding: 14,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  netLeft: {
    flex: 1,
  },
  netSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  netAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  netAmount: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  netPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  netPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.md,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    padding: 0,
    outlineStyle: 'none',
  },
  filterContainer: {
    paddingVertical: 9,
  },
  filterScroll: {
    paddingHorizontal: THEME.spacing.md,
    gap: 6,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  activeFilterTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: '#FFFFFF',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

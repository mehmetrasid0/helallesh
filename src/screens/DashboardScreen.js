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
    if (activeFilter === 'item') return item.type === 'item' && !item.isResolved;
    if (activeFilter === 'debt') return item.type === 'debt' && !item.isResolved;
    if (activeFilter === 'overdue') return !item.isResolved && item.dueDate && item.dueDate < todayStr;
    if (activeFilter === 'resolved') return item.isResolved;

    return true;
  });

  const filterTabs = [
    { key: 'all', label: 'Tümü', count: stats.activeCount },
    { key: 'item', label: 'Emanetler', count: stats.totalActiveLoansCount },
    { key: 'debt', label: 'Borçlar', count: stats.activeCount - stats.totalActiveLoansCount },
    { key: 'overdue', label: 'Gecikenler', count: stats.overdueCount, isAlert: true },
    { key: 'resolved', label: 'Kapananlar', count: stats.totalResolvedCount },
  ];

  return (
    <View style={styles.container}>
      {/* Metric Cards Row */}
      <View style={styles.metricsRow}>
        <StatCard
          title="Toplam Alacak"
          value={formatCurrency(stats.totalReceivable)}
          subtitle="Borç bakiyesi"
          icon="cash-multiple"
          onPress={() => setActiveFilter('debt')}
        />
        <StatCard
          title="Verilen Eşya"
          value={`${stats.totalActiveLoansCount} adet`}
          subtitle="Emanet sayısı"
          icon="package-variant"
          onPress={() => setActiveFilter('item')}
        />
        <StatCard
          title="Geciken"
          value={`${stats.overdueCount}`}
          subtitle="Süresi dolan"
          icon="alert-circle-outline"
          isAlert={stats.overdueCount > 0}
          onPress={() => setActiveFilter('overdue')}
        />
      </View>

      {/* Clean Search Input */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={18} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara: eşya, kişi, harcama..."
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={16} color={THEME.colors.textMuted} />
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
                  isActive && styles.activeFilterTab,
                ]}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]}>
                  {tab.label}
                </Text>
                <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
                  <Text style={[styles.countText, isActive && styles.activeCountText]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="inbox-outline" size={40} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Kayıt bulunamadı</Text>
            <Text style={styles.emptySub}>
              {searchQuery ? 'Aramanıza uygun bir kayıt eşleşmedi.' : 'Bu kategoride bekleyen bir işlem bulunmuyor.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => setCurrentScreen('add')}
            >
              <Text style={styles.emptyActionText}>Yeni Kayıt Oluştur</Text>
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
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.sm,
    padding: 3,
    gap: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.xs,
  },
  activeFilterTab: {
    backgroundColor: THEME.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  activeFilterTabText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: THEME.colors.border,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  activeCountBadge: {
    backgroundColor: THEME.colors.primary,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  activeCountText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 16,
  },
  emptyAction: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
  },
  emptyActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

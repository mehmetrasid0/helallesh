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
    { key: 'all', label: 'Tümü', count: stats.activeCount, color: THEME.colors.primary },
    { key: 'item', label: 'Emanetler', count: stats.totalActiveLoansCount, color: THEME.colors.blue },
    { key: 'debt', label: 'Borçlar', count: stats.activeCount - stats.totalActiveLoansCount, color: THEME.colors.purple },
    { key: 'overdue', label: 'Gecikenler', count: stats.overdueCount, color: THEME.colors.danger, isAlert: true },
    { key: 'resolved', label: 'Kapananlar', count: stats.totalResolvedCount, color: THEME.colors.success },
  ];

  return (
    <View style={styles.container}>
      {/* Metric Cards Row with Blue, Purple, Red Identities */}
      <View style={styles.metricsRow}>
        <StatCard
          title="Toplam Alacak"
          value={formatCurrency(stats.totalReceivable)}
          subtitle="Adisyon & Borç"
          icon="cash-multiple"
          variant="purple"
          onPress={() => setActiveFilter('debt')}
        />
        <StatCard
          title="Verilen Eşya"
          value={`${stats.totalActiveLoansCount} adet`}
          subtitle="Dışarıdaki emanet"
          icon="package-variant"
          variant="blue"
          onPress={() => setActiveFilter('item')}
        />
        <StatCard
          title="Geciken"
          value={`${stats.overdueCount}`}
          subtitle="Çökülme riski"
          icon="alert-circle-outline"
          variant="red"
          isAlert={stats.overdueCount > 0}
          onPress={() => setActiveFilter('overdue')}
        />
      </View>

      {/* Clean Search Input */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={19} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara: eşya, kişi, harcama, fiş..."
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

      {/* List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="inbox-outline" size={36} color={THEME.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Kayıt bulunamadı</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'Aramanıza uygun bir emanet veya fiş eşleşmedi.'
                : 'Bu filtrede bekleyen herhangi bir işlem bulunmuyor.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => setCurrentScreen('add')}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.emptyActionText}>Hemen Kayıt Aç</Text>
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
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    paddingVertical: 10,
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
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
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

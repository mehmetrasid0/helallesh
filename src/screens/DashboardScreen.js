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

  // Filtering
  const filteredItems = items.filter((item) => {
    // Search query
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.friendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter tabs
    if (activeFilter === 'all') return !item.isResolved;
    if (activeFilter === 'item') return item.type === 'item' && !item.isResolved;
    if (activeFilter === 'debt') return item.type === 'debt' && !item.isResolved;
    if (activeFilter === 'overdue') return !item.isResolved && item.dueDate && item.dueDate < todayStr;
    if (activeFilter === 'resolved') return item.isResolved;

    return true;
  });

  const filterTabs = [
    { key: 'all', label: 'Tümü', count: stats.activeCount },
    { key: 'item', label: '🎒 Emanetler', count: stats.totalActiveLoansCount },
    { key: 'debt', label: '💸 Borçlar', count: stats.activeCount - stats.totalActiveLoansCount },
    { key: 'overdue', label: '🚨 Gecikenler', count: stats.overdueCount, isAlert: true },
    { key: 'resolved', label: '✅ Helalleşildi', count: stats.totalResolvedCount },
  ];

  return (
    <View style={styles.container}>
      {/* Metrics Row */}
      <View style={styles.statsRow}>
        <StatCard
          title="İçerideki Para"
          value={formatCurrency(stats.totalReceivable)}
          subtitle="Agalardan alacak"
          icon="cash-multiple"
          color={THEME.colors.emerald}
          bgColor={THEME.colors.emeraldBg}
          onPress={() => setActiveFilter('debt')}
        />
        <StatCard
          title="Dışarıdaki Eşya"
          value={`${stats.totalActiveLoansCount} Adet`}
          subtitle="Emanette gezen"
          icon="bag-personal"
          color={THEME.colors.amber}
          bgColor={THEME.colors.amberBg}
          onPress={() => setActiveFilter('item')}
        />
        <StatCard
          title="İcra Kapısında"
          value={`${stats.overdueCount} Kayıt`}
          subtitle="Günü geçmiş"
          icon="alert-octagon"
          color={THEME.colors.rose}
          bgColor={THEME.colors.roseBg}
          isAlert={stats.overdueCount > 0}
          onPress={() => setActiveFilter('overdue')}
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Eşya, kanka veya harcama ara..."
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs Horizontal Scroll */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  isActive && styles.activeFilterChip,
                  tab.isAlert && tab.count > 0 && styles.alertFilterChip,
                ]}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.activeFilterChipText,
                    tab.isAlert && tab.count > 0 && styles.alertFilterText,
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="handshake-outline" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Kayıt Bulunamadı</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Arama kriterlerine uygun emanet veya borç yok.'
                : 'Şu an bu filtrede bekleyen helalleşme yok, agalar temiz!'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setCurrentScreen('add')}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Yeni Kayıt Ekle</Text>
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
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  filterWrapper: {
    marginBottom: THEME.spacing.sm,
  },
  filterScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  filterChip: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  activeFilterChip: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  alertFilterChip: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  alertFilterText: {
    color: THEME.colors.rose,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

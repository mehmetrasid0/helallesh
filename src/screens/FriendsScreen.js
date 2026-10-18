import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getFriendBadge, formatCurrency } from '../utils/helpers';

export const FriendsScreen = () => {
  const { friends, items, addFriend, setSearchQuery, setCurrentScreen, setActiveFilter } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    addFriend(name.trim(), phone.trim());
    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  // Sort friends by score descending (or group them)
  const sortedFriends = [...friends].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Agalar Karnesi 📋</Text>
          <Text style={styles.headerSubtitle}>Güvenilirlik skorları ve sabıka kayıtları</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(!showAddModal)}
        >
          <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Aga Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Add Friend Form Box */}
      {showAddModal && (
        <View style={styles.addFormBox}>
          <Text style={styles.addFormTitle}>Yeni Kanka Kaydet</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Adı Soyadı..."
            placeholderTextColor={THEME.colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Telefon / WhatsApp (Opsiyonel)..."
            placeholderTextColor={THEME.colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <View style={styles.addFormActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelBtnText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleCreate}
            >
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Friends List */}
      <FlatList
        data={sortedFriends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const badge = getFriendBadge(item.score);

          // Calculate friend's active stats
          const friendActiveItems = items.filter(
            (it) => it.friendId === item.id && !it.isResolved
          );
          const loanCount = friendActiveItems.filter((it) => it.type === 'item').length;
          const debtSum = friendActiveItems
            .filter((it) => it.type === 'debt')
            .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

          return (
            <View style={styles.friendCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.avatarText}>{item.avatar}</Text>
                  {index === 0 && (
                    <View style={styles.crownBadge}>
                      <Text style={{ fontSize: 10 }}>👑</Text>
                    </View>
                  )}
                </View>

                <View style={styles.mainInfo}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <View style={[styles.rankBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.rankText, { color: badge.color }]}>{badge.title}</Text>
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreNumber}>{item.score}</Text>
                  <Text style={styles.scoreLabel}>Helallik</Text>
                </View>
              </View>

              {/* Karma Progress Bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${item.score}%`,
                      backgroundColor: badge.color,
                    },
                  ]}
                />
              </View>

              {/* Status details: Items on loan & total debt */}
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <MaterialCommunityIcons
                    name="bag-personal-outline"
                    size={16}
                    color={loanCount > 0 ? THEME.colors.amber : THEME.colors.textMuted}
                  />
                  <Text style={styles.balanceLabel}>
                    Emanet: <Text style={styles.balanceHighlight}>{loanCount > 0 ? `${loanCount} Eşya Onda` : 'Temiz ✅'}</Text>
                  </Text>
                </View>

                <View style={styles.balanceDivider} />

                <View style={styles.balanceItem}>
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={16}
                    color={debtSum > 0 ? THEME.colors.rose : THEME.colors.textMuted}
                  />
                  <Text style={styles.balanceLabel}>
                    Borç: <Text style={styles.balanceHighlight}>{debtSum > 0 ? `${formatCurrency(debtSum)} içeride` : 'Borçsuz ✅'}</Text>
                  </Text>
                </View>
              </View>

              {/* Quick filter by friend */}
              {(loanCount > 0 || debtSum > 0) && (
                <TouchableOpacity
                  style={styles.filterByFriendBtn}
                  onPress={() => {
                    setSearchQuery(item.name);
                    setActiveFilter('all');
                    setCurrentScreen('dashboard');
                  }}
                >
                  <Text style={styles.filterByFriendText}>
                    {item.name} ile Bekleyen Kayıtları Gör
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={THEME.colors.primaryLight} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addFormBox: {
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  addFormTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 30,
  },
  friendCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 26,
  },
  crownBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  mainInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  rankBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  scoreLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceLight,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
  },
  balanceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  balanceHighlight: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  balanceDivider: {
    width: 1,
    height: 16,
    backgroundColor: THEME.colors.surfaceBorder,
    marginHorizontal: 8,
  },
  filterByFriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterByFriendText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
});

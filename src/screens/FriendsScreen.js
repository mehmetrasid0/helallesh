import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
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

  const sortedFriends = [...friends].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Kişiler & Güvenilirlik</Text>
          <Text style={styles.headerSubtitle}>Emanet ve borç sadakat geçmişi</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(!showAddModal)}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Kişi Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Add Friend Box */}
      {showAddModal && (
        <View style={styles.addFormBox}>
          <Text style={styles.addFormTitle}>Yeni Kişi Ekle</Text>
          <TextInput
            style={styles.formInput}
            placeholder="İsim Soyisim..."
            placeholderTextColor={THEME.colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Telefon (İsteğe bağlı)..."
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
        renderItem={({ item }) => {
          const badge = getFriendBadge(item.score);

          const friendActiveItems = items.filter(
            (it) => it.friendId === item.id && !it.isResolved
          );
          const loanCount = friendActiveItems.filter((it) => it.type === 'item').length;
          const debtSum = friendActiveItems
            .filter((it) => it.type === 'debt')
            .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

          return (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>
                    {item.avatar.length <= 2 ? item.avatar : item.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.nameRow}>
                    <Text style={styles.personName}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.title}</Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      Emanet: <Text style={{ fontWeight: '600', color: THEME.colors.textPrimary }}>{loanCount > 0 ? `${loanCount} adet` : 'Yok'}</Text>
                    </Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaText}>
                      Borç: <Text style={{ fontWeight: '600', color: THEME.colors.textPrimary }}>{debtSum > 0 ? formatCurrency(debtSum) : 'Yok'}</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.scoreBox}>
                  <Text style={styles.scoreVal}>{item.score}</Text>
                  <Text style={styles.scoreLabel}>Puan</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.score}%`, backgroundColor: badge.color }]} />
              </View>

              {(loanCount > 0 || debtSum > 0) && (
                <TouchableOpacity
                  style={styles.cardAction}
                  onPress={() => {
                    setSearchQuery(item.name);
                    setActiveFilter('all');
                    setCurrentScreen('dashboard');
                  }}
                >
                  <Text style={styles.cardActionText}>Bekleyen kayıtları listele</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={THEME.colors.textMuted} />
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.sm,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addFormBox: {
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
  },
  addFormTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.xs,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: THEME.colors.textPrimary,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.xs,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  metaText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  dot: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  scoreBox: {
    alignItems: 'center',
    paddingLeft: 10,
  },
  scoreVal: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  scoreLabel: {
    fontSize: 9,
    color: THEME.colors.textMuted,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.surfaceSubtle,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  cardActionText: {
    fontSize: 11,
    color: THEME.colors.accent,
    fontWeight: '600',
  },
});

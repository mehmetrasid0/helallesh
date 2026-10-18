import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  Share,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getFriendBadge, formatCurrency, formatDate } from '../utils/helpers';

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

  // Send two-way account statement to Friend via WhatsApp / Share Sheet
  const handleSendStatement = async (friend, friendActiveItems, friendReceivable, friendPayable, friendNet, itemsLent, itemsBorrowed) => {
    let msg = `📋 *HELALLESH AGALAR HESAP EKSTRESİ*\n-----------------------------------\n👤 *Aga:* ${friend.name}\n⭐ *Karma Sicili:* ${friend.score}/100\n\n`;

    if (itemsLent.length > 0) {
      msg += `📦 *Sende Olan Emanetlerim:*\n`;
      itemsLent.forEach((it) => {
        msg += `• ${it.title} (Vade: ${formatDate(it.dueDate)})\n`;
      });
      msg += `\n`;
    }

    if (itemsBorrowed.length > 0) {
      msg += `📥 *Bende Olan Emanetlerin:*\n`;
      itemsBorrowed.forEach((it) => {
        msg += `• ${it.title} (Sağlam muhafaza ediliyor)\n`;
      });
      msg += `\n`;
    }

    if (friendReceivable > 0) {
      msg += `💰 *Bana Olan Borcun:* ${formatCurrency(friendReceivable)}\n`;
    }
    if (friendPayable > 0) {
      msg += `💸 *Sana Olan Borcum:* ${formatCurrency(friendPayable)}\n`;
    }

    if (friendNet > 0) {
      msg += `\n⚖️ *NET DURUM:* Bana ${formatCurrency(friendNet)} göndereceksin.\n`;
    } else if (friendNet < 0) {
      msg += `\n⚖️ *NET DURUM:* Sana ${formatCurrency(Math.abs(friendNet))} borcum var, en kısa sürede kapatacağım.\n`;
    } else if (friendReceivable > 0 && friendPayable > 0) {
      msg += `\n⚖️ *NET DURUM:* Hesaplar tam denk, helalleştik!\n`;
    }

    msg += `\n_Helallesh sistemi üzerinden oluşturulmuştur. Hak geçmesin, helalleşelim!_`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `whatsapp://send?text=${encoded}`;
    const webUrl = `https://wa.me/?text=${encoded}`;

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.open(webUrl, '_blank');
      } else {
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          await Linking.openURL(webUrl);
        }
      }
    } catch (e) {
      Share.share({ message: msg });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Agalar Karnesi & Net Denge</Text>
          <Text style={styles.headerSubtitle}>Kim kime ne kadar borçlu, emanetler kimde?</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(!showAddModal)}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Aga Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Add Friend Form */}
      {showAddModal && (
        <View style={styles.addFormBox}>
          <Text style={styles.addFormTitle}>Yeni Aga Kaydet</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Aga adı (Örn: Caner, Mert)..."
            placeholderTextColor={THEME.colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Telefon numarası (İsteğe bağlı)..."
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

          // Emanetler: Onda olanlar vs Bende olanlar
          const itemsLent = friendActiveItems.filter((it) => it.type === 'item' && it.direction !== 'borrowed');
          const itemsBorrowed = friendActiveItems.filter((it) => it.type === 'item' && it.direction === 'borrowed');

          // Borçlar: Onun bana borcu vs Benim ona borcum
          const friendReceivable = friendActiveItems
            .filter((it) => it.type === 'debt' && it.direction !== 'borrowed')
            .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

          const friendPayable = friendActiveItems
            .filter((it) => it.type === 'debt' && it.direction === 'borrowed')
            .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

          // Mahsuplaşma / Net Bakiye
          const friendNet = friendReceivable - friendPayable;

          const hasPending = friendActiveItems.length > 0;

          return (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: item.score >= 80 ? THEME.colors.blueBg : THEME.colors.dangerBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarInitials,
                      { color: item.score >= 80 ? THEME.colors.blue : THEME.colors.danger },
                    ]}
                  >
                    {item.avatar && item.avatar.length <= 2
                      ? item.avatar
                      : item.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.nameRow}>
                    <Text style={styles.personName}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border || 'transparent' }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.title}</Text>
                    </View>
                  </View>

                  {/* Net Balance & Item Breakdown */}
                  <View style={styles.metaRow}>
                    <View style={styles.netPillBox}>
                      {friendNet > 0 ? (
                        <Text style={styles.netReceiveText}>
                          Sana verecek: <Text style={{ fontWeight: '800' }}>{formatCurrency(friendNet)}</Text>
                        </Text>
                      ) : friendNet < 0 ? (
                        <Text style={styles.netPayText}>
                          Ona borcun: <Text style={{ fontWeight: '800' }}>{formatCurrency(Math.abs(friendNet))}</Text>
                        </Text>
                      ) : (
                        <Text style={styles.netZeroText}>Para borcu yok (0 ₺)</Text>
                      )}
                    </View>
                  </View>

                  {/* Item counter */}
                  {(itemsLent.length > 0 || itemsBorrowed.length > 0) && (
                    <View style={styles.itemMetaRow}>
                      {itemsLent.length > 0 && (
                        <Text style={styles.itemMetaText}>
                          📤 {itemsLent.length} eşyan onda
                        </Text>
                      )}
                      {itemsLent.length > 0 && itemsBorrowed.length > 0 && (
                        <Text style={styles.dot}>•</Text>
                      )}
                      {itemsBorrowed.length > 0 && (
                        <Text style={styles.itemMetaText}>
                          📥 {itemsBorrowed.length} eşyası sende
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.scoreBox}>
                  <Text
                    style={[
                      styles.scoreVal,
                      {
                        color:
                          item.score >= 80
                            ? THEME.colors.success
                            : item.score >= 50
                            ? THEME.colors.warning
                            : THEME.colors.danger,
                      },
                    ]}
                  >
                    {item.score}
                  </Text>
                  <Text style={styles.scoreLabel}>Karma</Text>
                </View>
              </View>

              {/* Karma Progress Track */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.score}%`,
                      backgroundColor:
                        item.score >= 80
                          ? THEME.colors.success
                          : item.score >= 50
                          ? THEME.colors.warning
                          : THEME.colors.danger,
                    },
                  ]}
                />
              </View>

              {/* Action Buttons: View Records & Send Two-Way Statement via WhatsApp */}
              <View style={styles.cardActionsRow}>
                {hasPending ? (
                  <>
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => {
                        setSearchQuery(item.name);
                        setActiveFilter('all');
                        setCurrentScreen('dashboard');
                      }}
                    >
                      <MaterialCommunityIcons name="format-list-bulleted" size={14} color={THEME.colors.primary} />
                      <Text style={styles.actionBtnSecondaryText}>Kayıtları Gör</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnWhatsApp}
                      onPress={() =>
                        handleSendStatement(
                          item,
                          friendActiveItems,
                          friendReceivable,
                          friendPayable,
                          friendNet,
                          itemsLent,
                          itemsBorrowed
                        )
                      }
                    >
                      <MaterialCommunityIcons name="whatsapp" size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnWhatsAppText}>Ekstre Gönder</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.cleanRecordBox}>
                    <MaterialCommunityIcons name="shield-check" size={14} color={THEME.colors.success} />
                    <Text style={styles.cleanRecordText}>Tertemiz sicil • Bekleyen alacak/borç yok</Text>
                  </View>
                )}
              </View>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addFormBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  addFormTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
  },
  saveBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  personName: {
    fontSize: 15,
    fontWeight: '800',
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
    marginTop: 2,
  },
  netPillBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  netReceiveText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  netPayText: {
    fontSize: 11,
    color: '#EA580C',
    fontWeight: '600',
  },
  netZeroText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  itemMetaText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  dot: {
    fontSize: 10,
    color: THEME.colors.textLight,
  },
  scoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scoreLabel: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.sm,
  },
  actionBtnSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  actionBtnWhatsApp: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#25D366',
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.sm,
  },
  actionBtnWhatsAppText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cleanRecordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
  },
  cleanRecordText: {
    fontSize: 11,
    color: THEME.colors.successDark,
    fontWeight: '600',
  },
});

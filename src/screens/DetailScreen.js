import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { calculateDaysStatus, formatCurrency, formatDate } from '../utils/helpers';
import { DARLAMA_TEMPLATES } from '../constants/templates';

export const DetailScreen = () => {
  const {
    selectedItem,
    setCurrentScreen,
    resolveItem,
    deleteItem,
    setTebligatItem,
    friends,
  } = useApp();

  const [copiedId, setCopiedId] = useState(null);

  if (!selectedItem) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Kayıt bulunamadı.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.backButtonText}>Panoya Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isDebt = selectedItem.type === 'debt';
  const daysInfo = calculateDaysStatus(selectedItem.dueDate);
  const friendObj = friends.find((f) => f.id === selectedItem.friendId);

  // Available templates
  const templates = isDebt ? DARLAMA_TEMPLATES.debt : DARLAMA_TEMPLATES.item;

  const handleCopyText = (templateText, id) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(templateText);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsApp = (templateText) => {
    const encoded = encodeURIComponent(templateText);
    const url = `https://wa.me/?text=${encoded}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const handleDelete = () => {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      deleteItem(selectedItem.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isDebt ? 'Borç / Alacak Detayı' : 'Emanet Detayı'}
        </Text>

        <TouchableOpacity
          style={[styles.circleBtn, styles.deleteBtn]}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={THEME.colors.rose} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Item Card Hero */}
        <View style={[styles.heroCard, selectedItem.isResolved && styles.heroResolved]}>
          <View style={styles.heroTop}>
            <View style={[
              styles.heroIconBox,
              { backgroundColor: isDebt ? THEME.colors.emeraldBg : THEME.colors.amberBg }
            ]}>
              <MaterialCommunityIcons
                name={selectedItem.icon || (isDebt ? 'cash-multiple' : 'bag-personal')}
                size={32}
                color={isDebt ? THEME.colors.emerald : THEME.colors.amber}
              />
            </View>

            <View style={styles.heroBadges}>
              <View style={[styles.statusBadge, { backgroundColor: daysInfo.badgeBg }]}>
                <Text style={[styles.statusBadgeText, { color: daysInfo.badgeColor }]}>
                  {selectedItem.isResolved ? '✅ Helalleşildi' : daysInfo.text}
                </Text>
              </View>
              {!isDebt && (
                <View style={styles.urgencyBadge}>
                  <Text style={styles.urgencyBadgeText}>{selectedItem.urgency}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.heroTitle}>{selectedItem.title}</Text>

          {isDebt && (
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroAmountLabel}>Toplam Alacak:</Text>
              <Text style={styles.heroAmountValue}>{formatCurrency(selectedItem.amount)}</Text>
            </View>
          )}

          {selectedItem.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Özel Not:</Text>
              <Text style={styles.notesText}>"{selectedItem.notes}"</Text>
            </View>
          ) : null}

          {/* Dates & Timeline info */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Verilme Tarihi</Text>
              <Text style={styles.timelineValue}>{formatDate(selectedItem.givenDate)}</Text>
            </View>
            <View style={styles.timelineDivider} />
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Helalleşme Günü</Text>
              <Text style={styles.timelineValue}>{formatDate(selectedItem.dueDate)}</Text>
            </View>
          </View>
        </View>

        {/* Borrower / Kanka Profile Card */}
        <View style={styles.friendCard}>
          <Text style={styles.sectionSubtitle}>Emanetin Bulunduğu Kanka</Text>
          <View style={styles.friendRow}>
            <Text style={styles.friendAvatar}>{friendObj?.avatar || '😎'}</Text>
            <View style={styles.friendDetails}>
              <Text style={styles.friendName}>{selectedItem.friendName}</Text>
              <Text style={styles.friendScoreText}>
                Helallik Skoru: <Text style={styles.friendScoreVal}>{friendObj?.score || 75}/100</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewFriendBtn}
              onPress={() => setCurrentScreen('friends')}
            >
              <Text style={styles.viewFriendBtnText}>Karneye Bak</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Official Tebligat Button (For Debts) */}
        {isDebt && !selectedItem.isResolved && (
          <TouchableOpacity
            style={styles.tebligatBanner}
            activeOpacity={0.85}
            onPress={() => setTebligatItem(selectedItem)}
          >
            <View style={styles.tebligatIconBox}>
              <MaterialCommunityIcons name="scale-balance" size={26} color="#D97706" />
            </View>
            <View style={styles.tebligatTextContainer}>
              <Text style={styles.tebligatTitle}>T.C. Helallesh İcra Tebligatı Çıkar 📜</Text>
              <Text style={styles.tebligatSubtitle}>
                Agalar formatında resmi haciz/hatırlatma belgesi üret ve gönder!
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D97706" />
          </TouchableOpacity>
        )}

        {/* Darlama & WhatsApp Generator Section */}
        {!selectedItem.isResolved && (
          <View style={styles.darlamaSection}>
            <View style={styles.darlamaHeaderRow}>
              <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
              <Text style={styles.darlamaTitle}>WhatsApp Darlama Asistanı</Text>
            </View>
            <Text style={styles.darlamaDesc}>
              Aşağıdaki hazır mizahi mesaj şablonlarından birini seçip kankanın WhatsApp'ına tek tıkla pasla:
            </Text>

            {templates.map((tpl) => {
              const msg = isDebt
                ? tpl.text(selectedItem.friendName, selectedItem.amount, selectedItem.title)
                : tpl.text(selectedItem.friendName, selectedItem.title);
              const isCopied = copiedId === tpl.id;

              return (
                <View key={tpl.id} style={styles.templateCard}>
                  <Text style={styles.templateLevel}>{tpl.level}</Text>
                  <Text style={styles.templateQuote}>"{msg}"</Text>

                  <View style={styles.templateActions}>
                    <TouchableOpacity
                      style={styles.copyBtn}
                      onPress={() => handleCopyText(msg, tpl.id)}
                    >
                      <MaterialCommunityIcons
                        name={isCopied ? "check" : "content-copy"}
                        size={16}
                        color={THEME.colors.textSecondary}
                      />
                      <Text style={styles.copyBtnText}>
                        {isCopied ? 'Kopyalandı!' : 'Kopyala'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sendWhatsAppBtn}
                      onPress={() => handleSendWhatsApp(msg)}
                    >
                      <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" />
                      <Text style={styles.sendWhatsAppBtnText}>Gönder</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Helalleşildi / Kurtarıldı Action Button */}
        <View style={styles.bottomActionWrapper}>
          {selectedItem.isResolved ? (
            <View style={styles.alreadyResolvedBanner}>
              <MaterialCommunityIcons name="check-circle" size={24} color={THEME.colors.emerald} />
              <Text style={styles.alreadyResolvedText}>
                Bu kayıt {selectedItem.resolvedDate} tarihinde sağ salim helalleşildi.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.resolveButton}
              activeOpacity={0.85}
              onPress={() => {
                resolveItem(selectedItem.id);
                alert(`Helallesh tamamlandı! ${selectedItem.friendName} kankanın Helallik Skoruna +8 puan eklendi.`);
              }}
            >
              <MaterialCommunityIcons name="handshake" size={26} color="#FFFFFF" />
              <View>
                <Text style={styles.resolveButtonTitle}>
                  {isDebt ? 'Parayı Tahsil Ettim (Helalleştik)' : 'Emaneti Geri Aldım (Helalleştik)'}
                </Text>
                <Text style={styles.resolveButtonSubtitle}>
                  Kaydı arşive kaldırır ve kankanın puanını artırır
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  deleteBtn: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  heroResolved: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  urgencyBadgeText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginBottom: 8,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 6,
  },
  heroAmountLabel: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  heroAmountValue: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.emerald,
  },
  notesBox: {
    backgroundColor: THEME.colors.surfaceLight,
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    marginVertical: 10,
  },
  notesLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    paddingTop: 12,
    marginTop: 8,
  },
  timelineItem: {
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  timelineDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  friendCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  friendScoreText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  friendScoreVal: {
    fontWeight: '800',
    color: THEME.colors.primaryLight,
  },
  viewFriendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceLight,
  },
  viewFriendBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  tebligatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)',
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    marginBottom: THEME.spacing.md,
    gap: 12,
  },
  tebligatIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tebligatTextContainer: {
    flex: 1,
  },
  tebligatTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
  },
  tebligatSubtitle: {
    fontSize: 11,
    color: '#D97706',
    marginTop: 2,
  },
  darlamaSection: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  darlamaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  darlamaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  darlamaDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  templateCard: {
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  templateLevel: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryLight,
    marginBottom: 6,
  },
  templateQuote: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 10,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: THEME.colors.surface,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  sendWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#25D366',
  },
  sendWhatsAppBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomActionWrapper: {
    marginTop: 8,
  },
  alreadyResolvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 14,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  alreadyResolvedText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.emerald,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.emerald,
    padding: 16,
    borderRadius: THEME.borderRadius.lg,
    shadowColor: THEME.colors.emerald,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resolveButtonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resolveButtonSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

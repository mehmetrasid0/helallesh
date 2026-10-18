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
      <View style={styles.notFoundBox}>
        <Text style={styles.notFoundText}>Kayıt bulunamadı.</Text>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.backLinkText}>Panoya Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isDebt = selectedItem.type === 'debt';
  const daysInfo = calculateDaysStatus(selectedItem.dueDate);
  const friendObj = friends.find((f) => f.id === selectedItem.friendId);
  const templates = isDebt ? DARLAMA_TEMPLATES.debt : DARLAMA_TEMPLATES.item;

  const handleCopyText = (templateText, id) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(templateText);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      {/* Header */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>
          {isDebt ? 'Borç Detayı' : 'Emanet Detayı'}
        </Text>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={THEME.colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <View style={[styles.statusBadge, { backgroundColor: daysInfo.badgeBg, borderColor: daysInfo.badgeBorder }]}>
                <Text style={[styles.statusBadgeText, { color: daysInfo.badgeColor }]}>
                  {selectedItem.isResolved ? 'Helalleşildi' : daysInfo.text}
                </Text>
              </View>
              <Text style={styles.categoryBadge}>{selectedItem.category}</Text>
            </View>

            {isDebt && (
              <Text style={styles.amountText}>{formatCurrency(selectedItem.amount)}</Text>
            )}
          </View>

          <Text style={styles.titleText}>{selectedItem.title}</Text>

          {selectedItem.notes ? (
            <Text style={styles.notesText}>"{selectedItem.notes}"</Text>
          ) : null}

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Verilme Tarihi</Text>
              <Text style={styles.metaValue}>{formatDate(selectedItem.givenDate)}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Beklenen Tarih</Text>
              <Text style={styles.metaValue}>{formatDate(selectedItem.dueDate)}</Text>
            </View>
          </View>
        </View>

        {/* Borrower Friend Profile */}
        <View style={styles.profileBox}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {friendObj?.avatar?.length <= 2 ? friendObj.avatar : selectedItem.friendName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{selectedItem.friendName}</Text>
            <Text style={styles.profileScore}>
              Güvenilirlik Skoru: <Text style={{ fontWeight: '700', color: THEME.colors.textPrimary }}>{friendObj?.score || 75}/100</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileAction}
            onPress={() => setCurrentScreen('friends')}
          >
            <Text style={styles.profileActionText}>Kişi Karnesi</Text>
          </TouchableOpacity>
        </View>

        {/* Official Court Document Trigger */}
        {isDebt && !selectedItem.isResolved && (
          <TouchableOpacity
            style={styles.tebligatButton}
            activeOpacity={0.8}
            onPress={() => setTebligatItem(selectedItem)}
          >
            <MaterialCommunityIcons name="file-document-outline" size={20} color={THEME.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tebligatBtnTitle}>Resmi İcra Tebligatı Oluştur</Text>
              <Text style={styles.tebligatBtnSub}>Mizahi mahkeme belgesi formatında paylaş</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* WhatsApp Darlama Templates */}
        {!selectedItem.isResolved && (
          <View style={styles.templatesSection}>
            <Text style={styles.sectionTitle}>Hatırlatma Mesajları</Text>
            <Text style={styles.sectionSubtitle}>Tek tıkla kopyalayıp WhatsApp üzerinden iletebilirsiniz:</Text>

            {templates.map((tpl) => {
              const msg = isDebt
                ? tpl.text(selectedItem.friendName, selectedItem.amount, selectedItem.title)
                : tpl.text(selectedItem.friendName, selectedItem.title);
              const isCopied = copiedId === tpl.id;

              return (
                <View key={tpl.id} style={styles.templateCard}>
                  <Text style={styles.templateHeader}>{tpl.level}</Text>
                  <Text style={styles.templateBody}>{msg}</Text>

                  <View style={styles.templateBtnRow}>
                    <TouchableOpacity
                      style={styles.templateSmallBtn}
                      onPress={() => handleCopyText(msg, tpl.id)}
                    >
                      <MaterialCommunityIcons
                        name={isCopied ? "check" : "content-copy"}
                        size={14}
                        color={THEME.colors.textSecondary}
                      />
                      <Text style={styles.templateSmallBtnText}>
                        {isCopied ? 'Kopyalandı' : 'Kopyala'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.templateSmallBtn, styles.templatePrimaryBtn]}
                      onPress={() => handleSendWhatsApp(msg)}
                    >
                      <MaterialCommunityIcons name="whatsapp" size={14} color="#FFFFFF" />
                      <Text style={[styles.templateSmallBtnText, { color: '#FFFFFF' }]}>
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Helalleşildi / Mark Complete Button */}
        <View style={styles.actionSection}>
          {selectedItem.isResolved ? (
            <View style={styles.resolvedNotice}>
              <MaterialCommunityIcons name="check-circle" size={18} color={THEME.colors.success} />
              <Text style={styles.resolvedNoticeText}>
                Bu kayıt {formatDate(selectedItem.resolvedDate)} tarihinde helalleşildi.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.resolveButton}
              activeOpacity={0.85}
              onPress={() => {
                resolveItem(selectedItem.id);
                alert(`Helallesh tamamlandı. ${selectedItem.friendName} skoru güncellendi.`);
              }}
            >
              <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
              <Text style={styles.resolveButtonText}>
                {isDebt ? 'Ödeme Alındı (Helalleş)' : 'Emanet Teslim Alındı (Helalleş)'}
              </Text>
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
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadge: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    paddingTop: 12,
    marginTop: 4,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.borderSubtle,
    marginHorizontal: 16,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
    gap: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  profileAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  profileScore: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  profileAction: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.xs,
  },
  profileActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  tebligatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  tebligatBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  tebligatBtnSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  templatesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginBottom: 10,
  },
  templateCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  templateHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  templateBody: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 8,
  },
  templateBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  templateSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  templatePrimaryBtn: {
    backgroundColor: '#16A34A',
  },
  templateSmallBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  actionSection: {
    marginTop: 4,
  },
  resolvedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.successBg,
    borderRadius: THEME.borderRadius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.successBorder,
  },
  resolvedNoticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.success,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
    paddingVertical: 13,
  },
  resolveButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
  },
  backLink: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },
  backLinkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});

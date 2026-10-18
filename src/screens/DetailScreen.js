import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Linking,
  Share,
  Modal,
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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

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
  const isOverdue = daysInfo.status === 'overdue' && !selectedItem.isResolved;
  const friendObj = friends.find((f) => f.id === selectedItem.friendId);
  const templates = isDebt ? DARLAMA_TEMPLATES.debt : DARLAMA_TEMPLATES.item;

  // Semantic color for this detail view
  const themeColor = selectedItem.isResolved
    ? THEME.colors.success
    : isOverdue
    ? THEME.colors.danger
    : isDebt
    ? THEME.colors.purple
    : THEME.colors.blue;

  // Prepare structured share message
  const buildProofShareMessage = (customMsg = '') => {
    const proofNote = selectedItem.imageUri ? '\n📸 Kanıt: Fotoğraf/Adisyon fişi sisteme işlenmiştir.' : '';
    const amountNote = isDebt ? `\n💰 Tutar: ${formatCurrency(selectedItem.amount)}` : '';
    return (
      `⚖️ *HELALLESH RESMİ BİLDİRİMİ*\n` +
      `--------------------------------\n` +
      `👤 *Muhatap:* ${selectedItem.friendName}\n` +
      `📦 *Konu:* ${selectedItem.title}${amountNote}\n` +
      `📅 *Kayıt Tarihi:* ${formatDate(selectedItem.givenDate)}\n` +
      `⏳ *Vade Durumu:* ${daysInfo.text}${proofNote}\n\n` +
      (customMsg ? `💬 "${customMsg}"\n\n` : '') +
      `_Hak geçmesin, helalleşelim!_`
    );
  };

  const handleCopyText = (templateText, id) => {
    const fullMsg = buildProofShareMessage(templateText);
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullMsg);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = async (templateText) => {
    const fullMsg = buildProofShareMessage(templateText);
    const encoded = encodeURIComponent(fullMsg);
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
      // Fallback to iOS/Android native share sheet
      Share.share({ message: fullMsg });
    }
  };

  const handleNativeShare = async () => {
    const fullMsg = buildProofShareMessage("Aga aramızdaki emanet/hesap kaydını Helallesh'e girdim, bilgin olsun.");
    try {
      await Share.share({
        title: 'Helallesh Resmi Bildirimi',
        message: fullMsg,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    if (confirm('Bu kaydı tamamen silmek istediğinize emin misiniz?')) {
      deleteItem(selectedItem.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>
          {isDebt ? 'Borç / Fiş Detayı' : 'Emanet Detayı'}
        </Text>

        <View style={styles.navRightActions}>
          <TouchableOpacity style={styles.shareHeaderBtn} onPress={handleNativeShare}>
            <MaterialCommunityIcons name="share-variant-outline" size={18} color={themeColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={THEME.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Status & Info Card */}
        <View style={[styles.card, { borderTopColor: themeColor, borderTopWidth: 4 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: selectedItem.isResolved
                      ? THEME.colors.successBg
                      : isOverdue
                      ? THEME.colors.dangerBg
                      : isDebt
                      ? THEME.colors.purpleBg
                      : THEME.colors.blueBg,
                    borderColor: themeColor,
                  },
                ]}
              >
                <Text style={[styles.statusBadgeText, { color: themeColor }]}>
                  {selectedItem.isResolved ? '✓ Helalleşildi' : daysInfo.text}
                </Text>
              </View>

              <Text style={styles.categoryPill}>
                {selectedItem.category || (isDebt ? 'Adisyon' : 'Eşya')}
              </Text>
            </View>

            {isDebt ? (
              <View style={styles.amountDisplay}>
                <Text style={styles.amountLabel}>Tutar</Text>
                <Text style={[styles.amountValue, { color: themeColor }]}>
                  {formatCurrency(selectedItem.amount)}
                </Text>
                {selectedItem.isSplit && (
                  <Text style={styles.splitSub}>
                    (Toplam {formatCurrency(selectedItem.originalTotal)} / {selectedItem.splitCount} kişi)
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.urgencyDisplay}>
                <View style={[styles.urgencyDot, { backgroundColor: themeColor }]} />
                <Text style={[styles.urgencyLabel, { color: themeColor }]}>
                  {selectedItem.urgency || 'Normal'} Değer
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.mainTitle}>{selectedItem.title}</Text>

          {selectedItem.notes ? (
            <View style={styles.notesBox}>
              <MaterialCommunityIcons name="note-text-outline" size={14} color={THEME.colors.textMuted} />
              <Text style={styles.notesContent}>{selectedItem.notes}</Text>
            </View>
          ) : null}

          {/* Key-Value Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Muhatap Aga</Text>
              <Text style={styles.detailValue}>{selectedItem.friendName}</Text>
              {friendObj && (
                <Text style={styles.detailKarma}>Karma Skoru: {friendObj.score}/100</Text>
              )}
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kayıt Tarihi</Text>
              <Text style={styles.detailValue}>{formatDate(selectedItem.givenDate)}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Vade Tarihi</Text>
              <Text style={styles.detailValue}>{formatDate(selectedItem.dueDate)}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Darlık Düzeyi</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isOverdue ? THEME.colors.danger : THEME.colors.textPrimary },
                ]}
              >
                {isOverdue ? '🚨 Kritik (Gecikmede)' : 'Normal'}
              </Text>
            </View>
          </View>
        </View>

        {/* 📸 PROOF PHOTO / RECEIPT CARD (RICH VISUAL EVIDENCE) */}
        {selectedItem.imageUri ? (
          <View style={styles.proofPhotoCard}>
            <View style={styles.proofPhotoHeader}>
              <View style={styles.proofHeaderLeft}>
                <MaterialCommunityIcons
                  name={isDebt ? 'receipt' : 'camera-check'}
                  size={18}
                  color={THEME.colors.purple}
                />
                <Text style={styles.proofHeaderTitle}>
                  {isDebt ? 'Resmi Adisyon / Hesap Fişi' : 'Eşya Teslim Kanıt Fotoğrafı'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.zoomBtn}
                onPress={() => setIsPhotoModalOpen(true)}
              >
                <MaterialCommunityIcons name="magnify-plus-outline" size={15} color={THEME.colors.primary} />
                <Text style={styles.zoomBtnText}>Büyüt</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setIsPhotoModalOpen(true)}
            >
              <Image source={{ uri: selectedItem.imageUri }} style={styles.proofImage} />
            </TouchableOpacity>

            <View style={styles.proofFooter}>
              <MaterialCommunityIcons name="shield-check" size={13} color={THEME.colors.success} />
              <Text style={styles.proofFooterText}>
                Bu görsel sisteme delil olarak işlenmiştir.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noProofBox}>
            <MaterialCommunityIcons name="image-off-outline" size={20} color={THEME.colors.textLight} />
            <Text style={styles.noProofText}>Bu kayda henüz kanıt fotoğrafı eklenmemiş.</Text>
          </View>
        )}

        {/* Agaya Bildir & Paylaş Action Banner */}
        <TouchableOpacity
          style={[styles.shareBannerBtn, { backgroundColor: themeColor }]}
          activeOpacity={0.85}
          onPress={handleNativeShare}
        >
          <MaterialCommunityIcons name="share-variant" size={18} color="#FFFFFF" />
          <View style={styles.shareBannerTextCol}>
            <Text style={styles.shareBannerTitle}>Agaya Kanıtlı Rapor Gönder</Text>
            <Text style={styles.shareBannerSub}>
              WhatsApp, SMS veya AirDrop ile tam dökümü ilet
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Resolve or Reopen Action Button */}
        {!selectedItem.isResolved ? (
          <TouchableOpacity
            style={styles.resolveBtn}
            activeOpacity={0.85}
            onPress={() => resolveItem(selectedItem.id)}
          >
            <MaterialCommunityIcons name="check-decagram" size={20} color="#FFFFFF" />
            <Text style={styles.resolveBtnText}>Helalleştik (Kaydı Kapat)</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resolvedInfoBox}>
            <MaterialCommunityIcons name="check-circle" size={18} color={THEME.colors.success} />
            <Text style={styles.resolvedInfoText}>
              Bu işlem {formatDate(selectedItem.resolvedDate)} tarihinde helalleşilerek kapatıldı.
            </Text>
          </View>
        )}

        {/* Resmi İcra Tebligatı / Mahkeme Kağıdı Generator */}
        {!selectedItem.isResolved && (
          <View style={styles.tebligatCard}>
            <View style={styles.tebligatHeader}>
              <View style={styles.tebligatIconBox}>
                <MaterialCommunityIcons name="gavel" size={18} color={THEME.colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tebligatTitle}>T.C. Helallesh İcra Dairesi</Text>
                <Text style={styles.tebligatSub}>
                  Resmi tebligat formatında mahkeme kağıdı hazırla
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tebligatOpenBtn}
              onPress={() => setTebligatItem(selectedItem)}
            >
              <Text style={styles.tebligatOpenText}>İcra Kağıdını Görüntüle & Gönder</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Kademeli Darlama Şablonları */}
        {!selectedItem.isResolved && (
          <View style={styles.darlamaSection}>
            <Text style={styles.sectionTitle}>MERT GÜNAYDIN USULÜ DARLAMA MESAJLARI</Text>
            <Text style={styles.sectionSubtitle}>
              Tek tıkla kopyala veya doğrudan aganın WhatsApp'ına fırlat:
            </Text>

            {templates.map((tpl) => (
              <View key={tpl.id} style={styles.templateCard}>
                <View style={styles.templateHeader}>
                  <View style={styles.templateTag}>
                    <Text style={styles.templateTagText}>{tpl.label}</Text>
                  </View>
                  <Text style={styles.templateTone}>{tpl.tone}</Text>
                </View>

                <Text style={styles.templateMessage}>"{tpl.text}"</Text>

                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={styles.actionBtnOutline}
                    onPress={() => handleCopyText(tpl.text, tpl.id)}
                  >
                    <MaterialCommunityIcons
                      name={copiedId === tpl.id ? 'check' : 'content-copy'}
                      size={14}
                      color={copiedId === tpl.id ? THEME.colors.success : THEME.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.actionBtnText,
                        copiedId === tpl.id && { color: THEME.colors.success },
                      ]}
                    >
                      {copiedId === tpl.id ? 'Kopyalandı' : 'Kopyala'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnWhatsApp}
                    onPress={() => handleSendWhatsApp(tpl.text)}
                  >
                    <MaterialCommunityIcons name="whatsapp" size={15} color="#FFFFFF" />
                    <Text style={styles.actionBtnWhatsAppText}>WhatsApp'a Gönder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Full Screen Photo Modal */}
      {selectedItem.imageUri && (
        <Modal
          visible={isPhotoModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPhotoModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isDebt ? 'Adisyon / Fiş Görseli' : 'Eşya Kanıt Görseli'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsPhotoModalOpen(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: selectedItem.imageUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: THEME.colors.textMuted,
    marginBottom: 12,
  },
  backLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },
  backLinkText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareHeaderBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: THEME.borderRadius.sm,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  categoryPill: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  amountDisplay: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  splitSub: {
    fontSize: 9,
    color: THEME.colors.purple,
    fontWeight: '600',
  },
  urgencyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notesContent: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  detailKarma: {
    fontSize: 10,
    color: THEME.colors.successDark,
    fontWeight: '600',
    marginTop: 1,
  },
  // Photo proof card
  proofPhotoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  proofPhotoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  proofHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proofHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  zoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoomBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  proofImage: {
    width: '100%',
    height: 180,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#E2E8F0',
  },
  proofFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  proofFooterText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  noProofBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  noProofText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  // Share Banner
  shareBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  shareBannerTextCol: {
    flex: 1,
  },
  shareBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  shareBannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.success,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 14,
  },
  resolveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resolvedInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.successBg,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.successBorder,
  },
  resolvedInfoText: {
    fontSize: 12,
    color: THEME.colors.successDark,
    fontWeight: '600',
    flex: 1,
  },
  tebligatCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: THEME.colors.dangerBorder,
  },
  tebligatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tebligatIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tebligatTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.danger,
  },
  tebligatSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  tebligatOpenBtn: {
    backgroundColor: THEME.colors.danger,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
  },
  tebligatOpenText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  darlamaSection: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginBottom: 10,
  },
  templateCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  templateTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  templateTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  templateTone: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  templateMessage: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  actionBtnWhatsApp: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    backgroundColor: '#25D366',
    borderRadius: THEME.borderRadius.sm,
  },
  actionBtnWhatsAppText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalImageContainer: {
    width: '100%',
    height: '75%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { generateTebligatText } from '../constants/templates';
import { formatCurrency } from '../utils/helpers';

export const TebligatModal = () => {
  const { tebligatItem, setTebligatItem } = useApp();
  const [copied, setCopied] = useState(false);

  if (!tebligatItem) return null;

  const fullText = generateTebligatText(
    tebligatItem.friendName,
    tebligatItem.amount || 0,
    tebligatItem.title
  );

  const handleCopy = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(fullText);
    const url = `https://wa.me/?text=${encoded}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <Modal
      visible={!!tebligatItem}
      transparent
      animationType="slide"
      onRequestClose={() => setTebligatItem(null)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.badgeRow}>
              <MaterialCommunityIcons name="scale-balance" size={20} color="#D97706" />
              <Text style={styles.headerTitle}>RESMİ HELALLEŞME TEBLİGATI</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setTebligatItem(null)}
            >
              <MaterialCommunityIcons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.paperScrollView}>
            {/* Realistic Court Paper Look */}
            <View style={styles.paperDocument}>
              <View style={styles.courtHeader}>
                <Text style={styles.courtEmblem}>🇹🇷</Text>
                <Text style={styles.courtMainTitle}>T.C.</Text>
                <Text style={styles.courtSubTitle}>HELALLESH AGALAR İCRA DAİRESİ</Text>
                <Text style={styles.courtDepartment}>Alacak Takip & Helalleşme Müdürlüğü</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docLabel}>ESAS NO:</Text>
                <Text style={styles.docValue}>2026 / {Math.floor(1000 + Math.random() * 8999)} E.</Text>
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docLabel}>BORÇLU (MUHATAP):</Text>
                <Text style={styles.docValueHighlight}>{tebligatItem.friendName}</Text>
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docLabel}>BORÇ KONUSU:</Text>
                <Text style={styles.docValue}>{tebligatItem.title}</Text>
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docLabel}>ASIL ALACAK TUTARI:</Text>
                <Text style={styles.docValueAmount}>{formatCurrency(tebligatItem.amount || 0)}</Text>
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docLabel}>GECİKME FAİZİ / CEZASI:</Text>
                <Text style={styles.docValuePenalty}>1 Adet Çiğ Köfte Dürüm + Ayran</Text>
              </View>

              <View style={styles.stampWrapper}>
                <View style={styles.stampBox}>
                  <Text style={styles.stampText}>GECİKMİŞ ALACAK</Text>
                  <Text style={styles.stampSub}>DERHAL İTFA OLUNA</Text>
                </View>
              </View>

              <Text style={styles.legalNotice}>
                İşbu tebligatın tebliğinden itibaren derhal ilgili meblağın hak sahibinin IBAN numarasına gönderilmesi, aksi halde arkadaş grubundaki Helallik Skorunun (Karma) "Kronik Çökücü" kademesine indirileceği ihtar olunur.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.actionFooter}>
            <TouchableOpacity
              style={styles.copyButton}
              activeOpacity={0.8}
              onPress={handleCopy}
            >
              <MaterialCommunityIcons
                name={copied ? "check" : "content-copy"}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.copyBtnText}>
                {copied ? 'Tebligat Kopyalandı!' : 'Metni Kopyala'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsappButton}
              activeOpacity={0.8}
              onPress={handleOpenWhatsApp}
            >
              <MaterialCommunityIcons name="whatsapp" size={20} color="#FFFFFF" />
              <Text style={styles.whatsappBtnText}>WhatsApp'a Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  paperScrollView: {
    marginBottom: THEME.spacing.md,
  },
  paperDocument: {
    backgroundColor: '#FFFDF9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2D9C8',
  },
  courtHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  courtEmblem: {
    fontSize: 22,
    marginBottom: 4,
  },
  courtMainTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1C1917',
    letterSpacing: 2,
  },
  courtSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 2,
  },
  courtDepartment: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#D6D3D1',
    width: '100%',
    marginTop: 10,
  },
  docRow: {
    marginBottom: 8,
  },
  docLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.5,
  },
  docValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#292524',
    marginTop: 1,
  },
  docValueHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
    marginTop: 1,
  },
  docValueAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 1,
  },
  docValuePenalty: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 1,
  },
  stampWrapper: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  stampBox: {
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '-8deg' }],
  },
  stampText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#DC2626',
    textAlign: 'center',
  },
  stampSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
  },
  legalNotice: {
    fontSize: 10,
    color: '#57534E',
    fontStyle: 'italic',
    lineHeight: 14,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    paddingTop: 8,
  },
  actionFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whatsappButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
  },
  whatsappBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { calculateDaysStatus, formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export const ItemCard = ({ item }) => {
  const { setSelectedItemId, setCurrentScreen, resolveItem } = useApp();
  const isDebt = item.type === 'debt';
  const isBorrowed = item.direction === 'borrowed'; // Ben aldım / Borçluyum
  const daysInfo = calculateDaysStatus(item.dueDate);
  const isOverdue = daysInfo.status === 'overdue' && !item.isResolved;

  // Determine card semantic style
  const getCardTheme = () => {
    if (item.isResolved) {
      return {
        stripeColor: THEME.colors.success,
        iconBg: THEME.colors.successBg,
        iconColor: THEME.colors.success,
        badgeBg: THEME.colors.successBg,
        badgeText: THEME.colors.successDark,
        badgeBorder: THEME.colors.successBorder,
        badgeLabel: 'Helalleşildi',
      };
    }
    if (isOverdue) {
      return {
        stripeColor: THEME.colors.danger,
        iconBg: THEME.colors.dangerBg,
        iconColor: THEME.colors.danger,
        badgeBg: THEME.colors.dangerBg,
        badgeText: THEME.colors.dangerDark,
        badgeBorder: THEME.colors.dangerBorder,
        badgeLabel: isBorrowed ? 'Ödemen Gecikti!' : daysInfo.text,
      };
    }
    if (isBorrowed) {
      // Ben borçluyum / Emanet bende
      return {
        stripeColor: '#EA580C',
        iconBg: '#FFF7ED',
        iconColor: '#EA580C',
        badgeBg: '#FFF7ED',
        badgeText: '#C2410C',
        badgeBorder: '#FFEDD5',
        badgeLabel: isDebt ? 'Borcun Var' : 'Emanet Sende',
      };
    }
    if (isDebt) {
      // Alacağım var
      return {
        stripeColor: THEME.colors.purple,
        iconBg: THEME.colors.purpleBg,
        iconColor: THEME.colors.purple,
        badgeBg: THEME.colors.purpleBg,
        badgeText: THEME.colors.purpleDark,
        badgeBorder: THEME.colors.purpleBorder,
        badgeLabel: daysInfo.text,
      };
    }
    // Emanet Eşya Verdim (Dışarıda)
    return {
      stripeColor: THEME.colors.blue,
      iconBg: THEME.colors.blueBg,
      iconColor: THEME.colors.blue,
      badgeBg: THEME.colors.blueBg,
      badgeText: THEME.colors.blueDark,
      badgeBorder: THEME.colors.blueBorder,
      badgeLabel: daysInfo.text,
    };
  };

  const cardTheme = getCardTheme();

  const handlePress = () => {
    setSelectedItemId(item.id);
    setCurrentScreen('detail');
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: cardTheme.stripeColor },
        item.isResolved && styles.resolvedCard,
        isOverdue && styles.overdueCard,
      ]}
      activeOpacity={0.75}
      onPress={handlePress}
    >
      <View style={styles.contentRow}>
        {/* Left Icon or Thumbnail */}
        {item.imageUri ? (
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
            <View style={styles.cameraIconBadge}>
              <MaterialCommunityIcons name="camera" size={9} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: cardTheme.iconBg }]}>
            <MaterialCommunityIcons
              name={
                item.icon ||
                (isDebt
                  ? isBorrowed
                    ? 'arrow-top-right'
                    : 'arrow-bottom-left'
                  : isBorrowed
                  ? 'package-down'
                  : 'package-up')
              }
              size={20}
              color={cardTheme.iconColor}
            />
          </View>
        )}

        {/* Middle Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.headerMeta}>
            {/* Direction Pill (Verdim vs Aldım) */}
            <View
              style={[
                styles.directionPill,
                { backgroundColor: isBorrowed ? '#FFF7ED' : '#F1F5F9' },
              ]}
            >
              <Text
                style={[
                  styles.directionPillText,
                  { color: isBorrowed ? '#EA580C' : THEME.colors.textPrimary },
                ]}
              >
                {isBorrowed ? 'Borçlusun' : 'Alacaklısın'}
              </Text>
            </View>

            <Text style={styles.friendName}>
              {isBorrowed ? `→ ${item.friendName}` : item.friendName}
            </Text>

            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.categoryName}>{item.category || (isDebt ? 'Harcama' : 'Eşya')}</Text>

            {item.imageUri ? (
              <View style={styles.photoProofTag}>
                <MaterialCommunityIcons name="image-check" size={11} color={THEME.colors.purple} />
                <Text style={styles.photoProofText}>Kanıtlı</Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.title, item.isResolved && styles.resolvedText]} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: cardTheme.badgeBg,
                  borderColor: cardTheme.badgeBorder,
                },
              ]}
            >
              <Text style={[styles.statusPillText, { color: cardTheme.badgeText }]}>
                {cardTheme.badgeLabel}
              </Text>
            </View>

            {item.notes ? (
              <Text style={styles.notesText} numberOfLines={1}>
                {item.notes}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Right Column: Amount or Urgency + Resolve Button */}
        <View style={styles.rightCol}>
          {isDebt ? (
            <View style={styles.amountBox}>
              <Text
                style={[
                  styles.amountText,
                  isBorrowed && { color: '#EA580C' },
                ]}
              >
                {isBorrowed ? `-${formatCurrency(item.amount)}` : `+${formatCurrency(item.amount)}`}
              </Text>
              <Text style={styles.roleSubtext}>
                {isBorrowed ? 'ödeyeceksin' : 'alacaksın'}
              </Text>
            </View>
          ) : (
            <View style={styles.urgencyWrapper}>
              <View
                style={[
                  styles.urgencyDot,
                  {
                    backgroundColor:
                      item.urgency === 'Kritik'
                        ? THEME.colors.danger
                        : item.urgency === 'Yüksek'
                        ? THEME.colors.warning
                        : THEME.colors.blue,
                  },
                ]}
              />
              <Text style={styles.urgencyText}>{item.urgency || 'Normal'}</Text>
            </View>
          )}

          {!item.isResolved && (
            <TouchableOpacity
              style={[
                styles.resolveActionBtn,
                isBorrowed && { backgroundColor: '#EA580C' },
              ]}
              onPress={(e) => {
                e.stopPropagation();
                resolveItem(item.id);
              }}
              accessibilityLabel={isBorrowed ? 'Ödedim' : 'Helalleştik'}
            >
              <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderLeftWidth: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  resolvedCard: {
    opacity: 0.82,
    backgroundColor: '#FAFAFA',
  },
  overdueCard: {
    backgroundColor: '#FFFBFB',
    borderColor: THEME.colors.dangerBorder,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailContainer: {
    position: 'relative',
    width: 46,
    height: 46,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  directionPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  directionPillText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  friendName: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  dotSeparator: {
    fontSize: 10,
    color: THEME.colors.textLight,
  },
  categoryName: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  photoProofTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: THEME.colors.purpleBg,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  photoProofText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.purple,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  resolvedText: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textMuted,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 72,
    gap: 6,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  roleSubtext: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  urgencyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  urgencyText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  resolveActionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

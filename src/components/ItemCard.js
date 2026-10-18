import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { calculateDaysStatus, formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export const ItemCard = ({ item }) => {
  const { setSelectedItemId, setCurrentScreen, resolveItem } = useApp();
  const isDebt = item.type === 'debt';
  const daysInfo = calculateDaysStatus(item.dueDate);

  const handlePress = () => {
    setSelectedItemId(item.id);
    setCurrentScreen('detail');
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        item.isResolved && styles.resolvedCard,
        daysInfo.status === 'overdue' && !item.isResolved && styles.overdueCard,
      ]}
      activeOpacity={0.75}
      onPress={handlePress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryRow}>
          <View style={[
            styles.iconWrapper,
            { backgroundColor: isDebt ? THEME.colors.emeraldBg : THEME.colors.amberBg }
          ]}>
            <MaterialCommunityIcons
              name={item.icon || (isDebt ? 'cash-multiple' : 'bag-personal')}
              size={20}
              color={isDebt ? THEME.colors.emerald : THEME.colors.amber}
            />
          </View>
          <View>
            <Text style={styles.categoryLabel}>
              {isDebt ? '💸 Borç / Hesap' : '🎒 Emanet Eşya'}
            </Text>
            <Text style={styles.friendName}>
              Kanka: <Text style={styles.friendHighlight}>{item.friendName}</Text>
            </Text>
          </View>
        </View>

        {isDebt ? (
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
          </View>
        ) : (
          <View style={[styles.urgencyBadge, { borderColor: daysInfo.badgeColor }]}>
            <Text style={[styles.urgencyText, { color: daysInfo.badgeColor }]}>
              {item.urgency || 'Orta'}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, item.isResolved && styles.resolvedText]} numberOfLines={2}>
        {item.title}
      </Text>

      {item.notes ? (
        <Text style={styles.notes} numberOfLines={1}>
          "{item.notes}"
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        {item.isResolved ? (
          <View style={styles.resolvedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={16} color={THEME.colors.emerald} />
            <Text style={styles.resolvedBadgeText}>Helalleşildi ({item.resolvedDate})</Text>
          </View>
        ) : (
          <View style={[styles.statusPill, { backgroundColor: daysInfo.badgeBg }]}>
            <MaterialCommunityIcons
              name={daysInfo.status === 'overdue' ? 'alert-octagon' : 'clock-outline'}
              size={14}
              color={daysInfo.badgeColor}
            />
            <Text style={[styles.statusText, { color: daysInfo.badgeColor }]}>
              {daysInfo.text}
            </Text>
          </View>
        )}

        <View style={styles.actionRow}>
          {!item.isResolved && (
            <TouchableOpacity
              style={styles.quickResolveBtn}
              onPress={(e) => {
                e.stopPropagation();
                resolveItem(item.id);
              }}
              accessibilityLabel="Helalleş"
            >
              <MaterialCommunityIcons name="handshake" size={16} color="#FFFFFF" />
              <Text style={styles.quickResolveText}>Helalleş</Text>
            </TouchableOpacity>
          )}
          <View style={styles.arrowIcon}>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  resolvedCard: {
    opacity: 0.65,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  overdueCard: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
    backgroundColor: 'rgba(244, 63, 94, 0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  friendName: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  friendHighlight: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  amountBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.emerald,
  },
  urgencyBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  resolvedText: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textMuted,
  },
  notes: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resolvedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.emerald,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickResolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quickResolveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: 2,
  },
});

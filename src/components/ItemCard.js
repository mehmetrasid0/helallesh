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
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={item.icon || (isDebt ? 'cash' : 'package-variant')}
            size={20}
            color={THEME.colors.primary}
          />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.headerMeta}>
            <Text style={styles.friendName}>{item.friendName}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.categoryName}>{item.category}</Text>
          </View>

          <Text style={[styles.title, item.isResolved && styles.resolvedText]} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.statusRow}>
            {item.isResolved ? (
              <View style={styles.resolvedPill}>
                <MaterialCommunityIcons name="check" size={12} color={THEME.colors.success} />
                <Text style={styles.resolvedPillText}>Helalleşildi</Text>
              </View>
            ) : (
              <View style={[styles.statusPill, { backgroundColor: daysInfo.badgeBg, borderColor: daysInfo.badgeBorder }]}>
                <Text style={[styles.statusPillText, { color: daysInfo.badgeColor }]}>
                  {daysInfo.text}
                </Text>
              </View>
            )}
            
            {item.notes ? (
              <Text style={styles.notesText} numberOfLines={1}>
                {item.notes}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rightCol}>
          {isDebt ? (
            <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
          ) : (
            <View style={styles.urgencyDotWrapper}>
              <View style={[
                styles.urgencyDot,
                { backgroundColor: item.urgency === 'Kritik' ? THEME.colors.danger : THEME.colors.textMuted }
              ]} />
              <Text style={styles.urgencyText}>{item.urgency || 'Normal'}</Text>
            </View>
          )}

          {!item.isResolved && (
            <TouchableOpacity
              style={styles.resolveActionBtn}
              onPress={(e) => {
                e.stopPropagation();
                resolveItem(item.id);
              }}
              accessibilityLabel="Kapat"
            >
              <MaterialCommunityIcons name="check" size={14} color={THEME.colors.primary} />
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  resolvedCard: {
    opacity: 0.6,
    backgroundColor: '#FAFBFD',
  },
  overdueCard: {
    borderColor: THEME.colors.dangerBorder,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  friendName: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  dotSeparator: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  categoryName: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  resolvedText: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textMuted,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  resolvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: THEME.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resolvedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  notesText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  urgencyDotWrapper: {
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
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  resolveActionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

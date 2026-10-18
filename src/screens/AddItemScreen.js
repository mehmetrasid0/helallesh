import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export const AddItemScreen = () => {
  const { friends, addItem, addFriend, setCurrentScreen } = useApp();

  const [recordType, setRecordType] = useState('item'); // 'item' or 'debt'

  // Common fields
  const [title, setTitle] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id || '');
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriendInput, setShowAddFriendInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [daysOption, setDaysOption] = useState(7); // 3, 7, 14, 30 days

  // Item specific
  const [category, setCategory] = useState('Kıyafet');
  const [urgency, setUrgency] = useState('Orta ⚡');

  // Debt specific
  const [amount, setAmount] = useState('');
  const [splitMode, setSplitMode] = useState('direct'); // 'direct' or 'split'
  const [splitCount, setSplitCount] = useState(2); // Divide by N

  const categories = [
    { label: 'Kıyafet', icon: 'tshirt-crew' },
    { label: 'Elektronik', icon: 'cellphone' },
    { label: 'Kitap', icon: 'book-open-page-variant' },
    { label: 'Oyun', icon: 'gamepad-variant' },
    { label: 'Aksesuar', icon: 'watch' },
    { label: 'Diğer', icon: 'dots-horizontal' },
  ];

  const urgencyOptions = [
    { label: 'Düşük ☕', color: THEME.colors.emerald },
    { label: 'Orta ⚡', color: THEME.colors.primaryLight },
    { label: 'Yüksek 🚨', color: THEME.colors.amber },
    { label: 'Helal Etmem! 💀', color: THEME.colors.rose },
  ];

  const durationOptions = [
    { days: 3, label: '3 Gün' },
    { days: 7, label: '1 Hafta' },
    { days: 14, label: '2 Hafta' },
    { days: 30, label: '1 Ay' },
  ];

  // Calculated Due Date based on daysOption
  const getCalculatedDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + daysOption);
    return d.toISOString().split('T')[0];
  };

  const handleAddNewFriend = () => {
    if (!newFriendName.trim()) return;
    const created = addFriend(newFriendName.trim());
    setSelectedFriendId(created.id);
    setNewFriendName('');
    setShowAddFriendInput(false);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Lütfen bir başlık veya açıklama girin!');
      return;
    }

    const selectedFriend = friends.find((f) => f.id === selectedFriendId) || friends[0];
    if (!selectedFriend) {
      alert('Lütfen bir arkadaş seçin!');
      return;
    }

    let finalAmount = 0;
    if (recordType === 'debt') {
      const parsed = parseFloat(amount);
      if (!parsed || parsed <= 0) {
        alert('Lütfen geçerli bir borç tutarı girin!');
        return;
      }
      finalAmount = splitMode === 'split' ? Math.round(parsed / splitCount) : parsed;
    }

    const itemIcon = recordType === 'item' 
      ? (categories.find(c => c.label === category)?.icon || 'bag-personal')
      : 'cash-multiple';

    addItem({
      type: recordType,
      title: title.trim(),
      category: recordType === 'item' ? category : 'Hesap / Borç',
      icon: itemIcon,
      friendId: selectedFriend.id,
      friendName: selectedFriend.name,
      amount: finalAmount,
      urgency: recordType === 'item' ? urgency : 'Yüksek 💸',
      notes: notes.trim(),
      dueDate: getCalculatedDueDate(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Helallesh Kaydı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Record Type Switcher */}
        <View style={styles.typeSwitcher}>
          <TouchableOpacity
            style={[styles.switchOption, recordType === 'item' && styles.activeItemSwitch]}
            activeOpacity={0.8}
            onPress={() => setRecordType('item')}
          >
            <MaterialCommunityIcons
              name="bag-personal"
              size={18}
              color={recordType === 'item' ? '#FFFFFF' : THEME.colors.textMuted}
            />
            <Text style={[styles.switchText, recordType === 'item' && styles.activeSwitchText]}>
              Emanet Eşya
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchOption, recordType === 'debt' && styles.activeDebtSwitch]}
            activeOpacity={0.8}
            onPress={() => setRecordType('debt')}
          >
            <MaterialCommunityIcons
              name="cash-multiple"
              size={18}
              color={recordType === 'debt' ? '#FFFFFF' : THEME.colors.textMuted}
            />
            <Text style={[styles.switchText, recordType === 'debt' && styles.activeSwitchText]}>
              Borç / Ortak Hesap
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>
            {recordType === 'item' ? 'Emanet Eşya Nedir?' : 'Harcama / Borç Konusu'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              recordType === 'item'
                ? 'Örn: Siyah Nike Hoodie, 67W Şarj Başlığı...'
                : 'Örn: Kadıköy Döner Hesabı, Steam Oyunu...'
            }
            placeholderTextColor={THEME.colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Debt Amount and Split Calculator (Only for Debt) */}
        {recordType === 'debt' && (
          <View style={styles.debtBox}>
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Toplam Tutar (₺)</Text>
              <TextInput
                style={[styles.input, styles.amountInput]}
                placeholder="0"
                placeholderTextColor={THEME.colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Split Mode Toggle */}
            <View style={styles.splitToggleRow}>
              <TouchableOpacity
                style={[styles.splitBtn, splitMode === 'direct' && styles.splitBtnActive]}
                onPress={() => setSplitMode('direct')}
              >
                <Text style={[styles.splitBtnText, splitMode === 'direct' && styles.splitBtnTextActive]}>
                  Direkt Borç (Alacak)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.splitBtn, splitMode === 'split' && styles.splitBtnActive]}
                onPress={() => setSplitMode('split')}
              >
                <Text style={[styles.splitBtnText, splitMode === 'split' && styles.splitBtnTextActive]}>
                  Ortak Hesap Bölüş
                </Text>
              </TouchableOpacity>
            </View>

            {splitMode === 'split' && (
              <View style={styles.splitCounterRow}>
                <Text style={styles.splitCounterLabel}>Masada Kaç Kişiyiz?</Text>
                <View style={styles.stepperWrapper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setSplitCount(Math.max(2, splitCount - 1))}
                  >
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepCountText}>{splitCount} Kişi</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setSplitCount(splitCount + 1)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                {amount ? (
                  <Text style={styles.perPersonCalculation}>
                    Kişi başı düşen alacak: <Text style={styles.perPersonBold}>{formatCurrency(Math.round(parseFloat(amount) / splitCount))}</Text>
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* Category Selection (Only for Item) */}
        {recordType === 'item' && (
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Eşya Kategorisi</Text>
            <View style={styles.chipsWrap}>
              {categories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    style={[styles.chip, isSelected && styles.activeChip]}
                    onPress={() => setCategory(cat.label)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={16}
                      color={isSelected ? '#FFFFFF' : THEME.colors.textSecondary}
                    />
                    <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Friend Selector */}
        <View style={styles.formGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Kime Verildi? (Kanka)</Text>
            <TouchableOpacity
              onPress={() => setShowAddFriendInput(!showAddFriendInput)}
            >
              <Text style={styles.linkText}>
                {showAddFriendInput ? 'Vazgeç' : '+ Yeni Kanka Ekle'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddFriendInput && (
            <View style={styles.newFriendRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Arkadaşın Adı Soyadı..."
                placeholderTextColor={THEME.colors.textMuted}
                value={newFriendName}
                onChangeText={setNewFriendName}
              />
              <TouchableOpacity
                style={styles.saveFriendBtn}
                onPress={handleAddNewFriend}
              >
                <Text style={styles.saveFriendBtnText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsScroll}>
            {friends.map((fr) => {
              const isSelected = selectedFriendId === fr.id;
              return (
                <TouchableOpacity
                  key={fr.id}
                  style={[styles.friendCard, isSelected && styles.selectedFriendCard]}
                  onPress={() => setSelectedFriendId(fr.id)}
                >
                  <Text style={styles.friendAvatar}>{fr.avatar}</Text>
                  <Text style={[styles.friendName, isSelected && styles.selectedFriendName]} numberOfLines={1}>
                    {fr.name}
                  </Text>
                  <Text style={styles.friendScore}>Puan: {fr.score}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Expected Due Date Duration */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Ne Zaman Helalleşilecek? (Süre)</Text>
          <View style={styles.durationRow}>
            {durationOptions.map((opt) => {
              const isSelected = daysOption === opt.days;
              return (
                <TouchableOpacity
                  key={opt.days}
                  style={[styles.durationChip, isSelected && styles.activeDurationChip]}
                  onPress={() => setDaysOption(opt.days)}
                >
                  <Text style={[styles.durationText, isSelected && styles.activeDurationText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.dateInfoText}>
            Hedef Tarih: <Text style={styles.dateBold}>{getCalculatedDueDate()}</Text>
          </Text>
        </View>

        {/* Urgency Level (For Items) */}
        {recordType === 'item' && (
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Aciliyet & Göz Hakkı Seviyesi</Text>
            <View style={styles.urgencyGrid}>
              {urgencyOptions.map((u) => {
                const isSelected = urgency === u.label;
                return (
                  <TouchableOpacity
                    key={u.label}
                    style={[
                      styles.urgencyChip,
                      isSelected && { borderColor: u.color, backgroundColor: `${u.color}22` },
                    ]}
                    onPress={() => setUrgency(u.label)}
                  >
                    <Text style={[styles.urgencyLabel, isSelected && { color: u.color, fontWeight: '800' }]}>
                      {u.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Notes Input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Özel Not / Durum (Opsiyonel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Örn: Halı sahada giydi, yarın derste getirecek..."
            placeholderTextColor={THEME.colors.textMuted}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons name="check" size={22} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {recordType === 'item' ? 'Emanet Kaydını Aç' : 'Borç Kaydını Aç'}
          </Text>
        </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 4,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  switchOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  activeItemSwitch: {
    backgroundColor: THEME.colors.amber,
  },
  activeDebtSwitch: {
    backgroundColor: THEME.colors.emerald,
  },
  switchText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  activeSwitchText: {
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: THEME.spacing.md,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  input: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: THEME.colors.textPrimary,
    fontSize: 14,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.emerald,
  },
  debtBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: THEME.spacing.md,
  },
  splitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  splitBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  splitBtnActive: {
    backgroundColor: THEME.colors.emerald,
    borderColor: THEME.colors.emerald,
  },
  splitBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  splitBtnTextActive: {
    color: '#FFFFFF',
  },
  splitCounterRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  splitCounterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepCountText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  perPersonCalculation: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 8,
  },
  perPersonBold: {
    color: THEME.colors.emerald,
    fontWeight: '800',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeChip: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  newFriendRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  saveFriendBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveFriendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  friendsScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  friendCard: {
    width: 90,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  selectedFriendCard: {
    borderColor: THEME.colors.primaryLight,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  friendAvatar: {
    fontSize: 24,
    marginBottom: 4,
  },
  friendName: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  selectedFriendName: {
    color: '#FFFFFF',
  },
  friendScore: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  activeDurationChip: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  activeDurationText: {
    color: '#FFFFFF',
  },
  dateInfoText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 6,
  },
  dateBold: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  urgencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgencyChip: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingVertical: 10,
    alignItems: 'center',
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

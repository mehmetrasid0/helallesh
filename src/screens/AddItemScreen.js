import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export const AddItemScreen = () => {
  const { friends, addItem, addFriend, setCurrentScreen } = useApp();

  const [recordType, setRecordType] = useState('item'); // 'item' or 'debt'
  const [title, setTitle] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id || '');
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriendInput, setShowAddFriendInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [daysOption, setDaysOption] = useState(7);

  // Item specific
  const [category, setCategory] = useState('Giyim');
  const [urgency, setUrgency] = useState('Orta');

  // Debt specific
  const [amount, setAmount] = useState('');
  const [splitMode, setSplitMode] = useState('direct');
  const [splitCount, setSplitCount] = useState(2);

  const categories = [
    { label: 'Giyim', icon: 'tshirt-crew-outline' },
    { label: 'Elektronik', icon: 'power-plug-outline' },
    { label: 'Kitap', icon: 'book-open-outline' },
    { label: 'Oyun', icon: 'controller-classic-outline' },
    { label: 'Aksesuar', icon: 'watch' },
    { label: 'Diğer', icon: 'dots-horizontal' },
  ];

  const urgencyOptions = ['Düşük', 'Orta', 'Yüksek', 'Kritik'];
  const durationOptions = [
    { days: 3, label: '3 Gün' },
    { days: 7, label: '1 Hafta' },
    { days: 14, label: '2 Hafta' },
    { days: 30, label: '1 Ay' },
  ];

  const getCalculatedDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + daysOption);
    return d.toISOString().split('T')[0];
  };

  const handleAddNewFriend = () => {
    if (!newFriendName.trim()) return;
    const initials = newFriendName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const created = addFriend(newFriendName.trim());
    created.avatar = initials;
    setSelectedFriendId(created.id);
    setNewFriendName('');
    setShowAddFriendInput(false);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Lütfen bir başlık girin.');
      return;
    }

    const selectedFriend = friends.find((f) => f.id === selectedFriendId) || friends[0];
    if (!selectedFriend) {
      alert('Lütfen bir kişi seçin.');
      return;
    }

    let finalAmount = 0;
    if (recordType === 'debt') {
      const parsed = parseFloat(amount);
      if (!parsed || parsed <= 0) {
        alert('Geçerli bir tutar giriniz.');
        return;
      }
      finalAmount = splitMode === 'split' ? Math.round(parsed / splitCount) : parsed;
    }

    const itemIcon = recordType === 'item'
      ? (categories.find(c => c.label === category)?.icon || 'package-variant')
      : 'cash-multiple';

    addItem({
      type: recordType,
      title: title.trim(),
      category: recordType === 'item' ? category : 'Harcama',
      icon: itemIcon,
      friendId: selectedFriend.id,
      friendName: selectedFriend.name,
      amount: finalAmount,
      urgency: recordType === 'item' ? urgency : 'Standart',
      notes: notes.trim(),
      dueDate: getCalculatedDueDate(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Kayıt</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Clean Segmented Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[styles.modeTab, recordType === 'item' && styles.activeModeTab]}
            onPress={() => setRecordType('item')}
          >
            <Text style={[styles.modeText, recordType === 'item' && styles.activeModeText]}>
              Emanet Eşya
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, recordType === 'debt' && styles.activeModeTab]}
            onPress={() => setRecordType('debt')}
          >
            <Text style={[styles.modeText, recordType === 'debt' && styles.activeModeText]}>
              Borç & Hesap
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>
            {recordType === 'item' ? 'Eşya Tanımı' : 'Harcama / Borç Konusu'}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={recordType === 'item' ? 'Örn: Siyah Nike Hoodie' : 'Örn: Akşam Yemeği Payı'}
            placeholderTextColor={THEME.colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Amount & Split (Debt Only) */}
        {recordType === 'debt' && (
          <View style={styles.debtContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Tutar (₺)</Text>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                placeholder="0"
                placeholderTextColor={THEME.colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.splitToggleRow}>
              <TouchableOpacity
                style={[styles.splitBtn, splitMode === 'direct' && styles.activeSplitBtn]}
                onPress={() => setSplitMode('direct')}
              >
                <Text style={[styles.splitBtnText, splitMode === 'direct' && styles.activeSplitBtnText]}>
                  Birebir Borç
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.splitBtn, splitMode === 'split' && styles.activeSplitBtn]}
                onPress={() => setSplitMode('split')}
              >
                <Text style={[styles.splitBtnText, splitMode === 'split' && styles.activeSplitBtnText]}>
                  Ortak Bölüş
                </Text>
              </TouchableOpacity>
            </View>

            {splitMode === 'split' && (
              <View style={styles.stepperContainer}>
                <Text style={styles.stepperLabel}>Kişi Sayısı</Text>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => setSplitCount(Math.max(2, splitCount - 1))}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepCountText}>{splitCount} Kişi</Text>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => setSplitCount(splitCount + 1)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                {amount ? (
                  <Text style={styles.splitResult}>
                    Kişi başı pay: <Text style={styles.splitBold}>{formatCurrency(Math.round(parseFloat(amount) / splitCount))}</Text>
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* Categories (Item Only) */}
        {recordType === 'item' && (
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Kategori</Text>
            <View style={styles.chipsRow}>
              {categories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    style={[styles.categoryChip, isSelected && styles.activeCategoryChip]}
                    onPress={() => setCategory(cat.label)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={15}
                      color={isSelected ? THEME.colors.primary : THEME.colors.textMuted}
                    />
                    <Text style={[styles.categoryChipText, isSelected && styles.activeCategoryChipText]}>
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
          <View style={styles.labelHeaderRow}>
            <Text style={styles.fieldLabel}>Muhatap Kişi</Text>
            <TouchableOpacity onPress={() => setShowAddFriendInput(!showAddFriendInput)}>
              <Text style={styles.actionLinkText}>
                {showAddFriendInput ? 'Vazgeç' : '+ Yeni Kişi'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddFriendInput && (
            <View style={styles.newFriendRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="İsim Soyisim..."
                placeholderTextColor={THEME.colors.textMuted}
                value={newFriendName}
                onChangeText={setNewFriendName}
              />
              <TouchableOpacity
                style={styles.addFriendSaveBtn}
                onPress={handleAddNewFriend}
              >
                <Text style={styles.addFriendSaveText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsRow}>
            {friends.map((fr) => {
              const isSelected = selectedFriendId === fr.id;
              return (
                <TouchableOpacity
                  key={fr.id}
                  style={[styles.friendCard, isSelected && styles.selectedFriendCard]}
                  onPress={() => setSelectedFriendId(fr.id)}
                >
                  <View style={[styles.avatarBox, isSelected && styles.selectedAvatarBox]}>
                    <Text style={[styles.avatarText, isSelected && styles.selectedAvatarText]}>
                      {fr.avatar.length <= 2 ? fr.avatar : fr.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.friendNameText, isSelected && styles.selectedFriendName]} numberOfLines={1}>
                    {fr.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Duration / Expected Due Date */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Geri Dönüş Süresi</Text>
          <View style={styles.durationRow}>
            {durationOptions.map((opt) => {
              const isSelected = daysOption === opt.days;
              return (
                <TouchableOpacity
                  key={opt.days}
                  style={[styles.durationTab, isSelected && styles.activeDurationTab]}
                  onPress={() => setDaysOption(opt.days)}
                >
                  <Text style={[styles.durationText, isSelected && styles.activeDurationText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.dueDateHelper}>
            Teslim Tarihi: <Text style={{ fontWeight: '700', color: THEME.colors.textPrimary }}>{getCalculatedDueDate()}</Text>
          </Text>
        </View>

        {/* Urgency (Item Only) */}
        {recordType === 'item' && (
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Önem Derecesi</Text>
            <View style={styles.urgencyRow}>
              {urgencyOptions.map((u) => {
                const isSelected = urgency === u;
                return (
                  <TouchableOpacity
                    key={u}
                    style={[styles.urgencyTab, isSelected && styles.activeUrgencyTab]}
                    onPress={() => setUrgency(u)}
                  >
                    <Text style={[styles.urgencyText, isSelected && styles.activeUrgencyText]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Açıklama / Not</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Kayıtla ilgili hatırlatıcı kısa not..."
            placeholderTextColor={THEME.colors.textMuted}
            multiline
            numberOfLines={2}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveRecordBtn}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.saveRecordBtnText}>Kaydı Oluştur</Text>
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
    paddingVertical: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.sm,
    padding: 3,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.xs,
  },
  activeModeTab: {
    backgroundColor: THEME.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  activeModeText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  labelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.accent,
  },
  textInput: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '700',
  },
  debtContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 12,
    marginBottom: 14,
  },
  splitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  splitBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.xs,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  activeSplitBtn: {
    backgroundColor: THEME.colors.primary,
  },
  splitBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  activeSplitBtnText: {
    color: '#FFFFFF',
  },
  stepperContainer: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    paddingTop: 10,
  },
  stepperLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginBottom: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: THEME.borderRadius.xs,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  stepCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  splitResult: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 8,
  },
  splitBold: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeCategoryChip: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  activeCategoryChipText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  newFriendRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  addFriendSaveBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  addFriendSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  friendsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  friendCard: {
    alignItems: 'center',
    width: 64,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  selectedAvatarBox: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  selectedAvatarText: {
    color: '#FFFFFF',
  },
  friendNameText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  selectedFriendName: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 6,
  },
  durationTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  activeDurationTab: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  activeDurationText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dueDateHelper: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 6,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  urgencyTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  activeUrgencyTab: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  activeUrgencyText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  notesInput: {
    minHeight: 50,
  },
  saveRecordBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  saveRecordBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export const AddItemScreen = () => {
  const { friends, addItem, addFriend, setCurrentScreen } = useApp();

  const [recordType, setRecordType] = useState('item'); // 'item' (Emanet Eşya) or 'debt' (Borç / Ortak Hesap)
  const [title, setTitle] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id || '');
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriendInput, setShowAddFriendInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [daysOption, setDaysOption] = useState(7);
  const [imageUri, setImageUri] = useState(null); // Proof photo / receipt

  // Item specific
  const [category, setCategory] = useState('Giyim');
  const [urgency, setUrgency] = useState('Orta');

  // Debt specific
  const [amount, setAmount] = useState('');
  const [splitMode, setSplitMode] = useState('direct'); // 'direct' or 'split'
  const [splitCount, setSplitCount] = useState(2);

  const categories = [
    { label: 'Giyim', icon: 'tshirt-crew-outline' },
    { label: 'Elektronik', icon: 'power-plug-outline' },
    { label: 'Kitap', icon: 'book-open-outline' },
    { label: 'Oyun', icon: 'controller-classic-outline' },
    { label: 'Aksesuar', icon: 'watch' },
    { label: 'Diğer', icon: 'dots-horizontal' },
  ];

  const urgencyOptions = [
    { label: 'Düşük', color: THEME.colors.blue },
    { label: 'Orta', color: THEME.colors.warning },
    { label: 'Yüksek', color: '#F97316' },
    { label: 'Kritik', color: THEME.colors.danger },
  ];

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

  // Camera Handler
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Kamera izni gerekiyor. Lütfen ayarlardan izin verin.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      alert('Kamera açılamadı: ' + e.message);
    }
  };

  // Gallery Picker Handler
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Galeri erişim izni gerekiyor.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      alert('Galeri açılamadı: ' + e.message);
    }
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
      alert('Lütfen bir başlık veya açıklama girin.');
      return;
    }

    const selectedFriend = friends.find((f) => f.id === selectedFriendId) || friends[0];
    if (!selectedFriend) {
      alert('Lütfen bir aga / kişi seçin.');
      return;
    }

    let finalAmount = 0;
    if (recordType === 'debt') {
      const parsed = parseFloat(amount.replace(',', '.'));
      if (!parsed || parsed <= 0) {
        alert('Geçerli bir hesap tutarı giriniz.');
        return;
      }
      finalAmount = splitMode === 'split' ? Math.round(parsed / splitCount) : parsed;
    }

    const itemIcon =
      recordType === 'item'
        ? categories.find((c) => c.label === category)?.icon || 'package-variant'
        : 'cash';

    const newItemData = {
      title: title.trim(),
      type: recordType,
      friendId: selectedFriend.id,
      friendName: selectedFriend.name,
      notes: notes.trim(),
      dueDate: getCalculatedDueDate(),
      imageUri: imageUri, // Attached proof photo or receipt
      category: recordType === 'item' ? category : 'Ortak Hesap',
      urgency: recordType === 'item' ? urgency : 'Yüksek',
      amount: finalAmount,
      icon: itemIcon,
      isSplit: recordType === 'debt' && splitMode === 'split',
      splitCount: recordType === 'debt' && splitMode === 'split' ? splitCount : 1,
      originalTotal: recordType === 'debt' && splitMode === 'split' ? parseFloat(amount) : null,
    };

    addItem(newItemData);
  };

  const isItem = recordType === 'item';
  const activeColor = isItem ? THEME.colors.blue : THEME.colors.purple;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <MaterialCommunityIcons name="close" size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Kayıt Aç</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSubmit}>
          <Text style={styles.saveHeaderText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Type Toggle: Emanet Eşya vs Borç / Fiş */}
        <View style={styles.typeSelectorWrapper}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              isItem && { backgroundColor: THEME.colors.blue, borderColor: THEME.colors.blue },
            ]}
            activeOpacity={0.8}
            onPress={() => setRecordType('item')}
          >
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={18}
              color={isItem ? '#FFFFFF' : THEME.colors.textMuted}
            />
            <Text style={[styles.typeButtonText, isItem && styles.activeTypeText]}>
              Emanet Eşya
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              !isItem && { backgroundColor: THEME.colors.purple, borderColor: THEME.colors.purple },
            ]}
            activeOpacity={0.8}
            onPress={() => setRecordType('debt')}
          >
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={18}
              color={!isItem ? '#FFFFFF' : THEME.colors.textMuted}
            />
            <Text style={[styles.typeButtonText, !isItem && styles.activeTypeText]}>
              Borç / Adisyon
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Title Input */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>
            {isItem ? 'NE VERDİN? (EŞYA TANIMI)' : 'NE HARCANDI? (HESAP / ADİSYON)'}
          </Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder={isItem ? 'Örn: Gri Zara Hırka, PlayStation Kolu, Matkap...' : 'Örn: Kadıköy Dürümcü, Starbucks, Halısaha...'}
              placeholderTextColor={THEME.colors.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* 2. Photo / Receipt Proof Card (NEW & RICH) */}
        <View style={styles.fieldSection}>
          <View style={styles.photoHeaderRow}>
            <Text style={styles.fieldLabel}>
              {isItem ? '📸 EŞYANIN DURUM FOTOĞRAFI (KANIT)' : '🧾 FİŞ / ADİSYON FOTOĞRAFI (KANIT)'}
            </Text>
            {imageUri && (
              <View style={styles.photoAttachedBadge}>
                <MaterialCommunityIcons name="check-circle" size={12} color={THEME.colors.success} />
                <Text style={styles.photoAttachedText}>Eklendi</Text>
              </View>
            )}
          </View>

          {imageUri ? (
            <View style={styles.imagePreviewCard}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <View style={styles.imageActionsRow}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={handleTakePhoto}
                >
                  <MaterialCommunityIcons name="camera-retake" size={15} color={THEME.colors.primary} />
                  <Text style={styles.retakeBtnText}>Yeniden Çek</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setImageUri(null)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={15} color={THEME.colors.danger} />
                  <Text style={styles.removeImageText}>Kaldır</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoPickerBox}>
              <View style={styles.photoPickerLeft}>
                <MaterialCommunityIcons
                  name={isItem ? 'camera-outline' : 'receipt-outline'}
                  size={28}
                  color={activeColor}
                />
                <View style={styles.photoPickerTextCol}>
                  <Text style={styles.photoPickerTitle}>
                    {isItem ? 'Eşya Teslim Kanıtı Çek' : 'Adisyon / Fiş Fotoğrafı Ekle'}
                  </Text>
                  <Text style={styles.photoPickerSub}>
                    {isItem
                      ? 'Çizik veya sağlamlık durumunu kaydet, sonradan tartışma çıkmasın.'
                      : 'Fişi yükle, agam neye ne kadar ödediğini bilsin.'}
                  </Text>
                </View>
              </View>

              <View style={styles.photoButtonsRow}>
                <TouchableOpacity style={styles.photoActionBtn} onPress={handleTakePhoto}>
                  <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.photoActionText}>Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoActionBtnOutline} onPress={handlePickFromGallery}>
                  <MaterialCommunityIcons name="image" size={16} color={THEME.colors.primary} />
                  <Text style={styles.photoActionTextOutline}>Galeri</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 3. Debt Specific: Amount & Split Calculator */}
        {!isItem && (
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>HESAP VE BÖLÜŞÜM</Text>
            <View style={styles.amountInputCard}>
              <Text style={styles.currencySymbol}>₺</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={THEME.colors.textLight}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Split Mode Selector */}
            <View style={styles.splitToggleRow}>
              <TouchableOpacity
                style={[
                  styles.splitToggleBtn,
                  splitMode === 'direct' && styles.activeSplitToggle,
                ]}
                onPress={() => setSplitMode('direct')}
              >
                <Text
                  style={[
                    styles.splitToggleText,
                    splitMode === 'direct' && styles.activeSplitToggleText,
                  ]}
                >
                  Tek Kişiye Borç
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.splitToggleBtn,
                  splitMode === 'split' && styles.activeSplitToggle,
                ]}
                onPress={() => setSplitMode('split')}
              >
                <Text
                  style={[
                    styles.splitToggleText,
                    splitMode === 'split' && styles.activeSplitToggleText,
                  ]}
                >
                  Alman Usulü Bölüş
                </Text>
              </TouchableOpacity>
            </View>

            {/* Split Calculator */}
            {splitMode === 'split' && (
              <View style={styles.splitBox}>
                <View style={styles.splitHeader}>
                  <Text style={styles.splitTitle}>Masa Kaç Kişi?</Text>
                  <View style={styles.splitCounter}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setSplitCount(Math.max(2, splitCount - 1))}
                    >
                      <Text style={styles.counterBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{splitCount} Kişi</Text>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setSplitCount(splitCount + 1)}
                    >
                      <Text style={styles.counterBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {amount && parseFloat(amount) > 0 ? (
                  <View style={styles.splitResultRow}>
                    <Text style={styles.splitResultLabel}>Kişi Başına Düşen:</Text>
                    <Text style={styles.splitResultValue}>
                      {formatCurrency(Math.round(parseFloat(amount) / splitCount))}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* 4. Select Friend */}
        <View style={styles.fieldSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.fieldLabel}>KİME VERDİN? (MUHATAP AGA)</Text>
            <TouchableOpacity
              onPress={() => setShowAddFriendInput(!showAddFriendInput)}
            >
              <Text style={styles.addFriendLink}>
                {showAddFriendInput ? 'Vazgeç' : '+ Yeni Kişi'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddFriendInput && (
            <View style={styles.newFriendRow}>
              <TextInput
                style={styles.newFriendInput}
                placeholder="Aga adı (Örn: Caner)"
                placeholderTextColor={THEME.colors.textLight}
                value={newFriendName}
                onChangeText={setNewFriendName}
              />
              <TouchableOpacity
                style={styles.addFriendSubmitBtn}
                onPress={handleAddNewFriend}
              >
                <Text style={styles.addFriendSubmitText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsScroll}>
            {friends.map((f) => {
              const isSelected = f.id === selectedFriendId;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.friendCard,
                    isSelected && {
                      borderColor: activeColor,
                      backgroundColor: isItem ? THEME.colors.blueBg : THEME.colors.purpleBg,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFriendId(f.id)}
                >
                  <View
                    style={[
                      styles.friendAvatar,
                      isSelected && { backgroundColor: activeColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        isSelected && { color: '#FFFFFF' },
                      ]}
                    >
                      {f.avatar || f.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.friendCardName, isSelected && { color: activeColor, fontWeight: '800' }]}>
                    {f.name}
                  </Text>
                  <Text style={styles.friendScore}>Karma: {f.score}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. Item Specific: Category & Urgency */}
        {isItem && (
          <>
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>KATEGORİ</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((cat) => {
                  const isSelected = cat.label === category;
                  return (
                    <TouchableOpacity
                      key={cat.label}
                      style={[
                        styles.catButton,
                        isSelected && { borderColor: THEME.colors.blue, backgroundColor: THEME.colors.blueBg },
                      ]}
                      onPress={() => setCategory(cat.label)}
                    >
                      <MaterialCommunityIcons
                        name={cat.icon}
                        size={17}
                        color={isSelected ? THEME.colors.blue : THEME.colors.textMuted}
                      />
                      <Text style={[styles.catLabel, isSelected && { color: THEME.colors.blue, fontWeight: '700' }]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>ACİLİYET / DEĞER DÜZEYİ</Text>
              <View style={styles.urgencyRow}>
                {urgencyOptions.map((opt) => {
                  const isSelected = opt.label === urgency;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      style={[
                        styles.urgencyBtn,
                        isSelected && {
                          borderColor: opt.color,
                          backgroundColor: opt.color,
                        },
                      ]}
                      onPress={() => setUrgency(opt.label)}
                    >
                      <Text
                        style={[
                          styles.urgencyBtnText,
                          isSelected && { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* 6. Duration Options */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>İADE / ÖDEME SÜRESİ</Text>
          <View style={styles.durationRow}>
            {durationOptions.map((opt) => {
              const isSelected = opt.days === daysOption;
              return (
                <TouchableOpacity
                  key={opt.days}
                  style={[
                    styles.durationBtn,
                    isSelected && {
                      borderColor: activeColor,
                      backgroundColor: activeColor,
                    },
                  ]}
                  onPress={() => setDaysOption(opt.days)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      isSelected && { color: '#FFFFFF', fontWeight: '800' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 7. Extra Notes */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>NOTLAR (ÖRN: "CUMA GÜNÜ MAÇA GİDERKEN ALDI")</Text>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Aramızdaki özel durum veya not..."
              placeholderTextColor={THEME.colors.textLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Final Submit Button */}
        <TouchableOpacity
          style={[styles.bigSubmitBtn, { backgroundColor: activeColor }]}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons
            name={isItem ? 'package-variant' : 'receipt'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.bigSubmitBtnText}>
            {isItem ? 'Emanet Kaydını Aç' : 'Borç / Fiş Kaydını Aç'}
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
  },
  header: {
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
  cancelBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  saveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },
  saveHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: 60,
  },
  typeSelectorWrapper: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  activeTypeText: {
    color: '#FFFFFF',
  },
  fieldSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    fontSize: 14,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    padding: 0,
    outlineStyle: 'none',
  },
  // Photo proof section styles
  photoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoAttachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoAttachedText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.successDark,
  },
  photoPickerBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    gap: 12,
  },
  photoPickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoPickerTextCol: {
    flex: 1,
  },
  photoPickerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  photoPickerSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoActionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  photoActionTextOutline: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  imagePreviewCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#E2E8F0',
  },
  imageActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.danger,
  },
  // Amount & Split styles
  amountInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.purpleBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.purple,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    padding: 0,
    outlineStyle: 'none',
  },
  splitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  splitToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  activeSplitToggle: {
    borderColor: THEME.colors.purple,
    backgroundColor: THEME.colors.purpleBg,
  },
  splitToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  activeSplitToggleText: {
    color: THEME.colors.purple,
    fontWeight: '800',
  },
  splitBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: THEME.colors.purpleBorder,
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splitTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  splitCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: THEME.colors.purpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.purpleBorder,
  },
  counterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.purple,
  },
  counterValue: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  splitResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  splitResultLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  splitResultValue: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.purple,
  },
  // Friends
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addFriendLink: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.blue,
  },
  newFriendRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  newFriendInput: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
  addFriendSubmitBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFriendSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  friendsScroll: {
    gap: 8,
  },
  friendCard: {
    width: 82,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  friendAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  friendCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  friendScore: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  // Categories & Urgency
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  catLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  urgencyBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  urgencyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 6,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  notesCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notesInput: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    minHeight: 40,
    outlineStyle: 'none',
  },
  bigSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    marginTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bigSubmitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});

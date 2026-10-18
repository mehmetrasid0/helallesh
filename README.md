# ⚖️ Helallesh – Agalar Arası Emanet & Borç Adalet Asistanı

> **Slogan:** *"Ne eşyan çökülsün, ne paran yansın!"*  
> **Ders:** Mobile Application Development – Final Project  
> **Platform:** React Native (Expo) • iOS / Android / Web  

---

## 1. Proje Özeti ve Motivasyon (Problem Tanımı)
Arkadaş ve üniversite ortamlarında iki kronik dert vardır:
1. **Emanet Eşyalar:** Şarj aleti, hoodie/mont, kitap, kulaklık gibi eşyaların arkadaşlarda unutulması ve *"o benim"* demeye utanılması.
2. **Ortak Harcamalar & Borçlar:** Masada bölüşülen döner/kahve, gece taksi payı veya *"kanka 100 ₺ ateşlesene"* denip aylarca üstüne yatılan borçlar.

**Helallesh**, bu derdi oyunlaştırılmış bir agalar jargonu ve tam fonksiyonel bir mobil mimariyle çözer. Uygulama, emanet ve borçları takip eder, gününde getirmeyenlere hazır mizahi WhatsApp darlama mesajları ve resmi mahkeme celbi formatında **T.C. Helallesh İcra Tebligatı** üretir. Gününde getirenlerin ise **Helallik Skoru (Karma)** yükselir.

---

## 2. Tech Stack & Mimari
- **Framework:** React Native (Expo SDK 58)
- **Dil:** JavaScript (ES6+), React 19
- **State Management:** React Context API (`AppContext`)
- **Kalıcı Depolama (Local DB):** `@react-native-async-storage/async-storage` (uygulama kapansa da tüm veriler korunur)
- **İkonlar & Tasarım:** `@expo/vector-icons` (MaterialCommunityIcons), Özel Dark/Slate Neon Tasarım Sistemi
- **Platform Uyumluluğu:** Android (APK / Expo Go), iOS, Web Browser

---

## 3. Temel Özellikler ve Ekranlar (5 Ekran)

### 📱 1. Pano (DashboardScreen)
- **Canlı Bilanço Kartları:** *İçerideki Para (₺)*, *Dışarıdaki Eşyalar (Adet)*, *İcra Kapısında (Gecikenler)*.
- **Dinamik Arama Çubuğu:** Eşya adına, kategoriye veya arkadaş adına göre anlık filtreleme.
- **Filtre Sekmeleri:** *Tümü*, *🎒 Emanetler*, *💸 Borçlar*, *🚨 Gecikenler*, *✅ Helalleşildi*.
- **Hızlı Aksiyon:** Tek tıkla "Helalleş" butonu ile kaydı tamamlama.

### ➕ 2. Kayıt Aç (AddItemScreen)
- **Çift Modlu Form:** *Emanet Eşya* veya *Borç / Ortak Hesap* seçimi.
- **Ortak Hesap & Bölüşüm Hesaplayıcı:** Toplam tutarı kişi sayısına bölerek kişi başı alacağı anında otomatik hesaplama.
- **Kategori & Aciliyet Seçimi:** *Kıyafet, Elektronik, Kitap, Oyun, Aksesuar* ve *Helal Etmem! 💀* aciliyet seviyeleri.
- **Kanka Seçici & Hızlı Yeni Kanka Ekleme:** Mevcut arkadaşlardan seçme veya anında yenisini ekleme.

### 🔍 3. Kayıt Detay & Darlama Merkezi (DetailScreen)
- Kalan gün veya gecikme sayacı (*"4 gün gecikti (Üstüne Yattı 🚨)"*).
- **WhatsApp Darlama Asistanı:** *Hafif Hatırlatma ☕*, *Agalar Usulü Sitem 🤨* ve *Nükleer Darlama 🚨* mesaj şablonları. Tek tıkla kopyalama veya direkt WhatsApp'a yönlendirme.
- **T.C. Helallesh İcra Tebligatı Çıkar:** Mahkeme celbi formatında esprili resmi tebligat üretimi.
- **Helalleşildi Butonu:** Eşyayı/parayı geri aldığında kankanın güvenilirlik skoruna **+8 puan** ekler.

### 👥 4. Agalar Karnesi & Sabıkalılar (FriendsScreen)
- Kankaların güvenilirlik ve karma skorları (100 üzerinden).
- Rütbeler: *👑 Onurlu Kanka (90+)*, *👍 Güvenilir Aga (70+)*, *⚠️ Gözü Üzerinde (50+)*, *🚨 Kronik Çökücü (<50)*.
- Her arkadaşın sendeki emanet ve borç bilançosu (*Örn: "Ahmet: 1 emanet, 350 ₺ içeride"*).

### 📊 5. Helallesh Raporu (StatsScreen)
- Genel Helalleşme Başarı Oranı (% başarı).
- Toplam Kurtarılan Para (₺).
- En Çok Çökülenler Endeksi (Kıyafet %80, Şarj Aleti %65, Taksi %50).
- Ayın En Güvenilir Kankası ve Ayın Zula & Çöküş Adayı.

---

## 4. Kurulum ve Çalıştırma (Setup & Run)

Projeyi çalıştırmak için bilgisayarında Node.js kurulu olması yeterlidir:

```bash
# 1. Proje dizinine git
cd helallesh

# 2. Bağımlılıkları yükle (zaten yüklü ise gerekmez)
npm install

# 3. Web tarayıcısında anında başlatmak için:
npx expo start --web

# 4. Cep telefonunda (Expo Go uygulaması ile) çalıştırmak için:
npx expo start
# Ekrana gelen QR kodu telefonun kamerasıyla veya Expo Go ile tara!
```

---

## 5. Git Commit Geçmişi (Version Control)
Hocanın *"Instead of one big commit, a timeline of commits is expected"* kuralına uygun olarak oluşturulan commit zinciri:
1. `chore: initial expo project setup for Helallesh`
2. `feat: install AsyncStorage, vector icons and web runtime dependencies`
3. `feat: implement core screens (Dashboard, Add, Detail, Friends, Stats) with AsyncStorage and Tebligat modal`

---
*Geliştirici: Raşid — Mobile Application Development Final Project*

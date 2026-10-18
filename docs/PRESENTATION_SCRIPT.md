# Helallesh – 7-10 Minute Project Presentation Script
## Mobile Application Development Final Exam Presentation

- **Presenter:** Mehmet Raşid (rasid / mehmetrasid0)
- **App Name:** **Helallesh** (*"Ne eşyan çökülsün, ne paran yansın!"*)
- **Instructor:** Assist. Prof. Dr. Zeki Özen
- **Target Duration:** 7 to 10 Minutes
- **Live Demo Link:** [https://expo.dev/accounts/mehmetrasid0/projects/helallesh](https://expo.dev/accounts/mehmetrasid0/projects/helallesh)

---

## ⏱ Presentation Timeline & Slide Breakdown

```
[00:00 - 01:30] Slide 1: Introduction, Problem Definition & The "Awkward Debt" Dilemma
[01:30 - 02:45] Slide 2: Target User Group & The Helallesh Solution Concept
[02:45 - 04:30] Slide 3: Tech Stack & System Architecture
[04:30 - 07:00] Slide 4: Live Demo / Walkthrough of 5 Core Screens & Tebligat Generator
[07:00 - 08:30] Slide 5: Technical Challenges & Engineering Solutions
[08:30 - 09:30] Slide 6: Future Improvements & Q&A Conclusion
```

---

## Slide 1: Introduction & The Problem (00:00 – 01:30)

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Hocam ve değerli arkadaşlar, hepinize merhaba. Bugün sizlere bitirme projem olan **Helallesh** uygulamasını sunacağım.
> 
> Üniversite hayatında veya arkadaş çevresinde hepimizin yaşadığı klasik bir senaryo vardır: Bir arkadaşımıza ders notu, kulaklık, şarj aleti veya PlayStation kolu veririz. Ya da yemekhanede veya restoranda hesabı birimiz öder, 'sonra atarsın' denir. 
> 
> Ancak bir süre sonra iki temel problem ortaya çıkar:
> 1. **Unutkanlık:** Kimin kime ne kadar borcu vardı, eşyayı ne zaman vermiştik tamamen unutulur.
> 2. **Sosyal Çekinme:** Arkadaşımıza 'kanka benim 150 lirayı ne zaman atacaksın' veya 'montumu getirdin mi' diye sormak insanı mahcup hissettirir, ayıp olmasın diye susarız ve eşyalar da paralar da kaybolur.
> 
> İşte **Helallesh**, bu sosyal sürtünmeyi ortadan kaldırmak için doğdu. Sloganımız: *'Ne eşyan çökülsün, ne paran yansın!'*"

### 🇬🇧 English Speaker Notes
> "Hello everyone. Today I'm presenting my mobile final project: **Helallesh**. 
> In college and social life, we constantly lend books, gear, and split bills. But two huge problems arise: we either forget them over time, or we feel too socially awkward to ask a close friend for a small debt back. 
> Helallesh solves this exact pain point by replacing awkwardness with gamified comedy and clear accountability."

---

## Slide 2: Target Group & Solution (01:30 – 02:45)

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Uygulamamızın hedef kitlesi özellikle **üniversite öğrencileri, ev arkadaşları ve sıkı arkadaş grupları**.
> 
> Piyasada Splitwise gibi sadece hesap bölen ya da Excel benzeri soğuk finans uygulamaları var. Ancak hiçbiri öğrenci kültürünün dinamiklerini taşımıyor. Helallesh üç temel yenilikle fark yaratıyor:
> 1. **İki Yönlü Takip (Bidirectional Balance):** Sadece alacaklı olduğum değil, borçlu olduğum şeyleri de kaydedebiliyorum. Sistem bana anında net bakiyemi söylüyor: *'+250 ₺ Agalar Sana Borçlu'*.
> 2. **Fotoğraflı Kanıt (Photo Proofing):** Eşyayı teslim ederken kondisyonunu, ya da hesabı ödediğimde fişin fotoğrafını tek tıkla kamerayla çekip sisteme iliştirebiliyorum.
> 3. **Helallesh Adli Tebligat Jeneratörü:** Hatırlatmayı resmi ve sıkıcı bir dille yapmak yerine, mizahi bir 'ağır ceza / icra tebligatı' formatıyla WhatsApp üzerinden arkadaşımıza resmi bir mahkeme celbi gibi gönderiyoruz. Böylece arkadaşımız kırılmıyor, aksine gülerek borcunu ödüyor."

---

## Slide 3: Tech Stack & Architecture (02:45 – 04:30)

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Gelelim teknik altyapıya. Projede **React Native** ve en güncel **Expo SDK 52** kullandım.
> 
> - **Navigasyon:** `@react-navigation/native-stack` ve `bottom-tabs` (v7) ile ekranlar arası akıcı, native geçişler sağladık.
> - **Durum Yönetimi (State Management):** React Context API ve `useReducer` mimarisi kurduk. Tek bir `ItemsContext` üzerinden tüm hesaplamalar, filtrelemeler ve bakiye güncellemeleri anlık olarak reaktif bir şekilde tetikleniyor.
> - **Kalıcı Depolama (Persistent Storage):** `@react-native-async-storage/async-storage` kullandık. Uygulama tamamen offline-first çalışıyor, internet olmasa bile tüm kayıtlar yerel bellekte JSON olarak saklanıyor ve açılışta anında yükleniyor.
> - **Donanım ve Yerel API Entegrasyonu:** `expo-image-picker` ile cihazın kamerasını ve fotoğraf galerisini entegre ettik. `Linking` ve `Share` API'leri ile doğrudan işletim sisteminin native WhatsApp uygulamasına mesaj ve fiş fırlatıyoruz.
> - **Tasarım:** Yapay zekavari şablonlardan uzak; Apple ve Linear sadeliğinde, Slate gri zemin, Midnight Navy başlıklar, mavi ve mor aksanlarla göz yormayan özel bir tasarım sistemi oluşturduk."

---

## Slide 4: Live Demo & Key Screens (04:30 – 07:00)

*(Bu bölümde Expo Go üzerinden veya web tarayıcısından uygulama gösterilir)*

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Şimdi uygulamamızın canlı akışını 5 ana ekran üzerinden inceleyelim:
> 
> 1. **Ana Sayfa (Dashboard):** En üstte bizi dinamik bir 'Net Bakiye' kartı karşılıyor. Hemen altında 'Tümü', 'Emanetler', 'Borçlar', 'Gecikenler' filtreleri var. Her kartta emanetin türü, kime ait olduğu ve 'Verdim / Aldım' yön rozeti renk kodlarıyla yer alıyor.
> 
> 2. **Kayıt Ekleme (Add Screen):** '+ Yeni Kayıt' butonuna bastığımızda açılan formda 'Verdim (Alacaklıyım)' veya 'Aldım (Borçluyum)' seçimi yapıyoruz. Emanet eşya mı yoksa para mı belirleyip, kameradan fiş veya eşya fotoğrafını ekleyebiliyoruz.
> 
> 3. **Detay ve Tebligat Ekranı (Detail Screen):** Bir kayda tıkladığımızda eklenen fiş fotoğrafını büyütebiliyoruz. Eğer borcu ödediysek 'Hesabı Kapat' diyoruz. Eğer arkadaşımız hala getirmediyse 'Helallesh Tebligatı Gönder' butonuna basıyoruz. Burada 4 farklı hazır şablonumuz var: *Ağır Ceza Mahkemesi, Dost Meclisi İhtarı, İcra Tebligatı*. 'WhatsApp ile Yolla' dediğimiz anda doğrudan arkadaşın sohbetine tebligat metni düşüyor.
> 
> 4. **Agalar Ekranı (Friends Screen):** Hangi arkadaşımla ne kadar net bakiyem olduğunu özetliyor. Örneğin Mert'ten 250 TL alacağım varken, Burak'a 40 TL borcum olduğunu görüyorum. Ayrıca 'Tümünü Helalleş' butonuyla tek tıkla o kişiyle olan tüm aktif hesapları kapatabiliyorum.
> 
> 5. **Özet & Karma Ekranı (Stats Screen):** Burada kullanıcıya 0 ile 100 arasında bir 'Helallik Skoru' hesaplanıyor. Zamanında geri dönen eşyalar, toplam dönen sermaye ve borç sadakat oranını grafiksel olarak sunuyoruz."

---

## Slide 5: Technical Challenges & Solutions (07:00 – 08:30)

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Geliştirme sürecinde karşılaştığım ve çözdüğüm önemli teknik zorluklar şunlar oldu:
> 
> 1. **Expo Go SDK 52 Uyum Sorunu:** App Store'daki güncel Expo Go uygulaması SDK 52 gerektiriyordu. Tüm bağımlılıkları ve Babel/Metro konfigürasyonlarını SDK 52'ye yükselterek fiziksel cihazda sıfır hatayla çalışmasını sağladım.
> 2. **Dinamik Ağ ve Yerel IP Tespiti:** Telefonu bilgisayara Wi-Fi veya kişisel erişim noktası (Hotspot) üzerinden bağlarken IP adresi sürekli değişiyordu. Bunu çözmek için PowerShell ile aktif IPv4 adresini otomatik bulan ve Metro'yu buna bağlayan bir `start-lan.bat` betiği yazdım.
> 3. **İki Yönlü Borç/Alacak Matematiksel Birleştirme:** Bir arkadaşımızla hem alacaklı hem borçlu olabileceğimiz durumlar için `ItemsContext` içine cebirsel bir matris algoritması yazdık; böylece karmaşık borç ilişkilerini tek bir net sonuca indirgedik."

---

## Slide 6: Future Improvements & Conclusion (08:30 – 09:30)

### 🇹🇷 Sunum Konuşması (Türkçe)
> "Gelecek versiyonlar için planlanan geliştirmeler:
> 1. **Supabase / Firebase Entegrasyonu:** Arkadaşlar arasında çift taraflı senkronizasyon (ben kayıt açtığımda arkadaşımın telefonuna da bildirim düşmesi).
> 2. **Push Bildirimleri:** Teslim tarihine 24 saat kala otomatik esprili tebligat bildirimleri.
> 3. **Sesli Adli Tebligat:** Yapay zeka ses motoruyla 'Kardeşim o emanet ne oldu?' şeklinde esprili resmi ses kaydı gönderme.
> 
> Projemin tüm kaynak kodları, commit geçmişi ve dokümantasyonu GitHub repomda ve EAS bulut platformunda yer almaktadır.
> Dinlediğiniz için teşekkür ederim, sorularınız varsa yanıtlamaktan mutluluk duyarım."

---

## 💡 Quick Q&A Preparation Cheat-Sheet for Presenter

- **Q: Neden SQLite değil de AsyncStorage tercih ettin?**  
  *A: Uygulamanın veri modeli ilişkisel karmaşıklıktan ziyade belge (document/JSON) tabanlı ve hafif. AsyncStorage, React Native ekosisteminde sıfır konfigürasyonla cross-platform (iOS, Android, Web) çalışan en stabil ve hızlı no-SQL anahtar-değer deposudur.*
  
- **Q: WhatsApp API'si için üçüncü parti servis kullandın mı?**  
  *A: Hayır, hiçbir ücretli API veya sunucuya ihtiyaç duymadan React Native'in native `Linking.openURL` şeması üzerinden doğrudan cihazdaki WhatsApp uygulamasına deep-link yaptık. Bu sayede hem sıfır maliyetli hem de tamamen gizlilik odaklı oldu.*

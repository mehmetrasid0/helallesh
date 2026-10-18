export const DARLAMA_TEMPLATES = {
  item: [
    {
      id: 'item_light_1',
      level: 'Hafif Hatırlatma ☕',
      text: (friendName, itemName) => 
        `Selam ${friendName}! Geçen aldığın ${itemName} sende miydi hala? Lazım olmaya başladı da, müsait olunca paslarsın aga.`
    },
    {
      id: 'item_medium_1',
      level: 'Agalar Usulü Sitem 🤨',
      text: (friendName, itemName) => 
        `Aga ${itemName} sende üşümüyor mu? Emanet verdiğim gün tarihte çağ açılıp kapandı, velayetini üstüne mi aldın naptın?`
    },
    {
      id: 'item_medium_2',
      level: 'Hava Durumu Raporu 🌦️',
      text: (friendName, itemName) => 
        `Kardeşim meteoroloji uyardı, havalar soğuyor. Bendeki ${itemName} sende kış uykusuna yattı galiba. Bi ara iade edelim onu ya.`
    },
    {
      id: 'item_hard_1',
      level: '🚨 Nükleer Darlama (Çöküş Alarmı)',
      text: (friendName, itemName) => 
        `DİKKAT ${friendName.toUpperCase()}! ${itemName} isimli eşyam envanterinde kayıp statüsüne düşmek üzere. Helallesh uygulaması üzerinden sana 24 saat süre verildi, yoksa Sabıkalılar Koğuşuna düşeceksin!`
    }
  ],
  debt: [
    {
      id: 'debt_light_1',
      level: 'Hafif Hatırlatma 💸',
      text: (friendName, amount, desc) => 
        `Kanka selam! ${desc || 'Geçenki harcama'} için bana düşen ${amount} ₺ vardı ya, IBAN'a müsait olduğunda ateşleyebilir misin?`
    },
    {
      id: 'debt_medium_1',
      level: 'Göz Hakkı & Enflasyon 📈',
      text: (friendName, amount, desc) => 
        `Aga o ${amount} ₺ borçla o gün altın alsaydık şu an zengindik. Şaka bir yana ${desc || 'bizim hesabı'} ne zaman helalleşiyoruz?`
    },
    {
      id: 'debt_hard_1',
      level: '⚖️ Resmi İcra Tebligatı',
      text: (friendName, amount, desc) => 
        generateTebligatText(friendName, amount, desc)
    }
  ]
};

export const generateTebligatText = (friendName, amount, desc) => {
  return `📜 **T.C. HELALLESH AGALAR İCRA DAİRESİ** 📜
Dosya No: HL-${Math.floor(1000 + Math.random() * 9000)}
Muhatap: Sayın ${friendName}
Borç Konusu: ${desc || 'Agalar Arası Ortak Harcama / Borç'}
Asıl Alacak Tutarı: ${amount} ₺
Gecikme Cezası: 1 adet Orta Boy Çiğ Köfte Dürüm + Çay

Yukarıda mezkur borcun derhal ve nakden hak sahibinin IBAN adresine intikal ettirilmesi, aksi takdirde arkadaş grubundaki Helallik Skorunuzun (Karma) "Kronik Çökücü" seviyesine tenzil edileceği tebliğ olunur.

Saygılarımızla,
Helallesh Yüksek Adalet Konseyi ⚖️`;
};

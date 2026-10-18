export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const calculateDaysStatus = (dueDateString) => {
  if (!dueDateString) return { status: 'normal', text: 'Tarih yok', days: 0 };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      status: 'overdue',
      text: `${Math.abs(diffDays)} gün gecikti (Üstüne Yattı 🚨)`,
      days: diffDays,
      badgeColor: '#F43F5E',
      badgeBg: 'rgba(244, 63, 94, 0.15)',
    };
  } else if (diffDays === 0) {
    return {
      status: 'due_today',
      text: 'Bugün son gün! ⏰',
      days: 0,
      badgeColor: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
    };
  } else {
    return {
      status: 'upcoming',
      text: `${diffDays} gün kaldı`,
      days: diffDays,
      badgeColor: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
    };
  }
};

export const getFriendBadge = (score) => {
  if (score >= 90) return { title: 'Onurlu Kanka 👑', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (score >= 70) return { title: 'Güvenilir Aga 👍', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
  if (score >= 50) return { title: 'Gözü Üzerinde ⚠️', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
  return { title: 'Kronik Çökücü 🚨', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)' };
};

import { THEME } from '../constants/theme';

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
      text: `${Math.abs(diffDays)} gün gecikti`,
      subText: 'İade süresi doldu',
      days: diffDays,
      badgeColor: THEME.colors.danger,
      badgeBg: THEME.colors.dangerBg,
      badgeBorder: THEME.colors.dangerBorder,
    };
  } else if (diffDays === 0) {
    return {
      status: 'due_today',
      text: 'Bugün son gün',
      subText: 'Helalleşme vakti',
      days: 0,
      badgeColor: THEME.colors.warning,
      badgeBg: THEME.colors.warningBg,
      badgeBorder: THEME.colors.warningBorder,
    };
  } else {
    return {
      status: 'upcoming',
      text: `${diffDays} gün kaldı`,
      subText: 'Zamanında',
      days: diffDays,
      badgeColor: THEME.colors.textSecondary,
      badgeBg: THEME.colors.surfaceSubtle,
      badgeBorder: THEME.colors.border,
    };
  }
};

export const getFriendBadge = (score) => {
  if (score >= 90) return { title: 'Güvenilir', color: THEME.colors.success, bg: THEME.colors.successBg };
  if (score >= 70) return { title: 'Standart', color: THEME.colors.accent, bg: THEME.colors.accentLight };
  if (score >= 50) return { title: 'Takipte', color: THEME.colors.warning, bg: THEME.colors.warningBg };
  return { title: 'Riskli', color: THEME.colors.danger, bg: THEME.colors.dangerBg };
};

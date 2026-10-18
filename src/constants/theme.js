// Helallesh Semantic & Human-Crafted Design System
// Core Palette: Blue (Trust & Items), Red (Overdue & Alert), Purple (Split & Receipts), Pure White cards on Slate canvas

export const THEME = {
  colors: {
    // Canvas & Surfaces (No stark all-white blinding page; rich slate background + crisp white elevated cards)
    background: '#F1F5F9',       // Cool slate-tinted canvas (provides rich contrast for white cards)
    surface: '#FFFFFF',          // Pure white card surface
    surfaceElevated: '#FFFFFF',
    surfaceSubtle: '#F8FAFC',    // Very soft neutral container
    surfaceMuted: '#E2E8F0',
    
    border: '#E2E8F0',           // Crisp hairline border
    borderSubtle: '#EDF2F7',
    borderFocus: '#2563EB',
    
    // Header & Brand
    headerBg: '#0F172A',         // Deep Slate / Midnight Navy (gives solid grounding and prestige)
    headerText: '#FFFFFF',
    headerSubtext: '#94A3B8',
    
    // Primary & Accent Colors
    primary: '#0F172A',          // Deep slate
    primaryHover: '#1E293B',
    
    // 🔵 BLUE (Emanet Eşyalar & Güven)
    blue: '#2563EB',             // Royal Cobalt Blue
    blueDark: '#1D4ED8',
    blueBg: '#EFF6FF',
    blueBorder: '#BFDBFE',
    
    // 🔴 RED (Gecikenler, İcra & Çökülme Tehlikesi)
    danger: '#DC2626',           // Crimson Red
    dangerDark: '#991B1B',
    dangerBg: '#FEF2F2',
    dangerBorder: '#FECACA',
    
    // 🟣 PURPLE (Ortak Masa, Alman Usulü Hesap & Fişler)
    purple: '#7C3AED',           // Vivid Violet
    purpleDark: '#6D28D9',
    purpleBg: '#F5F3FF',
    purpleBorder: '#DDD6FE',
    
    // 🟢 GREEN (Helalleşildi & Temiz Sicil)
    success: '#059669',          // Emerald Green
    successDark: '#047857',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    
    // 🟡 AMBER (Günü Yaklaşanlar)
    warning: '#D97706',          // Amber Orange
    warningBg: '#FFFBEB',
    warningBorder: '#FDE68A',
    
    // Neutral & Text Hierarchy (High-contrast, no tiny washed-out grays)
    textPrimary: '#0F172A',      // Pure deep ink
    textSecondary: '#334155',    // Slate text
    textMuted: '#64748B',        // Readable neutral text
    textLight: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Shadows
    shadowCard: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    shadowSm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    full: 9999,
  },
};

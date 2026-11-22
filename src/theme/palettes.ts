export type ThemeKey = 'blue' | 'amber' | 'purple' | 'emerald';

export interface CardThemePalette {
  key: ThemeKey;
  name: string;
  // Dynamic card backgrounds & borders
  cardBg: string;
  cardHoverBg: string;
  border: string;
  borderHover: string;
  // Glassmorphic / Gradient Square Icon Block
  iconBgStart: string;
  iconBgEnd: string;
  iconBorder: string;
  iconShadow: string;
  // Rich color-matched typography
  titleText: string;
  valueText: string;
  labelText: string;
  subText: string;
  // Badges & Pills
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  secondaryBadgeBg: string;
  secondaryBadgeText: string;
  // Card Hover Shadow
  cardShadow: string;
}

export const CARD_THEMES: Record<ThemeKey, CardThemePalette> = {
  blue: {
    key: 'blue',
    name: 'Ocean Blue',
    cardBg: '#EFF6FF',
    cardHoverBg: '#E0F2FE',
    border: '#BFDBFE',
    borderHover: '#3B82F6',
    iconBgStart: '#3B82F6',
    iconBgEnd: '#1D4ED8',
    iconBorder: '#60A5FA',
    iconShadow: 'rgba(37, 99, 235, 0.38)',
    titleText: '#1E3A8A',
    valueText: '#172554',
    labelText: '#1D4ED8',
    subText: '#2563EB',
    badgeBg: '#DBEAFE',
    badgeBorder: '#93C5FD',
    badgeText: '#1E40AF',
    secondaryBadgeBg: '#E0F2FE',
    secondaryBadgeText: '#0369A1',
    cardShadow: 'rgba(37, 99, 235, 0.16)',
  },
  amber: {
    key: 'amber',
    name: 'Vibrant Amber',
    cardBg: '#FFFBEB',
    cardHoverBg: '#FEF3C7',
    border: '#FDE68A',
    borderHover: '#F59E0B',
    iconBgStart: '#F59E0B',
    iconBgEnd: '#D97706',
    iconBorder: '#FBBF24',
    iconShadow: 'rgba(217, 119, 6, 0.38)',
    titleText: '#78350F',
    valueText: '#451A03',
    labelText: '#B45309',
    subText: '#D97706',
    badgeBg: '#FEF3C7',
    badgeBorder: '#FCD34D',
    badgeText: '#92400E',
    secondaryBadgeBg: '#FFEDD5',
    secondaryBadgeText: '#C2410C',
    cardShadow: 'rgba(245, 158, 11, 0.18)',
  },
  purple: {
    key: 'purple',
    name: 'Royal Purple',
    cardBg: '#FAF5FF',
    cardHoverBg: '#F3E8FF',
    border: '#E9D5FF',
    borderHover: '#A855F7',
    iconBgStart: '#A855F7',
    iconBgEnd: '#7E22CE',
    iconBorder: '#C084FC',
    iconShadow: 'rgba(126, 34, 206, 0.38)',
    titleText: '#581C87',
    valueText: '#3B0764',
    labelText: '#7E22CE',
    subText: '#9333EA',
    badgeBg: '#F3E8FF',
    badgeBorder: '#D8B4FE',
    badgeText: '#6B21A8',
    secondaryBadgeBg: '#EDE9FE',
    secondaryBadgeText: '#5B21B6',
    cardShadow: 'rgba(147, 51, 234, 0.16)',
  },
  emerald: {
    key: 'emerald',
    name: 'Lush Emerald',
    cardBg: '#ECFDF5',
    cardHoverBg: '#D1FAE5',
    border: '#A7F3D0',
    borderHover: '#10B981',
    iconBgStart: '#10B981',
    iconBgEnd: '#047857',
    iconBorder: '#34D399',
    iconShadow: 'rgba(5, 150, 105, 0.38)',
    titleText: '#064E3B',
    valueText: '#022C22',
    labelText: '#047857',
    subText: '#059669',
    badgeBg: '#D1FAE5',
    badgeBorder: '#6EE7B7',
    badgeText: '#065F46',
    secondaryBadgeBg: '#CCFBF1',
    secondaryBadgeText: '#0F766E',
    cardShadow: 'rgba(16, 185, 129, 0.16)',
  },
};

export const THEME_KEYS: ThemeKey[] = ['blue', 'amber', 'purple', 'emerald'];

export function getStudentTheme(studentId: number, course?: string): CardThemePalette {
  const courseHash = course
    ? course
        .trim()
        .toUpperCase()
        .split('')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    : 0;
  const index = Math.abs(studentId + courseHash) % THEME_KEYS.length;
  return CARD_THEMES[THEME_KEYS[index]];
}

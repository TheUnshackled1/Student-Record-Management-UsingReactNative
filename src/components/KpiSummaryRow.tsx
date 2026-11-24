import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Student } from '../types/student';
import { CARD_THEMES, CardThemePalette } from '../theme/palettes';
import {
  LayersIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from './BoldIcons';

interface KpiSummaryRowProps {
  students: Student[];
}

interface KpiCardConfig {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  theme: CardThemePalette;
  renderIcon: () => React.ReactNode;
}

const KpiCardItem: React.FC<{ item: KpiCardConfig }> = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const animateLift = (toValue: number, isHovered: boolean) => {
    setHovered(isHovered);
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const { theme } = item;

  const webCardStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: hovered
            ? `linear-gradient(145deg, ${theme.cardHoverBg} 0%, ${theme.cardBg} 100%)`
            : `linear-gradient(145deg, ${theme.cardBg} 0%, #FFFFFF 100%)`,
          boxShadow: hovered
            ? `0 14px 28px -6px ${theme.cardShadow}, 0 4px 10px -2px ${theme.cardShadow}`
            : `0 4px 12px -2px ${theme.cardShadow}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          cursor: 'pointer',
        } as unknown as object)
      : {};

  const webIconBlockStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${theme.iconBgStart} 0%, ${theme.iconBgEnd} 100%)`,
          boxShadow: `0 8px 18px -3px ${theme.iconShadow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
        } as unknown as object)
      : {};

  return (
    <Pressable
      style={styles.cardWrapper}
      onHoverIn={() => animateLift(-5, true)}
      onHoverOut={() => animateLift(0, false)}
      onPressIn={() => animateLift(-3, true)}
      onPressOut={() => animateLift(0, false)}
    >
      <Animated.View
        style={[
          styles.kpiCard,
          {
            backgroundColor: hovered ? theme.cardHoverBg : theme.cardBg,
            borderColor: hovered ? theme.borderHover : theme.border,
            shadowColor: theme.iconBgEnd,
            transform: [{ translateY }],
          },
          webCardStyle,
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconBlock,
              {
                backgroundColor: theme.iconBgStart,
                borderColor: theme.iconBorder,
                shadowColor: theme.iconBgEnd,
              },
              webIconBlockStyle,
            ]}
          >
            {item.renderIcon()}
          </View>

          <View
            style={[
              styles.pillBadge,
              {
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
              },
            ]}
          >
            <Text style={[styles.pillText, { color: theme.badgeText }]}>
              {item.subtitle}
            </Text>
          </View>
        </View>

        <Text style={[styles.kpiValue, { color: theme.valueText }]}>
          {item.value}
        </Text>
        <Text style={[styles.kpiLabel, { color: theme.labelText }]}>
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const KpiSummaryRow: React.FC<KpiSummaryRowProps> = ({ students }) => {
  const totalStudents = students.length;

  const uniqueCourses = new Set(
    students.map((s) => s.course.trim().toUpperCase()).filter(Boolean)
  ).size;

  const pendingOrFreshmen = students.filter((s) => s.age <= 20).length;

  const averageAge =
    totalStudents > 0
      ? Math.round(
          (students.reduce((sum, s) => sum + s.age, 0) / totalStudents) * 10
        ) / 10
      : 0;

  const kpiCards: KpiCardConfig[] = [
    {
      id: 'total-list',
      label: 'Total List',
      value: totalStudents,
      subtitle: 'All Enrolled',
      theme: CARD_THEMES.blue,
      renderIcon: () => <LayersIcon size={24} color="#FFFFFF" strokeWidth={2.5} />,
    },
    {
      id: 'pending-review',
      label: 'Pending Review',
      value: pendingOrFreshmen,
      subtitle: 'Junior Cohort (≤20)',
      theme: CARD_THEMES.amber,
      renderIcon: () => <ClockIcon size={24} color="#FFFFFF" strokeWidth={2.5} />,
    },
    {
      id: 'settled-onsite',
      label: 'Settled On-Site',
      value: uniqueCourses,
      subtitle: 'Active Courses',
      theme: CARD_THEMES.purple,
      renderIcon: () => <MapPinIcon size={24} color="#FFFFFF" strokeWidth={2.5} />,
    },
    {
      id: 'resolved-verified',
      label: 'Resolved & Synced',
      value: totalStudents > 0 ? `${averageAge} yrs` : '100%',
      subtitle: totalStudents > 0 ? 'Avg Student Age' : 'SQLite Ready',
      theme: CARD_THEMES.emerald,
      renderIcon: () => (
        <ShieldCheckIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
      ),
    },
  ];

  return (
    <View style={styles.gridContainer}>
      {kpiCards.map((item) => (
        <KpiCardItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  cardWrapper: {
    flexGrow: 1,
    flexBasis: 145,
    minWidth: 140,
  },
  kpiCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 6,
  },
  iconBlock: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  kpiValue: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
});

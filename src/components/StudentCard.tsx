import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Student } from '../types/student';
import { getStudentTheme } from '../theme/palettes';
import {
  EditPenIcon,
  TrashBinIcon,
  MapPinIcon,
  ClockIcon,
} from './BoldIcons';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const theme = getStudentTheme(student.id, student.course);

  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const animateCard = (toValue: number, isHovered: boolean) => {
    setHovered(isHovered);
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const webCardStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: hovered
            ? `linear-gradient(135deg, ${theme.cardHoverBg} 0%, ${theme.cardBg} 100%)`
            : `linear-gradient(135deg, ${theme.cardBg} 0%, #FFFFFF 100%)`,
          boxShadow: hovered
            ? `0 14px 28px -6px ${theme.cardShadow}, 0 4px 12px -2px ${theme.cardShadow}`
            : `0 4px 12px -2px ${theme.cardShadow}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
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
      onHoverIn={() => animateCard(-4, true)}
      onHoverOut={() => animateCard(0, false)}
      onPressIn={() => animateCard(-2, true)}
      onPressOut={() => animateCard(0, false)}
    >
      <Animated.View
        style={[
          styles.card,
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
            <Text style={styles.avatarText}>{initials || 'ST'}</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameHeaderRow}>
              <Text style={[styles.nameText, { color: theme.valueText }]}>
                {student.name}
              </Text>
              <View
                style={[
                  styles.idTag,
                  {
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                  },
                ]}
              >
                <Text style={[styles.idTagText, { color: theme.labelText }]}>
                  ID #{student.id}
                </Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.courseBadge,
                  {
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                  },
                ]}
              >
                <MapPinIcon size={14} color={theme.badgeText} strokeWidth={2.5} />
                <Text style={[styles.courseText, { color: theme.badgeText }]}>
                  {student.course}
                </Text>
              </View>

              <View
                style={[
                  styles.ageBadge,
                  {
                    backgroundColor: theme.secondaryBadgeBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ClockIcon
                  size={14}
                  color={theme.secondaryBadgeText}
                  strokeWidth={2.5}
                />
                <Text
                  style={[styles.ageText, { color: theme.secondaryBadgeText }]}
                >
                  {student.age} yrs old
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.actionsRow,
            { borderTopColor: hovered ? theme.borderHover : theme.border },
          ]}
        >
          <Text style={[styles.themeStatusLabel, { color: theme.labelText }]}>
            ● SQLite Verified Record
          </Text>

          <View style={styles.actionButtonsGroup}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.badgeBg,
                  borderColor: theme.badgeBorder,
                },
              ]}
              onPress={() => onEdit(student)}
              activeOpacity={0.75}
            >
              <EditPenIcon size={14} color={theme.labelText} strokeWidth={2.5} />
              <Text
                style={[styles.editButtonText, { color: theme.labelText }]}
              >
                Update
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(student)}
              activeOpacity={0.75}
            >
              <TrashBinIcon size={14} color="#DC2626" strokeWidth={2.5} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBlock: {
    width: 54,
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  infoContainer: {
    flex: 1,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  idTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  idTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 9,
    borderWidth: 1,
  },
  courseText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 9,
    borderWidth: 1,
  },
  ageText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 10,
  },
  themeStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  editButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
});

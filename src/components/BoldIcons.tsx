import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

export interface BoldIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function renderWebSvg(
  size: number,
  color: string,
  strokeWidth: number,
  children: React.ReactNode[]
): React.ReactElement {
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { display: 'block' },
    },
    ...children
  );
}

/**
 * Total List: A multi-layered polygon stack (Blue Gradient)
 * Thick 2.5 stroke width
 */
export const LayersIcon: React.FC<BoldIconProps> = ({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('polygon', {
        key: 'top',
        points: '12 2 2 7 12 12 22 7 12 2',
      }),
      React.createElement('polyline', {
        key: 'mid',
        points: '2 12 12 17 22 12',
      }),
      React.createElement('polyline', {
        key: 'bot',
        points: '2 17 12 22 22 17',
      }),
    ]);
  }
  return (
    <View style={styles.nativeFallback}>
      <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.8 }]}>❖</Text>
    </View>
  );
};

/**
 * Pending Review / Active Cohort: A bold, thick-stroked clock indicator (Orange/Amber Gradient)
 * Thick 2.5 stroke width
 */
export const ClockIcon: React.FC<BoldIconProps> = ({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('circle', {
        key: 'ring',
        cx: '12',
        cy: '12',
        r: '9',
      }),
      React.createElement('polyline', {
        key: 'hands',
        points: '12 7 12 12 15.5 14',
      }),
    ]);
  }
  return (
    <View style={styles.nativeFallback}>
      <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.8 }]}>◷</Text>
    </View>
  );
};

/**
 * Settled On-Site / Campus Courses: A distinctive map-pin to emphasize the "On-Site" aspect (Purple Gradient)
 * Thick 2.5 stroke width
 */
export const MapPinIcon: React.FC<BoldIconProps> = ({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('path', {
        key: 'pin',
        d: 'M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z',
      }),
      React.createElement('circle', {
        key: 'dot',
        cx: '12',
        cy: '10',
        r: '3',
      }),
    ]);
  }
  return (
    <View style={styles.nativeFallback}>
      <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.8 }]}>◎</Text>
    </View>
  );
};

/**
 * Resolved / Verified Records: A premium checkmark shield (Emerald Gradient)
 * Thick 2.5 stroke width
 */
export const ShieldCheckIcon: React.FC<BoldIconProps> = ({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('path', {
        key: 'shield',
        d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      }),
      React.createElement('path', {
        key: 'check',
        d: 'm9 12 2 2 4-4',
      }),
    ]);
  }
  return (
    <View style={styles.nativeFallback}>
      <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.8 }]}>✓</Text>
    </View>
  );
};

/**
 * Custom Bold Edit Pen Icon (2.5 stroke width)
 */
export const EditPenIcon: React.FC<BoldIconProps> = ({
  size = 16,
  color = '#1D4ED8',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('path', {
        key: 'pen',
        d: 'M12 20h9',
      }),
      React.createElement('path', {
        key: 'body',
        d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>✎</Text>
  );
};

/**
 * Custom Bold Trash Icon (2.5 stroke width)
 */
export const TrashBinIcon: React.FC<BoldIconProps> = ({
  size = 16,
  color = '#DC2626',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('polyline', {
        key: 'lid',
        points: '3 6 5 6 21 6',
      }),
      React.createElement('path', {
        key: 'can',
        d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>✕</Text>
  );
};

/**
 * Custom Bold Plus Icon (2.5 stroke width)
 */
export const PlusBoldIcon: React.FC<BoldIconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('line', {
        key: 'v',
        x1: '12',
        y1: '5',
        x2: '12',
        y2: '19',
      }),
      React.createElement('line', {
        key: 'h',
        x1: '5',
        y1: '12',
        x2: '19',
        y2: '12',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size }]}>+</Text>
  );
};

const styles = StyleSheet.create({
  nativeFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeGlyph: {
    fontWeight: '800',
  },
});

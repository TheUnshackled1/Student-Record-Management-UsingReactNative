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

export const MusicNoteIcon: React.FC<BoldIconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('path', {
        key: 'bar',
        d: 'M9 18V5l12-2v13',
      }),
      React.createElement('circle', {
        key: 'c1',
        cx: '6',
        cy: '18',
        r: '3',
      }),
      React.createElement('circle', {
        key: 'c2',
        cx: '18',
        cy: '16',
        r: '3',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>♫</Text>
  );
};

export const PlayBoldIcon: React.FC<BoldIconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('polygon', {
        key: 'play',
        points: '6 4 20 12 6 20 6 4',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>▶</Text>
  );
};

export const PauseBoldIcon: React.FC<BoldIconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('rect', {
        key: 'r1',
        x: '6',
        y: '4',
        width: '4',
        height: '16',
      }),
      React.createElement('rect', {
        key: 'r2',
        x: '14',
        y: '4',
        width: '4',
        height: '16',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>❚❚</Text>
  );
};

export const VideoCamIcon: React.FC<BoldIconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('polygon', {
        key: 'lens',
        points: '23 7 16 12 23 17 23 7',
      }),
      React.createElement('rect', {
        key: 'box',
        x: '1',
        y: '5',
        width: '15',
        height: '14',
        rx: '2',
        ry: '2',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>🎬</Text>
  );
};

export const SparklesIcon: React.FC<BoldIconProps> = ({
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}) => {
  if (Platform.OS === 'web') {
    return renderWebSvg(size, color, strokeWidth, [
      React.createElement('path', {
        key: 'star',
        d: 'M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3z',
      }),
    ]);
  }
  return (
    <Text style={[styles.nativeGlyph, { color, fontSize: size * 0.85 }]}>✨</Text>
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

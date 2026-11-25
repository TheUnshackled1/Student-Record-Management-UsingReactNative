import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { CARD_THEMES } from '../theme/palettes';
import {
  CAMPUS_BANNER_URI,
  IMAGE_BUTTON_ICONS,
  playTapSoundEffect,
  toggleBackgroundMusic,
  subscribeSfxEvents,
  getSfxStatus,
} from '../utils/soundEngine';
import {
  MusicNoteIcon,
  PlayBoldIcon,
  PauseBoldIcon,
  VideoCamIcon,
  SparklesIcon,
} from './BoldIcons';

export type AnimationMode = 'Fade-In (On Load)' | 'Bounce Effect' | 'Fade Pulse' | 'Slide Motion';

const VIDEO_FRAMES = [
  {
    step: '01 / 03',
    title: 'Campus SQLite & Multimedia Orientation',
    subtitle: 'Storing Student Records Offline with React Native & SQLite',
    accent: '#3B82F6',
  },
  {
    step: '02 / 03',
    title: 'Interactive Audio & Video Playback',
    subtitle: 'Background Music Loop • Button Tap SFX • Embedded Video Controls',
    accent: '#10B981',
  },
  {
    step: '03 / 03',
    title: 'Smooth UI Micro-Animations',
    subtitle: 'Entrance Fade-In • Spring Bounce • Dynamic Slide Transitions',
    accent: '#A855F7',
  },
];

export const MultimediaStudioCard: React.FC = () => {
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(8);
  const [activeAnimMode, setActiveAnimMode] =
    useState<AnimationMode>('Fade-In (On Load)');
  const [sfxInfo, setSfxInfo] = useState(getSfxStatus());

  // Simple Animation values (Fade-In, Bounce Scale, Slide X/Y)
  const fadeAnim = useRef(new Animated.Value(0.15)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const slideXAnim = useRef(new Animated.Value(0)).current;
  const slideYAnim = useRef(new Animated.Value(18)).current;

  // Screen-load entrance animation (Fade-In + Slide-Up + Gentle Spring)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 14,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideYAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideYAnim]);

  // Subscribe to global button tap sound effect events
  useEffect(() => {
    return subscribeSfxEvents((label, count) => {
      setSfxInfo({ label, count });
    });
  }, []);

  // Video player timer loop when playing
  useEffect(() => {
    if (!videoPlaying) return;
    const timer = setInterval(() => {
      setVideoSeconds((prev) => (prev >= 30 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [videoPlaying]);

  const handleToggleBgm = () => {
    const nextState = toggleBackgroundMusic();
    setBgmPlaying(nextState);
    playTapSoundEffect(nextState ? 'BGM Play' : 'BGM Pause');
  };

  const handleTestTapSfx = () => {
    playTapSoundEffect('Image Button Tap');
  };

  const handleToggleVideo = () => {
    const next = !videoPlaying;
    setVideoPlaying(next);
    playTapSoundEffect(next ? 'Video Play' : 'Video Pause');
  };

  const handleRestartVideo = () => {
    setVideoSeconds(0);
    setVideoPlaying(true);
    playTapSoundEffect('Video Restart');
  };

  const triggerBounceAnimation = () => {
    playTapSoundEffect('Bounce Animation');
    setActiveAnimMode('Bounce Effect');
    scaleAnim.setValue(0.86);
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 16,
      bounciness: 18,
      useNativeDriver: true,
    }).start();
  };

  const triggerFadeAnimation = () => {
    playTapSoundEffect('Fade-In Animation');
    setActiveAnimMode('Fade Pulse');
    fadeAnim.setValue(0.2);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const triggerSlideAnimation = () => {
    playTapSoundEffect('Slide Animation');
    setActiveAnimMode('Slide Motion');
    slideXAnim.setValue(-28);
    Animated.spring(slideXAnim, {
      toValue: 0,
      speed: 14,
      bounciness: 14,
      useNativeDriver: true,
    }).start();
  };

  const blueTheme = CARD_THEMES.blue;
  const amberTheme = CARD_THEMES.amber;
  const purpleTheme = CARD_THEMES.purple;
  const emeraldTheme = CARD_THEMES.emerald;

  const frameIndex = Math.floor(videoSeconds / 10) % VIDEO_FRAMES.length;
  const currentFrame = VIDEO_FRAMES[frameIndex];
  const progressPercent = Math.min(100, Math.round((videoSeconds / 30) * 100));
  const formattedTime = `00:${String(videoSeconds).padStart(2, '0')} / 00:30`;

  const webIconStyle = (start: string, end: string, shadow: string) =>
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
          boxShadow: `0 6px 14px -2px ${shadow}`,
        } as unknown as object)
      : {};

  return (
    <Animated.View
      style={[
        styles.studioWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: slideXAnim },
            { translateY: slideYAnim },
          ],
        },
      ]}
    >
      {/* 1. IMAGE-BASED UI: Illustrated Campus Banner & Overlay */}
      <View style={styles.bannerCard}>
        <Image
          source={{ uri: CAMPUS_BANNER_URI }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerFooterBar}>
          <View style={styles.bannerTagPill}>
            <SparklesIcon size={14} color="#1E40AF" strokeWidth={2.5} />
            <Text style={styles.bannerTagText}>
              IMAGE-BASED UI • ANIMATION: {activeAnimMode.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sfxStatusText}>🔊 {sfxInfo.label}</Text>
        </View>
      </View>

      {/* 2. AUDIO & SIMPLE ANIMATION IMAGE-BASED BUTTONS ROW */}
      <View style={styles.controlsGrid}>
        {/* Background Music Play/Pause Toggle Card */}
        <View
          style={[
            styles.controlBox,
            {
              backgroundColor: bgmPlaying
                ? emeraldTheme.cardBg
                : blueTheme.cardBg,
              borderColor: bgmPlaying
                ? emeraldTheme.borderHover
                : blueTheme.border,
            },
          ]}
        >
          <View style={styles.controlHeader}>
            <View
              style={[
                styles.miniIconBlock,
                {
                  backgroundColor: bgmPlaying
                    ? emeraldTheme.iconBgStart
                    : blueTheme.iconBgStart,
                  borderColor: bgmPlaying
                    ? emeraldTheme.iconBorder
                    : blueTheme.iconBorder,
                },
                webIconStyle(
                  bgmPlaying
                    ? emeraldTheme.iconBgStart
                    : blueTheme.iconBgStart,
                  bgmPlaying ? emeraldTheme.iconBgEnd : blueTheme.iconBgEnd,
                  bgmPlaying ? emeraldTheme.iconShadow : blueTheme.iconShadow
                ),
              ]}
            >
              <MusicNoteIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.controlTitleCol}>
              <Text
                style={[
                  styles.controlTitle,
                  {
                    color: bgmPlaying
                      ? emeraldTheme.valueText
                      : blueTheme.valueText,
                  },
                ]}
              >
                Background Music
              </Text>
              <Text
                style={[
                  styles.controlSub,
                  {
                    color: bgmPlaying
                      ? emeraldTheme.labelText
                      : blueTheme.labelText,
                  },
                ]}
              >
                {bgmPlaying ? '🎵 Playing Ambient Loop' : '🔇 Paused — Tap Toggle'}
              </Text>
            </View>
          </View>

          <View style={styles.imageButtonsRow}>
            <TouchableOpacity
              testID="bgm-toggle-btn"
              style={[
                styles.imageActionButton,
                {
                  backgroundColor: bgmPlaying
                    ? emeraldTheme.badgeBg
                    : blueTheme.badgeBg,
                  borderColor: bgmPlaying
                    ? emeraldTheme.borderHover
                    : blueTheme.badgeBorder,
                },
              ]}
              onPress={handleToggleBgm}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: bgmPlaying
                    ? IMAGE_BUTTON_ICONS.bgmPause
                    : IMAGE_BUTTON_ICONS.bgmPlay,
                }}
                style={styles.buttonThumbImage}
              />
              <Text
                style={[
                  styles.imageActionText,
                  {
                    color: bgmPlaying
                      ? emeraldTheme.badgeText
                      : blueTheme.badgeText,
                  },
                ]}
              >
                {bgmPlaying ? 'Pause BGM' : 'Play BGM'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="sfx-tap-btn"
              style={[
                styles.imageActionButton,
                {
                  backgroundColor: amberTheme.badgeBg,
                  borderColor: amberTheme.badgeBorder,
                },
              ]}
              onPress={handleTestTapSfx}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: IMAGE_BUTTON_ICONS.sfxBell }}
                style={styles.buttonThumbImage}
              />
              <Text
                style={[
                  styles.imageActionText,
                  { color: amberTheme.badgeText },
                ]}
              >
                Tap SFX
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Simple Animation Image-Based Trigger Buttons Card */}
        <View
          style={[
            styles.controlBox,
            {
              backgroundColor: purpleTheme.cardBg,
              borderColor: purpleTheme.border,
            },
          ]}
        >
          <View style={styles.controlHeader}>
            <View
              style={[
                styles.miniIconBlock,
                {
                  backgroundColor: purpleTheme.iconBgStart,
                  borderColor: purpleTheme.iconBorder,
                },
                webIconStyle(
                  purpleTheme.iconBgStart,
                  purpleTheme.iconBgEnd,
                  purpleTheme.iconShadow
                ),
              ]}
            >
              <SparklesIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.controlTitleCol}>
              <Text
                style={[styles.controlTitle, { color: purpleTheme.valueText }]}
              >
                Simple Animations
              </Text>
              <Text
                style={[styles.controlSub, { color: purpleTheme.labelText }]}
              >
                Active: {activeAnimMode}
              </Text>
            </View>
          </View>

          <View style={styles.imageButtonsRow}>
            <TouchableOpacity
              testID="anim-bounce-btn"
              style={[
                styles.imageActionButton,
                {
                  backgroundColor: purpleTheme.badgeBg,
                  borderColor: purpleTheme.badgeBorder,
                },
              ]}
              onPress={triggerBounceAnimation}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: IMAGE_BUTTON_ICONS.animBounce }}
                style={styles.buttonThumbImage}
              />
              <Text
                style={[
                  styles.imageActionText,
                  { color: purpleTheme.badgeText },
                ]}
              >
                Bounce
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="anim-fade-btn"
              style={[
                styles.imageActionButton,
                {
                  backgroundColor: blueTheme.badgeBg,
                  borderColor: blueTheme.badgeBorder,
                },
              ]}
              onPress={triggerFadeAnimation}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: IMAGE_BUTTON_ICONS.animFade }}
                style={styles.buttonThumbImage}
              />
              <Text
                style={[styles.imageActionText, { color: blueTheme.badgeText }]}
              >
                Fade-In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="anim-slide-btn"
              style={[
                styles.imageActionButton,
                {
                  backgroundColor: amberTheme.badgeBg,
                  borderColor: amberTheme.badgeBorder,
                },
              ]}
              onPress={triggerSlideAnimation}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: IMAGE_BUTTON_ICONS.animSlide }}
                style={styles.buttonThumbImage}
              />
              <Text
                style={[
                  styles.imageActionText,
                  { color: amberTheme.badgeText },
                ]}
              >
                Slide
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. EMBEDDED SHORT VIDEO PLAYER WITH PLAY/PAUSE CONTROLS */}
      <View
        style={[
          styles.videoCard,
          {
            backgroundColor: videoPlaying
              ? emeraldTheme.cardBg
              : amberTheme.cardBg,
            borderColor: videoPlaying
              ? emeraldTheme.borderHover
              : amberTheme.border,
          },
        ]}
      >
        <View style={styles.videoCardHeader}>
          <View style={styles.videoTitleGroup}>
            <View
              style={[
                styles.miniIconBlock,
                {
                  backgroundColor: videoPlaying
                    ? emeraldTheme.iconBgStart
                    : amberTheme.iconBgStart,
                  borderColor: videoPlaying
                    ? emeraldTheme.iconBorder
                    : amberTheme.iconBorder,
                },
                webIconStyle(
                  videoPlaying
                    ? emeraldTheme.iconBgStart
                    : amberTheme.iconBgStart,
                  videoPlaying ? emeraldTheme.iconBgEnd : amberTheme.iconBgEnd,
                  videoPlaying
                    ? emeraldTheme.iconShadow
                    : amberTheme.iconShadow
                ),
              ]}
            >
              <VideoCamIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View>
              <Text
                style={[
                  styles.controlTitle,
                  {
                    color: videoPlaying
                      ? emeraldTheme.valueText
                      : amberTheme.valueText,
                  },
                ]}
              >
                Campus Orientation Video Player
              </Text>
              <Text
                style={[
                  styles.controlSub,
                  {
                    color: videoPlaying
                      ? emeraldTheme.labelText
                      : amberTheme.labelText,
                  },
                ]}
              >
                Embedded Short Video • Play / Pause Controls
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.videoStatePill,
              {
                backgroundColor: videoPlaying ? '#10B981' : '#F59E0B',
              },
            ]}
          >
            <Text style={styles.videoStatePillText}>
              {videoPlaying ? '▶ PLAYING' : '⏸ PAUSED'}
            </Text>
          </View>
        </View>

        {/* Video Screen Viewport */}
        <View style={styles.videoViewport}>
          <View style={styles.videoTopOverlay}>
            <Text style={styles.videoClipBadge}>
              🎬 CLIP {currentFrame.step} • HD 720p
            </Text>
            <Text style={styles.videoTimeBadge}>{formattedTime}</Text>
          </View>

          <View style={styles.videoStageCenter}>
            <Text style={styles.videoStageTitle}>{currentFrame.title}</Text>
            <Text style={styles.videoStageSubtitle}>
              {currentFrame.subtitle}
            </Text>
          </View>

          {/* Progress Scrubber Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: currentFrame.accent,
                },
              ]}
            />
          </View>
        </View>

        {/* Video Player Controls Bar */}
        <View style={styles.videoControlsRow}>
          <TouchableOpacity
            testID="video-play-pause-btn"
            style={[
              styles.videoPrimaryBtn,
              {
                backgroundColor: videoPlaying ? '#059669' : '#2563EB',
              },
            ]}
            onPress={handleToggleVideo}
            activeOpacity={0.85}
          >
            {videoPlaying ? (
              <PauseBoldIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <PlayBoldIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text style={styles.videoPrimaryBtnText}>
              {videoPlaying ? 'Pause Video' : 'Play Video'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="video-restart-btn"
            style={styles.videoSecondaryBtn}
            onPress={handleRestartVideo}
            activeOpacity={0.8}
          >
            <Text style={styles.videoSecondaryBtnText}>↺ Restart Clip</Text>
          </TouchableOpacity>

          <Text style={styles.videoProgressLabel}>
            {progressPercent}% Watched
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  studioWrapper: {
    marginBottom: 20,
    gap: 14,
  },
  bannerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E3A8A',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  bannerImage: {
    width: '100%',
    height: 138,
  },
  bannerFooterBar: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
  },
  bannerTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  bannerTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.3,
  },
  sfxStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#047857',
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlBox: {
    flexGrow: 1,
    flexBasis: 260,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  miniIconBlock: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlTitleCol: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  controlSub: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 1,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonThumbImage: {
    width: 24,
    height: 24,
    borderRadius: 7,
  },
  imageActionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  videoCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
  },
  videoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  videoTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  videoStatePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  videoStatePillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  videoViewport: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginBottom: 12,
  },
  videoTopOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  videoClipBadge: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoTimeBadge: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '800',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoStageCenter: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  videoStageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  videoStageSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  videoControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  videoPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  videoPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  videoSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  videoSecondaryBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  videoProgressLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
});

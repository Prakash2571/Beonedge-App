import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fontSize, palette, shadow } from '@/theme/theme';

interface BrandLogoProps {
  size?: number;
  showName?: boolean;
  tagline?: string;
}

/** App logo mark (gradient "B" tile) with optional wordmark + tagline. */
export function BrandLogo({ size = 60, showName = true, tagline }: BrandLogoProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#6366f1', '#a855f7', '#ec4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.mark,
          { width: size, height: size, borderRadius: size * 0.3 },
          shadow.glow(palette.indigo),
        ]}>
        <Text style={[styles.markText, { fontSize: size * 0.5 }]}>B</Text>
      </LinearGradient>
      {showName ? <Text style={styles.name}>BeOnEdge</Text> : null}
      {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: palette.white,
    fontWeight: '800',
  },
  name: {
    color: palette.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
});

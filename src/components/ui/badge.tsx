import { StyleSheet, Text, View } from 'react-native';

import { fontSize, palette, radius, spacing } from '@/theme/theme';

type Tone = 'indigo' | 'pink' | 'emerald' | 'yellow' | 'red' | 'muted';

const tones: Record<Tone, { bg: string; text: string; border: string }> = {
  indigo: {
    bg: 'rgba(99,102,241,0.15)',
    text: '#a5b4fc',
    border: 'rgba(99,102,241,0.4)',
  },
  pink: {
    bg: 'rgba(236,72,153,0.15)',
    text: '#f9a8d4',
    border: 'rgba(236,72,153,0.4)',
  },
  emerald: {
    bg: 'rgba(52,211,153,0.15)',
    text: palette.emeraldText,
    border: 'rgba(52,211,153,0.4)',
  },
  yellow: {
    bg: 'rgba(250,204,21,0.15)',
    text: '#fde047',
    border: 'rgba(250,204,21,0.4)',
  },
  red: {
    bg: 'rgba(248,113,113,0.15)',
    text: '#fca5a5',
    border: 'rgba(248,113,113,0.4)',
  },
  muted: {
    bg: palette.surface,
    text: palette.textSecondary,
    border: palette.border,
  },
};

export function Badge({ label, tone = 'muted' }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Text style={[styles.text, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

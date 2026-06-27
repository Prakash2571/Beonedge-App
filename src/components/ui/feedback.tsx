import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { fontSize, palette, radius, spacing } from '@/theme/theme';

/** Full-area centered spinner. */
export function Loader({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={palette.indigo} />
      {label ? <Text style={styles.loaderLabel}>{label}</Text> : null}
    </View>
  );
}

type BannerTone = 'success' | 'error' | 'info';

const bannerColors: Record<BannerTone, { bg: string; border: string; text: string }> = {
  success: {
    bg: palette.greenBg,
    border: 'rgba(52,211,153,0.5)',
    text: palette.emeraldText,
  },
  error: {
    bg: palette.redBg,
    border: 'rgba(248,113,113,0.5)',
    text: '#fca5a5',
  },
  info: {
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.5)',
    text: '#a5b4fc',
  },
};

/** Inline message banner used for form / action feedback. */
export function Banner({
  message,
  tone = 'info',
}: {
  message: string;
  tone?: BannerTone;
}) {
  const c = bannerColors[tone];
  return (
    <View style={[styles.banner, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.bannerText, { color: c.text }]}>{message}</Text>
    </View>
  );
}

/** Centered empty / placeholder message. */
export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loaderLabel: {
    marginTop: spacing.md,
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
  banner: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  emptyTitle: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

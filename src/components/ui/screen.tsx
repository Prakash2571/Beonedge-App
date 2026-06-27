import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/theme/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Vertically center the content (used for the auth screens). */
  center?: boolean;
  /** Caps content width so it doesn't stretch edge-to-edge on web / tablets. */
  maxWidth?: number;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Standard page wrapper: brand background, safe-area handling, optional scroll +
 * keyboard avoidance, and a centered max-width column so wide screens (web /
 * tablet) don't stretch the layout.
 */
export function Screen({
  children,
  scroll = false,
  center = false,
  maxWidth = 560,
  contentStyle,
  edges = ['top', 'bottom'],
}: ScreenProps) {
  const inner = (
    <View style={[styles.inner, { maxWidth }, contentStyle]}>{children}</View>
  );

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        center && styles.centerVertical,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {inner}
    </ScrollView>
  ) : (
    <View
      style={[styles.flex, styles.padded, center && styles.centerVertical]}>
      {inner}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  flex: {
    flex: 1,
  },
  padded: {
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    flexGrow: 1,
  },
  centerVertical: {
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
  },
});

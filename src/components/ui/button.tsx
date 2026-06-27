import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { fontSize, palette, radius, shadow, spacing } from '@/theme/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const gradients: Record<Variant, readonly [string, string]> = {
  primary: ['#6366f1', '#8b5cf6'],
  secondary: ['#ec4899', '#f472b6'],
  danger: ['#ef4444', '#b91c1c'],
  outline: ['transparent', 'transparent'],
  ghost: ['transparent', 'transparent'],
};

const textColors: Record<Variant, string> = {
  primary: palette.white,
  secondary: palette.white,
  danger: palette.white,
  outline: palette.indigo,
  ghost: palette.textSecondary,
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const isFilled =
    variant === 'primary' || variant === 'secondary' || variant === 'danger';
  const glowColor =
    variant === 'secondary'
      ? palette.pink
      : variant === 'danger'
        ? palette.red
        : palette.indigo;

  const content = loading ? (
    <ActivityIndicator color={textColors[variant]} />
  ) : (
    <Text style={[styles.text, { color: textColors[variant] }]}>{title}</Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.wrapper,
        isFilled && !isDisabled && shadow.glow(glowColor),
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {isFilled ? (
        <LinearGradient
          colors={gradients[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.base}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.base, variant === 'outline' && styles.outline]}>
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
  },
  base: {
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  outline: {
    borderWidth: 1,
    borderColor: palette.indigo,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

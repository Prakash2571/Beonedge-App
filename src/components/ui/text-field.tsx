import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import { fontSize, palette, radius, spacing } from '@/theme/theme';

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | null;
  /** Optional leading glyph (emoji / unicode), e.g. "✉" or "🔒". */
  icon?: string;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  error,
  icon,
}: TextFieldProps) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? palette.red
    : focused
      ? palette.indigo
      : palette.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          { borderColor },
          focused && styles.focused,
        ]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  focused: {
    backgroundColor: palette.surfaceAlt,
  },
  icon: {
    fontSize: fontSize.md,
    marginRight: spacing.sm,
    color: palette.textSecondary,
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: fontSize.md,
    paddingVertical: 14,
  },
  toggle: {
    color: palette.indigo,
    fontSize: fontSize.sm,
    fontWeight: '600',
    paddingLeft: spacing.sm,
  },
  error: {
    color: palette.red,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});

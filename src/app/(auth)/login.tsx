import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, loginUser } from '@/store/slices/authSlice';
import { fontSize, palette, spacing } from '@/theme/theme';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { submitting, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = () => {
    if (!email.trim() || !password) {
      return;
    }
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.brand}>BeOnEdge</Text>
        <Text style={styles.subtitle}>Welcome back — sign in to continue</Text>
      </View>

      {error ? <Banner message={error} tone="error" /> : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Your password"
      />

      <AppButton title="Login" onPress={onSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/signup" style={styles.link}>
          Sign up
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  brand: {
    color: palette.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
  link: {
    color: palette.indigo,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});

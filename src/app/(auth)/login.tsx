import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, loginUser } from '@/store/slices/authSlice';
import { fontSize, palette, radius, shadow, spacing } from '@/theme/theme';

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
    <Screen scroll center maxWidth={420}>
      <View style={styles.logoWrap}>
        <BrandLogo size={64} tagline="Smart SIP investing" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue to your account</Text>

        {error ? <Banner message={error} tone="error" /> : null}

        <View style={styles.form}>
          <TextField
            label="Email"
            icon="✉"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            icon="🔒"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
          />

          <AppButton title="Login" onPress={onSubmit} loading={submitting} />
        </View>
      </View>

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
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.card,
  },
  title: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.sm,
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
    fontWeight: '700',
  },
});

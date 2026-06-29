import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, loginAdmin, loginUser } from '@/store/slices/authSlice';
import { fontSize, palette, radius, shadow, spacing } from '@/theme/theme';

type Mode = 'user' | 'admin';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { submitting, error } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<Mode>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const switchMode = (next: Mode) => {
    setMode(next);
    dispatch(clearAuthError());
  };

  const onSubmit = () => {
    if (!email.trim() || !password) {
      return;
    }
    if (mode === 'admin') {
      dispatch(loginAdmin({ email: email.trim(), password, code: code.trim() }));
    } else {
      dispatch(loginUser({ email: email.trim(), password }));
    }
  };

  return (
    <Screen scroll center maxWidth={420}>
      <View style={styles.logoWrap}>
        <BrandLogo size={64} tagline="Smart SIP investing" />
      </View>

      <View style={styles.card}>
        {/* User / Admin segmented toggle */}
        <View style={styles.segment}>
          <Pressable
            onPress={() => switchMode('user')}
            style={[styles.segmentItem, mode === 'user' && styles.segmentActive]}>
            <Text
              style={[
                styles.segmentText,
                mode === 'user' && styles.segmentTextActive,
              ]}>
              User
            </Text>
          </Pressable>
          <Pressable
            onPress={() => switchMode('admin')}
            style={[styles.segmentItem, mode === 'admin' && styles.segmentActive]}>
            <Text
              style={[
                styles.segmentText,
                mode === 'admin' && styles.segmentTextActive,
              ]}>
              Admin
            </Text>
          </Pressable>
        </View>

        <Text style={styles.title}>
          {mode === 'admin' ? 'Admin sign in' : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'admin'
            ? 'Enter your admin credentials and secret code'
            : 'Sign in to continue to your account'}
        </Text>

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
          {mode === 'admin' ? (
            <TextField
              label="Secret code"
              icon="🔑"
              value={code}
              onChangeText={setCode}
              secureTextEntry
              placeholder="Admin secret code"
            />
          ) : null}

          <AppButton
            title={mode === 'admin' ? 'Admin Login' : 'Login'}
            variant={mode === 'admin' ? 'secondary' : 'primary'}
            onPress={onSubmit}
            loading={submitting}
          />
        </View>
      </View>

      {mode === 'user' ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </View>
      ) : null}
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
  segment: {
    flexDirection: 'row',
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: palette.indigo,
  },
  segmentText: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: palette.white,
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

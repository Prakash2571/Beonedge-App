import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, signupUser } from '@/store/slices/authSlice';
import { fontSize, palette, radius, shadow, spacing } from '@/theme/theme';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const { submitting, error } = useAppSelector((s) => s.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = () => {
    dispatch(
      signupUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      })
    );
  };

  return (
    <Screen scroll center maxWidth={440}>
      <View style={styles.logoWrap}>
        <BrandLogo size={56} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join BeOnEdge to manage your SIPs</Text>

        {error ? <Banner message={error} tone="error" /> : null}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.half}>
              <TextField
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholder="First"
              />
            </View>
            <View style={styles.half}>
              <TextField
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholder="Last"
              />
            </View>
          </View>

          <TextField
            label="Mobile number"
            icon="📱"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="10-digit number"
          />
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
            placeholder="At least 5 chars incl. a number"
          />

          <AppButton title="Sign up" onPress={onSubmit} loading={submitting} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
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

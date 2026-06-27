import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, signupUser } from '@/store/slices/authSlice';
import { fontSize, palette, spacing } from '@/theme/theme';

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
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.brand}>Create account</Text>
        <Text style={styles.subtitle}>Join BeOnEdge to manage your SIPs</Text>
      </View>

      {error ? <Banner message={error} tone="error" /> : null}

      <TextField
        label="First name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        placeholder="First name"
      />
      <TextField
        label="Last name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        placeholder="Last name"
      />
      <TextField
        label="Mobile number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="10-digit number"
      />
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
        placeholder="At least 5 chars incl. a number"
      />

      <AppButton title="Sign up" onPress={onSubmit} loading={submitting} />

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
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
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

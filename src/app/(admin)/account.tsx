import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/feedback';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { resetSips } from '@/store/slices/sipSlice';
import { fontSize, palette, radius, spacing } from '@/theme/theme';

export default function AdminAccountScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return <EmptyState title="Not signed in" />;
  }

  const initials = `${user.firstName?.[0] ?? ''}${
    user.lastName?.[0] ?? ''
  }`.toUpperCase();

  const onLogout = () => {
    dispatch(resetSips());
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Container style={styles.inner}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || 'A'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.email}>{user.email}</Text>
              <View style={styles.badges}>
                <Badge label="Admin" tone="indigo" />
              </View>
            </View>
          </View>
        </Card>

        <AppButton title="Logout" variant="danger" onPress={onLogout} />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
    padding: spacing.lg,
  },
  inner: {
    gap: spacing.lg,
  },
  card: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: palette.indigoDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  email: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/feedback';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { resetSips } from '@/store/slices/sipSlice';
import { fontSize, palette, radius, spacing } from '@/theme/theme';

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return <EmptyState title="Not signed in" />;
  }

  const initials = `${user.firstName?.[0] ?? ''}${
    user.lastName?.[0] ?? ''
  }`.toUpperCase();

  const statusTone =
    user.status === 'Approved'
      ? 'emerald'
      : user.status === 'Pending'
        ? 'yellow'
        : 'red';

  const onLogout = () => {
    dispatch(resetSips());
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || '?'}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.badges}>
              <Badge label={user.role} tone="indigo" />
              <Badge label={user.status} tone={statusTone} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <ProfileField label="First name" value={user.firstName} />
        <ProfileField label="Last name" value={user.lastName} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Phone" value={user.phone} />
      </Card>

      <AppButton title="Logout" variant="danger" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    gap: spacing.md,
  },
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
  headerInfo: {
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
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: palette.textMuted,
    fontSize: fontSize.xs,
    letterSpacing: 1,
  },
  fieldValue: {
    color: palette.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fontSize, palette, radius, spacing } from '@/theme/theme';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  showStatus?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  busy?: boolean;
}

const statusTone = (status?: string) =>
  status === 'Approved' ? 'emerald' : status === 'Pending' ? 'yellow' : 'red';

export function UserCard({
  user,
  showStatus = false,
  onApprove,
  onReject,
  busy = false,
}: UserCardProps) {
  const initials = `${user.firstName?.[0] ?? ''}${
    user.lastName?.[0] ?? ''
  }`.toUpperCase();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || '?'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          {user.email ? <Text style={styles.meta}>{user.email}</Text> : null}
          {user.phone ? <Text style={styles.meta}>{user.phone}</Text> : null}
        </View>
        {showStatus ? (
          <Badge label={user.status} tone={statusTone(user.status)} />
        ) : null}
      </View>

      {onApprove || onReject ? (
        <View style={styles.actions}>
          {onApprove ? (
            <AppButton
              title="Approve"
              onPress={onApprove}
              loading={busy}
              style={styles.actionBtn}
            />
          ) : null}
          {onReject ? (
            <AppButton
              title="Reject"
              variant="danger"
              onPress={onReject}
              loading={busy}
              style={styles.actionBtn}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: palette.indigoDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    color: palette.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  meta: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { extractErrorMessage } from '@/api/client';
import { approveUser, getPendingUsers, rejectUser } from '@/api/admin';
import { UserCard } from '@/components/user-card';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import type { User } from '@/types';
import { fontSize, palette, spacing } from '@/theme/theme';

export default function ApprovalsScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setUsers(await getPendingUsers());
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load pending users'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const act = async (
    userId: string,
    action: (id: string) => Promise<string>
  ) => {
    setBusyId(userId);
    setError(null);
    try {
      const message = await action(userId);
      setFeedback(message);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setError(extractErrorMessage(err, 'Action failed'));
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !refreshing) {
    return <Loader label="Loading pending users…" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.indigo}
          />
        }>
        <Container>
          <Text style={styles.heading}>Pending approvals</Text>

          {feedback ? <Banner message={feedback} tone="success" /> : null}
          {error ? <Banner message={error} tone="error" /> : null}

          {users.length === 0 ? (
            <EmptyState
              title="All caught up 🎉"
              subtitle="No users are waiting for approval right now."
            />
          ) : (
            users.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                busy={busyId === u._id}
                onApprove={() => act(u._id, approveUser)}
                onReject={() => act(u._id, rejectUser)}
              />
            ))
          )}
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    flexGrow: 1,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
});

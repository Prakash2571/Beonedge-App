import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getAllUsers } from '@/api/admin';
import { extractErrorMessage } from '@/api/client';
import { UserCard } from '@/components/user-card';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import type { User } from '@/types';
import { fontSize, palette, spacing } from '@/theme/theme';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setUsers(await getAllUsers());
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load users'));
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

  if (loading && !refreshing) {
    return <Loader label="Loading users…" />;
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
          <Text style={styles.heading}>All users ({users.length})</Text>

          {error ? <Banner message={error} tone="error" /> : null}

          {users.length === 0 ? (
            <EmptyState title="No users yet" />
          ) : (
            users.map((u) => <UserCard key={u._id} user={u} showStatus />)
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

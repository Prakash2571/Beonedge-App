import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { SipCard } from '@/components/sip-card';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCompletedSips } from '@/store/slices/sipSlice';
import { palette, spacing } from '@/theme/theme';

export default function CompletedScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { completed, completedLoading, completedError } = useAppSelector(
    (s) => s.sip
  );
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCompletedSips());
    }, [dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchCompletedSips());
    setRefreshing(false);
  }, [dispatch]);

  // Only show the most recent SIP of each reinvest chain (drop any SIP that is
  // referenced as another SIP's previousSipId).
  const leaves = useMemo(() => {
    const previousIds = new Set(
      completed
        .filter((s) => s.previousSipId)
        .map((s) => String(s.previousSipId))
    );
    return completed.filter((s) => !previousIds.has(String(s._id)));
  }, [completed]);

  if (completedLoading && completed.length === 0 && !refreshing) {
    return <Loader label="Loading completed SIPs…" />;
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
          {completedError ? (
            <Banner message={completedError} tone="error" />
          ) : null}

          {leaves.length === 0 ? (
            <EmptyState
              title="No completed SIPs"
              subtitle="Matured and withdrawn SIPs will appear here."
            />
          ) : (
            leaves.map((sip) => (
              <SipCard
                key={sip._id}
                sip={sip}
                headline="COMPLETED SIP"
                onPress={() =>
                  router.push({
                    pathname: '/sip/[sipId]',
                    params: { sipId: sip._id },
                  })
                }
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
});

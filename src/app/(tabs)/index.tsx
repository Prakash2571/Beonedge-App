import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddSipModal } from '@/components/add-sip-modal';
import { SipCard } from '@/components/sip-card';
import { AppButton } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSips } from '@/store/slices/sipSlice';
import type { SipNature } from '@/types';
import { fontSize, palette, radius, shadow, spacing } from '@/theme/theme';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((s) => s.auth.user);
  const { items, loading, error } = useAppSelector((s) => s.sip);

  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; nature: SipNature }>({
    visible: false,
    nature: 'monthly',
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchSips());
    }, [dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchSips());
    setRefreshing(false);
  }, [dispatch]);

  const onSuccess = (message: string) => {
    setModal((m) => ({ ...m, visible: false }));
    setFeedback(message);
    dispatch(fetchSips());
    setTimeout(() => setFeedback(null), 3500);
  };

  // Pending users cannot interact with SIPs until an admin approves them.
  if (user?.status === 'Pending') {
    return (
      <View style={styles.center}>
        <Text style={styles.pendingEmoji}>⏳</Text>
        <Text style={styles.pendingTitle}>Thanks for signing up!</Text>
        <Text style={styles.pendingText}>
          Your account is awaiting admin approval. You&apos;ll be able to create
          SIPs once you&apos;re approved.
        </Text>
      </View>
    );
  }

  const visibleSips = items.filter(
    (s) => s.process !== 'Reinvest' && s.status !== 'Completed'
  );
  const activeSips = visibleSips.filter((s) => s.status === 'Active');
  const pendingSips = visibleSips.filter((s) => s.status === 'Chosen');
  const totalInvested = activeSips.reduce((sum, s) => sum + (s.totalPaid || 0), 0);

  const showInitialLoader = loading && items.length === 0 && !refreshing;

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
          <Text style={styles.greeting}>
            Hi, {user?.firstName || 'there'} 👋
          </Text>

          {/* Portfolio summary */}
          <LinearGradient
            colors={['#4f46e5', '#7c3aed', '#db2777']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summary}>
            <View>
              <Text style={styles.summaryLabel}>Total Invested</Text>
              <Text style={styles.summaryValue}>
                ₹{totalInvested.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatNum}>{activeSips.length}</Text>
                <Text style={styles.summaryStatLabel}>Active</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNum, { color: palette.yellow }]}>
                  {pendingSips.length}
                </Text>
                <Text style={styles.summaryStatLabel}>Pending</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.actions}>
            <AppButton
              title="+ Monthly SIP"
              onPress={() => setModal({ visible: true, nature: 'monthly' })}
              style={styles.actionBtn}
            />
            <AppButton
              title="+ One-Time SIP"
              variant="secondary"
              onPress={() => setModal({ visible: true, nature: 'onetime' })}
              style={styles.actionBtn}
            />
          </View>

          {feedback ? <Banner message={feedback} tone="success" /> : null}
          {error ? <Banner message={error} tone="error" /> : null}

          {showInitialLoader ? (
            <Loader label="Loading your SIPs…" />
          ) : (
            <>
              <Text style={styles.sectionTitle}>Active SIPs</Text>
              {activeSips.length === 0 ? (
                <Text style={styles.emptyLine}>No active SIPs yet.</Text>
              ) : (
                activeSips.map((sip) => (
                  <SipCard
                    key={sip._id}
                    sip={sip}
                    headline="ACTIVE SIP"
                    onPress={() =>
                      router.push({
                        pathname: '/sip/[sipId]',
                        params: { sipId: sip._id },
                      })
                    }
                  />
                ))
              )}

              {pendingSips.length > 0 ? (
                <>
                  <Text style={[styles.sectionTitle, styles.pendingHeading]}>
                    Awaiting Admin Approval
                  </Text>
                  {pendingSips.map((sip) => (
                    <SipCard
                      key={sip._id}
                      sip={sip}
                      headline="PENDING APPROVAL"
                      headlineColor={palette.yellow}
                    />
                  ))}
                </>
              ) : null}

              {activeSips.length === 0 && pendingSips.length === 0 ? (
                <EmptyState
                  title="No SIPs yet"
                  subtitle="Tap a button above to start a monthly or one-time SIP."
                />
              ) : null}
            </>
          )}
        </Container>
      </ScrollView>

      <AddSipModal
        visible={modal.visible}
        nature={modal.nature}
        onClose={() => setModal((m) => ({ ...m, visible: false }))}
        onSuccess={onSuccess}
      />
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
  },
  greeting: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.indigoDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.glow(palette.indigo),
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
  },
  summaryValue: {
    color: palette.white,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  summaryStatNum: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  summaryStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.xs,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  pendingHeading: {
    color: palette.yellow,
    marginTop: spacing.lg,
  },
  emptyLine: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  center: {
    flex: 1,
    backgroundColor: palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  pendingEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  pendingTitle: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pendingText: {
    color: palette.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
});

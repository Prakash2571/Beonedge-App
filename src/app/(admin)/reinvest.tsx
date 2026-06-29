import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getReinvestRequests, setReinvest } from '@/api/admin';
import { extractErrorMessage } from '@/api/client';
import { AdminActionModal } from '@/components/admin-action-modal';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import type { ReinvestSip } from '@/types';
import { fontSize, palette, spacing } from '@/theme/theme';

export default function ReinvestScreen() {
  const [sips, setSips] = useState<ReinvestSip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [selected, setSelected] = useState<ReinvestSip | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setSips(await getReinvestRequests());
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load reinvest requests'));
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

  const onSubmit = async (months: number, amount: number) => {
    if (!selected) return;
    setSubmitting(true);
    setModalError(null);
    try {
      const message = await setReinvest(selected.userId._id, amount, months);
      setSelected(null);
      setFeedback(message);
      await load();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      setModalError(extractErrorMessage(err, 'Reinvest setup failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !refreshing) {
    return <Loader label="Loading reinvest requests…" />;
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
          <Text style={styles.heading}>Reinvest requests</Text>

          {feedback ? <Banner message={feedback} tone="success" /> : null}
          {error ? <Banner message={error} tone="error" /> : null}

          {sips.length === 0 ? (
            <EmptyState
              title="No reinvest requests"
              subtitle="Matured SIPs whose users chose to reinvest will show here."
            />
          ) : (
            sips.map((sip) => (
              <Card key={sip._id} style={styles.card}>
                <Text style={styles.name}>
                  {sip.userId.firstName} {sip.userId.lastName}
                </Text>
                {sip.userId.email ? (
                  <Text style={styles.meta}>{sip.userId.email}</Text>
                ) : null}
                <Text style={styles.detail}>
                  Previous: ₹{sip.totalPaid} paid · {sip.totalMonths} months
                </Text>

                <AppButton
                  title="Set up reinvest"
                  onPress={() => {
                    setModalError(null);
                    setSelected(sip);
                  }}
                />
              </Card>
            ))
          )}
        </Container>
      </ScrollView>

      <AdminActionModal
        visible={selected !== null}
        title="Set up reinvest"
        subtitle={
          selected
            ? `${selected.userId.firstName} ${selected.userId.lastName}`
            : undefined
        }
        submitLabel="Create reinvest SIP"
        amountLabel="Monthly amount"
        loading={submitting}
        error={modalError}
        onSubmit={onSubmit}
        onClose={() => setSelected(null)}
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
    flexGrow: 1,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
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
  detail: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getChosenSips, recordPayment } from '@/api/admin';
import { extractErrorMessage } from '@/api/client';
import { AdminActionModal } from '@/components/admin-action-modal';
import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import type { ChosenSip } from '@/types';
import { fontSize, palette, spacing } from '@/theme/theme';

export default function PaymentsScreen() {
  const [sips, setSips] = useState<ChosenSip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [selected, setSelected] = useState<ChosenSip | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setSips(await getChosenSips());
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load investments'));
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

  const amountOf = (sip: ChosenSip) =>
    sip.nature === 'monthly' ? sip.amountPerMonth : sip.oneTimeAmount;

  const onSubmit = async (months: number, amount: number) => {
    if (!selected) return;
    setSubmitting(true);
    setModalError(null);
    try {
      const message = await recordPayment(
        selected.userId._id,
        selected._id,
        months,
        amount
      );
      setSelected(null);
      setFeedback(message);
      await load();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      setModalError(extractErrorMessage(err, 'Payment failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !refreshing) {
    return <Loader label="Loading investments…" />;
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
          <Text style={styles.heading}>Record payments</Text>

          {feedback ? <Banner message={feedback} tone="success" /> : null}
          {error ? <Banner message={error} tone="error" /> : null}

          {sips.length === 0 ? (
            <EmptyState
              title="Nothing to pay"
              subtitle="SIPs chosen by users awaiting a payment will show here."
            />
          ) : (
            sips.map((sip) => (
              <Card key={sip._id} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {sip.userId.firstName} {sip.userId.lastName}
                    </Text>
                    {sip.userId.email ? (
                      <Text style={styles.meta}>{sip.userId.email}</Text>
                    ) : null}
                  </View>
                  <Badge
                    label={sip.nature === 'monthly' ? 'Monthly' : 'One-Time'}
                    tone={sip.nature === 'monthly' ? 'indigo' : 'pink'}
                  />
                </View>

                <Text style={styles.detail}>
                  ₹{amountOf(sip) ?? 0}
                  {sip.nature === 'monthly' ? ' / month' : ' one-time'} ·{' '}
                  {sip.totalMonths} months
                </Text>

                <AppButton
                  title="Record payment"
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
        title="Record payment"
        subtitle={
          selected
            ? `${selected.userId.firstName} ${selected.userId.lastName} · ${
                selected.nature === 'monthly' ? 'Monthly' : 'One-Time'
              }`
            : undefined
        }
        submitLabel="Confirm payment"
        amountLabel="Total amount"
        loading={submitting}
        error={modalError}
        initialMonths={
          selected?.nature === 'onetime' ? String(selected.totalMonths) : '1'
        }
        initialAmount={selected ? String(amountOf(selected) ?? '') : ''}
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
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  detail: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
});

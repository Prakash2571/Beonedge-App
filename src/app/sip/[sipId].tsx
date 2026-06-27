import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import { extractErrorMessage } from '@/api/client';
import { chooseAfterMatured, getSip } from '@/api/sip';
import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Banner, EmptyState, Loader } from '@/components/ui/feedback';
import { TextField } from '@/components/ui/text-field';
import { useAppSelector } from '@/store/hooks';
import type { AfterMaturedPayload, Sip, SipNature } from '@/types';
import { fontSize, palette, radius, spacing } from '@/theme/theme';

function formatDate(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function SipDetailScreen() {
  const { sipId } = useLocalSearchParams<{ sipId: string }>();
  const router = useRouter();

  const fromStore = useAppSelector((s) =>
    s.sip.items.find((item) => item._id === sipId)
  );

  const [sip, setSip] = useState<Sip | null>(fromStore ?? null);
  const [loading, setLoading] = useState(!fromStore);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState<'choice' | 'reinvest'>('choice');
  const [reinvestType, setReinvestType] = useState<SipNature>('monthly');
  const [months, setMonths] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!sipId) {
      setError('Invalid SIP id');
      setLoading(false);
      return;
    }
    try {
      const data = await getSip(sipId);
      setSip(data);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'SIP not found'));
    } finally {
      setLoading(false);
    }
  }, [sipId]);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = () => {
    setStep('choice');
    setReinvestType('monthly');
    setMonths('');
    setAmount('');
    setModalError(null);
    setModalVisible(true);
  };

  const submitChoice = async (payload: AfterMaturedPayload) => {
    if (!sip) return;
    setModalError(null);
    setSubmitting(true);
    try {
      const message = await chooseAfterMatured(sip._id, payload);
      setModalVisible(false);
      setFeedback(message);
      await load();
    } catch (err) {
      setModalError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onReinvestSubmit = () => {
    const m = Number(months);
    const a = Number(amount);
    if (!m || !a) {
      setModalError('Please enter both months and amount.');
      return;
    }
    submitChoice({
      option: 'Reinvest',
      type: reinvestType,
      totalMonths: m,
      amountPerMonth: reinvestType === 'monthly' ? a : undefined,
      oneTimeAmount: reinvestType === 'onetime' ? a : undefined,
    });
  };

  if (loading) {
    return <Loader label="Loading SIP…" />;
  }

  if (error || !sip) {
    return <EmptyState title={error ?? 'SIP not found'} />;
  }

  const monthsLeft =
    typeof sip.monthsLeft === 'number'
      ? sip.monthsLeft
      : sip.totalMonths - sip.monthsPaid;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {feedback ? <Banner message={feedback} tone="success" /> : null}

        {sip.process === 'Matured' ? (
          <Card style={styles.maturedCard}>
            <Text style={styles.maturedTitle}>SIP Matured 🎉</Text>
            <Text style={styles.maturedText}>
              Choose to withdraw your returns or reinvest into a new SIP.
            </Text>
            <AppButton title="Manage maturity" onPress={openModal} />
          </Card>
        ) : null}

        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>SIP Details</Text>
              <Text style={styles.id}>ID: {sip._id}</Text>
            </View>
            <Badge
              label={sip.nature === 'monthly' ? 'Monthly' : 'One-Time'}
              tone={sip.nature === 'monthly' ? 'indigo' : 'pink'}
            />
          </View>

          <View style={styles.statGrid}>
            <Stat label="Status" value={sip.status} />
            <Stat label="Paid" value={`₹${sip.totalPaid}`} />
            <Stat label="Months" value={sip.totalMonths} />
            <Stat
              label="Returns"
              value={sip.totalReturns != null ? `₹${sip.totalReturns}` : '—'}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.statGrid}>
            <Stat label="Paid" value={sip.monthsPaid} />
            <Stat label="Left" value={monthsLeft} />
            <Stat label="Skipped" value={sip.skippedMonths ?? 0} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.statGrid}>
            <Stat label="First Pay" value={formatDate(sip.firstPaymentDate)} />
            <Stat label="Last Pay" value={formatDate(sip.lastPaymentDate)} />
            <Stat label="Due" value={formatDate(sip.dueDate)} />
            <Stat label="Maturity" value={formatDate(sip.maturityDate)} />
          </View>
        </Card>

        {sip.previousSipId ? (
          <AppButton
            title="View previous SIP"
            variant="outline"
            onPress={() =>
              router.push({
                pathname: '/sip/[sipId]',
                params: { sipId: String(sip.previousSipId) },
              })
            }
          />
        ) : null}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.maturedTitle}>SIP Matured 🎉</Text>
            {modalError ? <Banner message={modalError} tone="error" /> : null}

            {step === 'choice' ? (
              <>
                <Text style={styles.maturedText}>What would you like to do?</Text>
                <View style={styles.row}>
                  <AppButton
                    title="Withdraw"
                    variant="danger"
                    loading={submitting}
                    onPress={() => submitChoice({ option: 'Over' })}
                    style={styles.flex}
                  />
                  <AppButton
                    title="Reinvest"
                    onPress={() => setStep('reinvest')}
                    style={styles.flex}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.label}>Reinvest type</Text>
                <View style={styles.row}>
                  <AppButton
                    title="Monthly"
                    variant={reinvestType === 'monthly' ? 'primary' : 'outline'}
                    onPress={() => setReinvestType('monthly')}
                    style={styles.flex}
                  />
                  <AppButton
                    title="One-Time"
                    variant={reinvestType === 'onetime' ? 'secondary' : 'outline'}
                    onPress={() => setReinvestType('onetime')}
                    style={styles.flex}
                  />
                </View>

                <View style={styles.spacer} />

                <TextField
                  label="Months"
                  value={months}
                  onChangeText={setMonths}
                  keyboardType="number-pad"
                  placeholder="e.g. 12"
                />
                <TextField
                  label={
                    reinvestType === 'monthly'
                      ? 'Amount per month'
                      : 'One-time amount'
                  }
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="number-pad"
                  placeholder="₹"
                />

                <AppButton
                  title="Submit reinvest"
                  loading={submitting}
                  onPress={onReinvestSubmit}
                />
              </>
            )}

            <View style={styles.spacer} />
            <AppButton
              title="Close"
              variant="ghost"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
    gap: spacing.lg,
  },
  card: {
    gap: spacing.md,
  },
  maturedCard: {
    gap: spacing.md,
    borderColor: 'rgba(52,211,153,0.4)',
    backgroundColor: palette.greenBg,
  },
  maturedTitle: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  maturedText: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  cardTitle: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  id: {
    color: palette.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 90,
    backgroundColor: palette.bg,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: palette.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: palette.bg,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  label: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  spacer: {
    height: spacing.md,
  },
});

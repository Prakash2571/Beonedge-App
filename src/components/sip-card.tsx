import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { fontSize, palette, spacing } from '@/theme/theme';
import type { Sip } from '@/types';

function formatAmount(sip: Sip): string {
  const value = sip.nature === 'monthly' ? sip.amountPerMonth : sip.oneTimeAmount;
  return `₹${value ?? 0}`;
}

interface SipCardProps {
  sip: Sip;
  headline: string;
  headlineColor?: string;
  onPress?: () => void;
}

export function SipCard({ sip, headline, headlineColor, onPress }: SipCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.headline, { color: headlineColor ?? palette.emeraldText }]}>
          {headline}
        </Text>
        <Badge
          label={sip.nature === 'monthly' ? 'Monthly' : 'One-Time'}
          tone={sip.nature === 'monthly' ? 'indigo' : 'pink'}
        />
      </View>

      <Text style={styles.amount}>
        {formatAmount(sip)}
        {sip.nature === 'monthly' ? (
          <Text style={styles.amountSuffix}> / month</Text>
        ) : null}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Months: {sip.totalMonths}</Text>
        {sip.status === 'Completed' ? (
          <Text style={styles.meta}>
            Returns:{' '}
            {sip.totalReturns != null ? (
              <Text style={styles.returns}>₹{sip.totalReturns}</Text>
            ) : (
              '—'
            )}
          </Text>
        ) : (
          <Text style={styles.meta}>Paid: ₹{sip.totalPaid}</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  amount: {
    color: palette.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  amountSuffix: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  meta: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
  },
  returns: {
    color: palette.emeraldText,
    fontWeight: '600',
  },
});

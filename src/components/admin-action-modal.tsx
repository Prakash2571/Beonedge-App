import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { TextField } from '@/components/ui/text-field';
import { fontSize, palette, radius, spacing } from '@/theme/theme';

interface AdminActionModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  initialMonths?: string;
  initialAmount?: string;
  amountLabel?: string;
  onSubmit: (months: number, amount: number) => void;
  onClose: () => void;
}

/** Reusable admin modal collecting a months + amount pair (payment / reinvest). */
export function AdminActionModal({
  visible,
  title,
  subtitle,
  submitLabel,
  loading = false,
  error,
  initialMonths = '',
  initialAmount = '',
  amountLabel = 'Amount',
  onSubmit,
  onClose,
}: AdminActionModalProps) {
  const [months, setMonths] = useState(initialMonths);
  const [amount, setAmount] = useState(initialAmount);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setMonths(initialMonths);
      setAmount(initialAmount);
      setLocalError(null);
    }
  }, [visible, initialMonths, initialAmount]);

  const submit = () => {
    const m = Number(months);
    const a = Number(amount);
    if (!m || !a) {
      setLocalError('Please enter both months and amount.');
      return;
    }
    onSubmit(m, a);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {error || localError ? (
            <Banner message={error || localError || ''} tone="error" />
          ) : null}

          <TextField
            label="Months"
            value={months}
            onChangeText={setMonths}
            keyboardType="number-pad"
            placeholder="e.g. 1"
          />
          <TextField
            label={amountLabel}
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            placeholder="₹"
          />

          <View style={styles.actions}>
            <AppButton
              title={submitLabel}
              onPress={submit}
              loading={loading}
              style={styles.flex}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});

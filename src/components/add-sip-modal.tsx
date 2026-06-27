import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { extractErrorMessage } from '@/api/client';
import { chooseSip } from '@/api/sip';
import { AppButton } from '@/components/ui/button';
import { Banner } from '@/components/ui/feedback';
import { TextField } from '@/components/ui/text-field';
import type { ChooseSipPayload, SipNature } from '@/types';
import { fontSize, palette, radius, spacing } from '@/theme/theme';

interface AddSipModalProps {
  visible: boolean;
  nature: SipNature;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function AddSipModal({
  visible,
  nature,
  onClose,
  onSuccess,
}: AddSipModalProps) {
  const [months, setMonths] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMonths('');
    setAmount('');
    setError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    setError(null);
    const m = Number(months);
    const a = Number(amount);
    if (!m || !a) {
      setError('Please enter both months and amount.');
      return;
    }

    const payload: ChooseSipPayload =
      nature === 'monthly'
        ? { nature, totalMonths: m, amountPerMonth: a }
        : { nature, totalMonths: m, oneTimeAmount: a };

    setSubmitting(true);
    try {
      const message = await chooseSip(payload);
      // The endpoint returns 200 even for validation messages, so detect the
      // success phrase ("Thanks for choosing your plan.").
      if (/thanks/i.test(message)) {
        reset();
        onSuccess(message);
      } else {
        setError(message);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            Add {nature === 'monthly' ? 'Monthly' : 'One-Time'} SIP
          </Text>

          {error ? <Banner message={error} tone="error" /> : null}

          <TextField
            label="Months"
            value={months}
            onChangeText={setMonths}
            keyboardType="number-pad"
            placeholder="e.g. 12 (minimum)"
          />
          <TextField
            label={nature === 'monthly' ? 'Amount per month' : 'One-time amount'}
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            placeholder={nature === 'monthly' ? '₹ (min 500)' : '₹ (min 5000)'}
          />

          <View style={styles.actions}>
            <AppButton
              title="Submit"
              onPress={submit}
              loading={submitting}
              style={styles.flex}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={close}
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
  },
  title: {
    color: palette.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});

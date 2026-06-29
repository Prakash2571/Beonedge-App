import { StyleSheet, View } from 'react-native';

export type TabIconName = 'sips' | 'completed' | 'profile' | 'reinvest' | 'users';

/**
 * Lightweight, dependency-free tab icons drawn with plain Views, so the app
 * never needs an external icon font package to bundle. They tint to whatever
 * `color` the tab bar passes (active vs inactive).
 */
export function TabIcon({ name, color }: { name: TabIconName; color: string }) {
  if (name === 'sips') {
    // Wallet / card outline with a button dot.
    return (
      <View style={[styles.wallet, { borderColor: color }]}>
        <View style={[styles.walletDot, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'completed') {
    // Circle with a CSS-style checkmark inside.
    return (
      <View style={[styles.circle, { borderColor: color }]}>
        <View style={[styles.check, { borderColor: color }]} />
      </View>
    );
  }

  if (name === 'reinvest') {
    // Three-quarter circle suggesting a refresh / cycle.
    return (
      <View
        style={[
          styles.circle,
          { borderColor: color, borderTopColor: 'transparent' },
        ]}
      />
    );
  }

  if (name === 'users') {
    // Two heads over a shared body (a group).
    return (
      <View style={styles.users}>
        <View style={styles.usersHeads}>
          <View style={[styles.smallHead, { backgroundColor: color }]} />
          <View style={[styles.smallHead, { backgroundColor: color }]} />
        </View>
        <View style={[styles.groupBody, { backgroundColor: color }]} />
      </View>
    );
  }

  // profile: head + shoulders silhouette.
  return (
    <View style={styles.person}>
      <View style={[styles.head, { backgroundColor: color }]} />
      <View style={[styles.body, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wallet: {
    width: 24,
    height: 18,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
  },
  walletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 9,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  person: {
    width: 24,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  body: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 2,
  },
  users: {
    width: 26,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usersHeads: {
    flexDirection: 'row',
    gap: 3,
  },
  smallHead: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  groupBody: {
    width: 20,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 2,
  },
});

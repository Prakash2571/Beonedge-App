import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Centered, max-width column. Keeps list/content screens from stretching
 * edge-to-edge on web and tablets.
 */
export function Container({
  children,
  maxWidth = 620,
  style,
}: {
  children: ReactNode;
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: '100%', maxWidth, alignSelf: 'center' }, style]}>
      {children}
    </View>
  );
}

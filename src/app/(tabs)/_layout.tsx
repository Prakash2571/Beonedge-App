import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { Loader } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { useAppSelector } from '@/store/hooks';
import { palette } from '@/theme/theme';

export default function TabsLayout() {
  const { status, bootstrapped } = useAppSelector((s) => s.auth);

  if (!bootstrapped) {
    return (
      <Screen>
        <Loader label="Starting up…" />
      </Screen>
    );
  }

  if (status !== 'authenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: palette.surface },
        headerTintColor: palette.textPrimary,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: palette.bg },
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        tabBarActiveTintColor: palette.indigo,
        tabBarInactiveTintColor: palette.textMuted,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My SIPs',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

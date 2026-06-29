import { Redirect, Tabs } from 'expo-router';

import { TabIcon } from '@/components/tab-icon';
import { Loader } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { useAppSelector } from '@/store/hooks';
import { palette } from '@/theme/theme';

export default function AdminLayout() {
  const { status, bootstrapped, user } = useAppSelector((s) => s.auth);

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

  // Only admins belong here; everyone else goes to the user app.
  if (user?.role !== 'Admin') {
    return <Redirect href="/" />;
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
        name="approvals"
        options={{
          title: 'Approvals',
          tabBarIcon: ({ color }) => <TabIcon name="completed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <TabIcon name="sips" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <TabIcon name="profile" color={color} />,
        }}
      />
    </Tabs>
  );
}

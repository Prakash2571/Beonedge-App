import { Redirect, Stack } from 'expo-router';

import { Loader } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { useAppSelector } from '@/store/hooks';

export default function AuthLayout() {
  const { status, bootstrapped, user } = useAppSelector((s) => s.auth);

  if (!bootstrapped) {
    return (
      <Screen>
        <Loader label="Starting up…" />
      </Screen>
    );
  }

  // Already signed in? Send them to the right home for their role.
  if (status === 'authenticated') {
    return <Redirect href={user?.role === 'Admin' ? '/approvals' : '/'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

import { Redirect, Stack } from 'expo-router';

import { Loader } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { useAppSelector } from '@/store/hooks';

export default function AuthLayout() {
  const { status, bootstrapped } = useAppSelector((s) => s.auth);

  if (!bootstrapped) {
    return (
      <Screen>
        <Loader label="Starting up…" />
      </Screen>
    );
  }

  // Already signed in? Send them to the app.
  if (status === 'authenticated') {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

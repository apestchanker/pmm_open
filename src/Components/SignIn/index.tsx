import { useCallback } from 'react';
import { useNetworkAuth } from 'Providers/NetworkAuth';

export default function GoogleSignInComponent(): JSX.Element {
  const { loginAsGoogle } = useNetworkAuth();
  return <div></div>;
}

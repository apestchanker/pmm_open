import { useCallback, useEffect } from 'react';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useNavigate } from 'react-router-dom';

export default function GoogleSignUpComponent(): JSX.Element {
  const { signupAsGoogle, isAuthenticated } = useNetworkAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return <></>;
}

import { useAuth0 } from '@auth0/auth0-react';
import LandingAuth from 'Components/LandingAuth/LandingAuth';
import LandingNoAuth from 'Components/LandingNoAuth/LandingNoAuth';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useEffect, useState } from 'react';

function Landing() {
  const { isAuthenticated } = useAuth0();
  const [logged, setLogged] = useState(isAuthenticated);

  useEffect(() => {
    setLogged(isAuthenticated);
  }, [isAuthenticated, logged]);
  /*   const [auth, setAuth] = useState(isAuthenticated);

  useEffect(() => {
    return () => {
      setAuth(isAuthenticated);
    };
  }, [isAuthenticated]); */

  return logged ? <LandingAuth /> : <LandingNoAuth />;
}

export default Landing;

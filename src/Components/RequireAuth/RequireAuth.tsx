// import { useNetworkAuth } from 'Providers/NetworkAuth';
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  if (!isAuthenticated) {
    //   // Redirect them to the /login page, but save the current location they were
    //   // trying to go to when they were redirected. This allows us to send them
    //   // along to that page after they login.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;

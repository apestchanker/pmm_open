import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
//import axios from 'axios';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { DateTime } from 'luxon';
import { NetworkAuthValue, DataType, TokenState } from 'Types';
import { setContext } from '@apollo/client/link/context';
import JWT from 'expo-jwt';

const NetworkAuthContext = createContext({
  id: '',
  isAuthenticated: false,
  username: '',
  email: '',
  roles: [] as string[],
  labels: [] as string[],
  accountType: '',
} as NetworkAuthValue);

export const useNetworkAuth = () => {
  return useContext(NetworkAuthContext);
};

export default function NetworkAuthProvider({ children }: { children: React.ReactNode }) {
  const [tokenState, setTokenState] = useState<TokenState>({
    access_token: '',
    refresh_token: '',
    exp: DateTime.now(),
    refresh_exp: DateTime.now(),
  } as TokenState);

  const [authInfo, setAuthInfo] = useState<NetworkAuthValue>({
    id: '',
    isAuthenticated: false,
    username: '',
    email: '',
    roles: [],
    labels: [],
    accountType: '',
  });

  // const axiosInstance = useRef(
  //   axios.create({
  //     baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8092/api/v1/',
  //   }),
  // );

  const storedAuth = JSON.parse(localStorage.getItem('pmm::auth') || '{}');
  useEffect(() => {
    if (Object.keys(storedAuth).length > 0) {
      const exp = DateTime.fromISO(storedAuth.exp).toLocal();
      const refresh_exp = DateTime.fromISO(storedAuth.refresh_exp).toLocal();
      const { access_token, refresh_token } = storedAuth;
      setTokenState({ access_token, refresh_token, exp, refresh_exp });
      console.log(access_token, exp, '123');
      const { id, username, isAuthenticated, roles, labels } = storedAuth;
      setAuthInfo({ id, username, isAuthenticated, roles, labels, accountType: '' });
      console.log(id, username, isAuthenticated, roles, labels, '123');
    }
  }, []);

  const httplink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
  });

  const secret: string = process.env.REACT_APP_JWT_SECRET || '';

  //console.log('SECRET: ', secret);

  const storedtoken = JSON.parse(localStorage.getItem('pmm::auth') || '{}');
  //console.log(storedtoken);
  const jwt = JWT.encode(storedtoken, secret);

  // console.log(jwt);

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    };
  });

  const client = useRef(
    new ApolloClient({
      link: authLink.concat(httplink),
      //uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4001/graphql',
      cache: new InMemoryCache(),
    }),
  );
  // const getAccessTokenSilently = useCallback(async (): Promise<TokenState | undefined> => {
  //   try {
  //     const now = DateTime.now();
  //     let refresh_token: string, refresh_exp: DateTime, exp: DateTime, access_token: string;
  //     if (tokenState.exp < now) {
  //       if (tokenState.refresh_exp < now) {
  //         // re-log in!
  //         // redirect with state for eventual redirection
  //         return;
  //       } else {
  //         // request new token
  //         const refreshResponse = await axiosInstance.current.post('refresh', { refresh_token: tokenState.refresh_token });
  //         if (refreshResponse.status === 200) {
  //           const result: { access_token: string; refresh_token: string; exp: string; refresh_exp: string } = refreshResponse.data;
  //           exp = DateTime.fromISO(result.exp);
  //           refresh_exp = DateTime.fromISO(result.refresh_exp);
  //           refresh_token = result.refresh_token;
  //           access_token = result.access_token;
  //           setTokenState({ access_token, refresh_token, refresh_exp, exp });
  //           const { email, username, isAuthenticated, roles, labels, accountType } = authInfo;
  //           localStorage.setItem(
  //             'pmm::auth',
  //             JSON.stringify({
  //               access_token,
  //               refresh_token,
  //               exp,
  //               refresh_exp,
  //               username,
  //               email,
  //               isAuthenticated,
  //               roles,
  //               labels,
  //               accountType,
  //             }),
  //           );
  //           return { access_token, refresh_token, exp, refresh_exp };
  //         }
  //       }
  //       return;
  //     } else {
  //       return tokenState;
  //     }
  //   } catch (err) {}
  // }, [tokenState.access_token, authInfo]);

  // const signup = useCallback(
  //   async ({
  //     username,
  //     email,
  //     password,
  //     pwconfirmation,
  //   }: {
  //     email: string;
  //     username: string;
  //     password: string;
  //     pwconfirmation: string;
  //   }) => {
  //     try {
  //       const response = await axiosInstance.current.post('auth/signup', { username, password, pwconfirmation, email });
  //       if (response?.data) {
  //         /**
  //          *  TODO: Return or not on on success?
  //          */
  //         // Removed temporarily because it was causing a bug with proposal creation.
  //         /* const { access_token, refresh_token, exp, refresh_exp, roles, labels } = response.data;
  //         setTokenState({
  //           access_token,
  //           refresh_token,
  //           exp: DateTime.fromISO(exp).toLocal(),
  //           refresh_exp: DateTime.fromISO(refresh_exp).toLocal(),
  //         });
  //         setAuthInfo({ username, isAuthenticated: true, roles, labels, accountType: '' }); */
  //         // boolean for using a redirect later
  //         return true;
  //       }
  //     } catch (err) {}
  //     /**
  //      * Fill in here await axios.post("auth/signup", {username, password})
  //      */
  //   },
  //   [axiosInstance],
  // );

  // const login = useCallback(
  //   async ({ username, password }: { username: string; password: string }) => {
  //     try {
  //       const response = await axiosInstance.current.post('auth/login', { username, password });
  //       if (response?.data) {
  //         const { access_token, refresh_token, exp, email, username, roles, labels } = response.data;
  //         localStorage.setItem(
  //           'pmm::auth',
  //           JSON.stringify({ access_token, refresh_token, exp, email, username, roles, labels, isAuthenticated: true }),
  //         );
  //         setAuthInfo({ username, email, roles, accountType: '', labels, isAuthenticated: true });
  //         setTokenState({
  //           access_token,
  //           refresh_token,
  //           exp: DateTime.fromISO(exp).toLocal(),
  //           refresh_exp: DateTime.fromISO(exp).toLocal(),
  //         });
  //         return true;
  //       }
  //     } catch (err) {}
  //   },
  //   [axiosInstance],
  // );
  const loginUser = async (data: {
    id: string;
    username: string;
    access_token?: string;
    refresh_token?: string;
    exp?: string;
    email: string;
    roles: any;
    labels: any;
  }) => {
    try {
      if (data) {
        const { id, email, username } = data;
        const roles = data.roles || [];
        const labels = data.labels || [];
        /* localStorage.setItem(
            'pmm::auth',
            JSON.stringify({ access_token, refresh_token, exp, email, username, roles, labels, isAuthenticated: true }),
          ); */
        localStorage.setItem('pmm::auth', JSON.stringify({ id, email, username, roles, labels, isAuthenticated: true }));
        setAuthInfo({ id, username, email, roles, accountType: '', labels, isAuthenticated: true });
        /* setTokenState({
            access_token,
            refresh_token,
            exp: DateTime.fromISO(exp).toLocal(),
            refresh_exp: DateTime.fromISO(exp).toLocal(),
          }); */
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('pmm::auth');
    try {
      localStorage.removeItem('pmm::auth');
      setAuthInfo({
        id: '',
        isAuthenticated: false,
        username: '',
        email: '',
        roles: [] as string[],
        labels: [] as string[],
        accountType: '',
      });
    } catch (err) {
      localStorage.removeItem('pmm::auth');
      console.log(err);
    }
  }, []);
  // const get = useCallback(
  //   async (path: string, requiresAuth: boolean) => {
  //     const localHeaders = {} as Record<string, string>;
  //     if (requiresAuth) {
  //       try {
  //         const tokenState = await getAccessTokenSilently();
  //         if (tokenState) {
  //           localHeaders.authorization = `Bearer ${tokenState?.access_token}`;
  //         }
  //       } catch (err) {
  //         throw new Error('No token');
  //       }
  //     }
  //     return axiosInstance.current.get(path, { headers: localHeaders });
  //   },
  //   [axiosInstance],
  // );

  // const del = useCallback(
  //   async (path: string, requiresAuth: boolean) => {
  //     const localHeaders = {} as Record<string, string>;
  //     if (requiresAuth) {
  //       try {
  //         const tokenState = await getAccessTokenSilently();
  //         if (tokenState) {
  //           localHeaders.authorization = `Bearer ${tokenState?.access_token}`;
  //         }
  //       } catch (err) {
  //         throw new Error('No token');
  //       }
  //     }
  //     return axiosInstance.current.delete(path, { headers: localHeaders });
  //   },
  //   [axiosInstance],
  // );

  // const put = useCallback(
  //   async (path: string, data: DataType, requiresAuth: boolean) => {
  //     const localHeaders = {} as Record<string, string>;
  //     if (requiresAuth) {
  //       try {
  //         const tokenState = await getAccessTokenSilently();
  //         if (tokenState) {
  //           localHeaders.authorization = `Bearer ${tokenState?.access_token}`;
  //         }
  //       } catch (err) {
  //         throw new Error('No token');
  //       }
  //     }
  //     return axiosInstance.current.put(path, data, { headers: localHeaders });
  //   },
  //   [axiosInstance],
  // );

  // const post = useCallback(
  //   async (path: string, data: DataType, requiresAuth: boolean) => {
  //     const localHeaders = {} as Record<string, string>;
  //     if (requiresAuth) {
  //       try {
  //         const tokenState = await getAccessTokenSilently();
  //         if (tokenState) {
  //           localHeaders.authorization = `Bearer ${tokenState?.access_token}`;
  //         }
  //       } catch (err) {
  //         throw new Error('No token');
  //       }
  //     }
  //     return axiosInstance.current.post(path, data, { headers: localHeaders });
  //   },
  //   [axiosInstance],
  // );

  // const loginAsGoogle = useCallback(
  //   async (tokenId: string) => {
  //     const result = await post('auth/loginAsGoogle', { tokenId }, false);
  //     console.log(result);
  //   },
  //   [axiosInstance.current],
  // );

  // const signupAsGoogle = useCallback(
  //   async (tokenId: string) => {
  //     const result = await post('auth/signupAsGoogle', { tokenId }, false);
  //     console.log(result);
  //   },
  //   [axiosInstance.current],
  // );

  //login, logout, signup, loginAsGoogle, signupAsGoogle, post, get, put, del }}>
  //login, logout, signup, loginAsGoogle, signupAsGoogle, post, get, put, del }}>
  return (
    <NetworkAuthContext.Provider value={{ ...authInfo, logout, loginUser }}>
      <ApolloProvider client={client.current}>{children}</ApolloProvider>
    </NetworkAuthContext.Provider>
  );
}

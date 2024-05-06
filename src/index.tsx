import RoutingComponent from 'Components/Routing';
import NetworkAuthProvider from 'Providers/NetworkAuth';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import SearchProvider from 'Providers/Search';
import { Auth0ProviderWithHistory } from 'Providers/Auth0Provider';
import './styles.css';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    },
  },
  palette: {
    secondary: {
      main: '#263560',
    },
    success: {
      main: '#38D059',
    },
  },
});
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {' '}
      <BrowserRouter>
        <NetworkAuthProvider>
          <Auth0ProviderWithHistory>
            <SearchProvider>
              <RoutingComponent />
            </SearchProvider>
          </Auth0ProviderWithHistory>
        </NetworkAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, CssBaseline, FormControl, InputLabel, Grid, InputAdornment, Paper, Typography, FilledInput } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNetworkAuth } from 'Providers/NetworkAuth';

//import Style from './SignIn.module.css';
import { useEffect } from 'react';
import GoogleSignUpComponent from 'Components/SignUp';
import CardanoLogos from 'Components/CardanoLogos';

const theme = createTheme();

function Login() {
  const { isAuthenticated } = useNetworkAuth();
  const navigate = useNavigate();
  /* 
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]); */

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={2} square sx={{ position: 'relative' }}>
          <CardanoLogos />
          <Box
            sx={{
              mx: 'auto',
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '10px',
              overflow: 'hidden',
              width: '80%',
              maxWidth: '450px',
              boxShadow: 'var(--normalShadow)',
              marginTop: '60px !important',
            }}
          >
            <Box
              sx={{
                mb: 5,
                position: 'absolute',
                top: '50px',
                left: '50px',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
            ></Box>
            {/*  HEADER */}
            <Box
              sx={{
                backgroundColor: 'var(--primaryBlue)',
                width: '100%',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography component="h1" variant="h3" color="white" sx={{ w: 100 }}>
                Sign Up
              </Typography>
            </Box>

            {/* BUTTONS START */}
            <Box sx={{ margin: 'auto', mt: 5, width: '60%' }}>
              <Link to="/sign-up" style={{ textDecoration: 'none', color: 'white' }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    p: 1,
                    backgroundColor: 'var(--primaryBlue)',
                    textTransform: 'none',
                  }}
                >
                  Create an account
                </Button>
              </Link>
              {/* SIGN IN */}
              <Link to="/sign-in" style={{ textDecoration: 'none', color: 'white' }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    p: 1,
                    backgroundColor: 'var(--primaryBlue)',
                    textTransform: 'none',
                  }}
                >
                  I already have an account
                </Button>
              </Link>
            </Box>
            {/* BUTTONS END */}
            {/* SOCIAL BTNS */}
            {/* <Box sx={{ margin: 'auto', mt: 5, width: '60%' }}>
              <GoogleSignUpComponent />
            </Box> */}
            {/* SOCIAL BTNS END*/}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;

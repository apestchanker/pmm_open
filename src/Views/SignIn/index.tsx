import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
  FilledInput,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNetworkAuth } from 'Providers/NetworkAuth';

//import Style from './SignIn.module.css';
import { useCallback, useEffect, useState } from 'react';
import GoogleSignInComponent from 'Components/SignIn';
import CardanoLogos from 'Components/CardanoLogos';

const theme = createTheme();

interface State {
  username: string;
  password: string;
  showPassword: boolean;
}

function SignIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useNetworkAuth();
  const [values, setValues] = useState<State>({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      //Creating object to POST to server
      const signUpObject = {
        username: values.username,
        password: values.password,
      };

      const res: any = await login?.(signUpObject);

      if (res) {
        navigate('/');
      } else {
        alert('Invalid email / password combination');
      }
    },
    [values, login],
  );

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

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
              pb: 7,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '10px',
              overflow: 'hidden',
              width: '80%',
              maxWidth: '400px',
              boxShadow: 'var(--normalShadow)',
              marginTop: '60px !important',
            }}
          >
            <Box
              sx={{
                mb: 5,
                position: 'absolute',
                top: '120px',
                left: '10px',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Link to="/login">
                <Button sx={{ color: 'var(--textDark)' }} startIcon={<ArrowBackIosNewIcon />}>
                  Return
                </Button>
              </Link>
            </Box>
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
                Sign In
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* BUTTONS START */}
              <Box sx={{ margin: 'auto', mt: 5, width: '60%' }}>
                <Box sx={{ mb: 3 }}>
                  {/* MAIL TEXTFIELD */}
                  <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                    <InputLabel htmlFor="username-input">Username</InputLabel>
                    <FilledInput
                      required
                      fullWidth
                      id="username-input"
                      type="text"
                      value={values.username}
                      onChange={handleChange('username')}
                    />
                  </FormControl>
                  {/* PASSWORD TEXTFIELD */}
                  <FormControl fullWidth sx={{ borderRadius: '4px' }}>
                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <FilledInput
                      fullWidth
                      required
                      id="password-input"
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {/* <Link to="#" style={{ fontSize: '12px', marginTop: '15px', color: 'var(--textDark)' }}>
                    Forgot my password
                  </Link> */}
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    p: 1,
                    backgroundColor: 'var(--primaryBlue)',
                    textTransform: 'none',
                  }}
                >
                  Sign In
                </Button>
              </Box>
              {/* <Box sx={{ margin: 'auto', mt: 5, width: '60%' }}>
                <GoogleSignInComponent />
              </Box> */}
            </form>
            {/* FORM END */}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignIn;

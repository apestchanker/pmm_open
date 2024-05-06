import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Slide, { SlideProps } from '@mui/material/Slide';
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
  Snackbar,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
//import Style from './SignUp.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import CardanoLogos from 'Components/CardanoLogos';
import Swal from 'sweetalert2';
YupPassword(yup); // extend yup

const theme = createTheme();

interface State {
  [key: string]: string | boolean;
  username: string;
  email: string;
  password: string;
  showPassword: boolean;
  pwconfirmation: string;
}

interface ErrorState {
  [key: string]: string[];
  username: string[];
  email: string[];
  password: string[];
  pwconfirmation: string[];
}

interface TouchedState {
  [key: string]: boolean;
  username: boolean;
  email: boolean;
  password: boolean;
  pwconfirmation: boolean;
}

const SignupSchema = yup.object({
  username: yup.string().required('username:Username is required').min(3, 'username:Username must be at least 3 characters long'),
  email: yup.string().lowercase().email('email:Invalid email').required('email:Email is required'),
  password: yup
    .string()
    .password()
    .min(8, 'password:Password must be at least 8 characters long')
    .minNumbers(1, 'password:Password must contain at least one number')
    .minSymbols(1, 'password:Password must contain at least one symbol')
    .minLowercase(1, 'password:Password must contain at least one lowercase letter')
    .minUppercase(1, 'password:Password must contain at least one uppercase letter')
    .required('password:Password is required'),
  pwconfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'pwconfirmation:Passwords must match')
    .required('pwconfirmation:Password confirmation is required'),
});
function SignUp() {
  const { signup, isAuthenticated } = useNetworkAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<State>({
    username: '',
    email: '',
    password: '',
    showPassword: false,
    pwconfirmation: '',
  });
  const [errors, setErrors] = useState<ErrorState>({
    username: [] as string[],
    email: [] as string[],
    password: [] as string[],
    pwconfirmation: [] as string[],
  });
  const [touched, setTouched] = useState<TouchedState>({ username: false, email: false, password: false, pwconfirmation: false });

  const checkValues = useCallback(
    async (values: Omit<State, 'showPassword'>) => {
      try {
        // const validValues = await SignupSchema.validate(values, { abortEarly: false });
        // setErrors({ username: [], email: [], password: [], pwconfirmation: [] } as ErrorState);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setErrors(
            err.inner.reduce(
              (acc, err) => {
                const returning = { ...acc };
                const errors = err.message.split(':');
                if (touched[errors[0]]) {
                  returning[errors[0]] = [...returning[errors[0]], errors[1]];
                }
                return returning;
              },
              { username: [], email: [], password: [], pwconfirmation: [] } as ErrorState,
            ),
          );
        }
      }
    },
    [touched],
  );
  const pwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  const errorsSnackbar = {
    username: values.username.length < 3,
    email: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email),
    password: !pwordRegex.test(values.password),
    pwconfirmation: values.pwconfirmation !== values.password,
  };
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setOpenSnackbar(true);
      //Password format checker
      const { password, pwconfirmation, username, email } = await SignupSchema.validate(values, { abortEarly: false });
      //Creating object to POST to server
      const signUpObject = {
        username,
        email,
        password,
        pwconfirmation,
      };
      const RES = await signup?.(signUpObject);
      if (RES) {
        Swal.fire({
          title: 'Account created!',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Great!',
        });
        handleSubmitOK(username, password);
      } else {
        alert('error, try again');
      }
    },
    [values, signup],
  );
  const { login } = useNetworkAuth();

  const handleSubmitOK = useCallback(
    async (username, password) => {
      //Creating object to POST to server
      const signUpObject = {
        username: username,
        password: password,
      };

      const res: any = login?.(signUpObject);

      if (res) {
        navigate('/');
      } else {
        alert('Invalid email / password combination');
      }
    },
    [values, login],
  );

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((values) => {
      const newValues = { ...values, [prop]: event.target.value };
      setTouched((touched) => ({ ...touched, [prop]: true }));
      checkValues(newValues);
      return newValues;
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  function SlideTransition(props: SlideProps) {
    return (
      <Slide
        {...props}
        style={{
          backgroundColor: 'var(--errorRed)',
        }}
        direction="up"
      />
    );
  }

  const state = {
    open: false,
    Transition: SlideTransition,
  };
  const noErrors = errorsSnackbar.username || errorsSnackbar.email || errorsSnackbar.password || errorsSnackbar.pwconfirmation;

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        {noErrors && (
          <Snackbar
            autoHideDuration={4000}
            open={openSnackbar}
            onClose={handleCloseSnackbar}
            TransitionComponent={state.Transition}
            message={
              errorsSnackbar.username
                ? 'Username must be at least 3 characters long'
                : errorsSnackbar.email
                ? 'Invalid email'
                : errorsSnackbar.password
                ? 'Password must be at least 8 characters, 1 number, 1 special character, 1 lowercase & 1 uppercase'
                : errorsSnackbar.pwconfirmation
                ? 'Passwords must match'
                : ''
            }
            key={state.Transition.name}
          />
        )}
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
              mt: 0,
              mx: 'auto',
              pb: 2,
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
              <Typography component="h1" variant="h4" color="white" sx={{ w: 100 }}>
                Create an account
              </Typography>
            </Box>

            {/* BUTTONS START */}
            <Box sx={{ mt: 2, width: '60%' }}>
              <Typography sx={{ mb: 1, mt: 2 }} variant="body2">
                All fields with * are required
              </Typography>
              <Box sx={{ mb: 2 }}>
                <form onSubmit={handleSubmit}>
                  {/* USERNAME */}
                  <FormControl fullWidth sx={{ borderRadius: '4px' }}>
                    <InputLabel htmlFor="username-input">Name*</InputLabel>
                    <FilledInput
                      fullWidth
                      error={errorsSnackbar.username}
                      id="username-input"
                      type="username"
                      value={values.username}
                      onChange={handleChange('username')}
                      required
                    />
                  </FormControl>
                  <Typography sx={{ mb: 2 }} variant="body2">
                    SUPName or alias
                  </Typography>

                  {/* MAIL TEXTFIELD */}
                  <FormControl fullWidth sx={{ borderRadius: '4px' }}>
                    <InputLabel htmlFor="email-input">Mail*</InputLabel>
                    <FilledInput
                      error={errorsSnackbar.email}
                      fullWidth
                      id="email-input"
                      type="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </FormControl>
                  <Typography sx={{ mb: 2 }} variant="body2">
                    mymail@mail.com
                  </Typography>
                  {/* PASSWORD TEXTFIELD */}
                  <FormControl fullWidth sx={{ borderRadius: '4px' }}>
                    <InputLabel htmlFor="password-input">Password*</InputLabel>
                    <FilledInput
                      error={errorsSnackbar.password}
                      fullWidth
                      id="password-input"
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange('password')}
                      required
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
                      /* label="Password" */
                    />
                  </FormControl>
                  <Typography sx={{ mb: 1 }} variant="body2">
                    At least 8 characters, 1 number, 1 special character, 1 lowercase & 1 uppercase
                  </Typography>
                  <FormControl fullWidth sx={{ borderRadius: '4px' }}>
                    <InputLabel htmlFor="pwconfirmation-input">Password Confirmation*</InputLabel>
                    <FilledInput
                      fullWidth
                      id="pwconfirmation-input"
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.pwconfirmation}
                      onChange={handleChange('pwconfirmation')}
                      error={errorsSnackbar.pwconfirmation}
                      required
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
                      /* label="Password" */
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 1,
                      p: 1,
                      backgroundColor: 'var(--primaryBlue)',
                      textTransform: 'none',
                    }}
                  >
                    Sign Up
                  </Button>
                </form>
              </Box>
            </Box>
            {/* SOCIAL BUTTONS */}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignUp;

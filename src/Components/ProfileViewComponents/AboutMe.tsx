import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AlternateEmail, Delete, Email, Phone, Telegram } from '@mui/icons-material';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CheckboxList from '../CheckBoxList/CheckBoxList';
import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  GET_TIMEZONES,
  GET_USER_ABOUT,
  GET_LANGUAGES,
  UPDATE_USER,
  UPDATE_USER_ROLES_LANGS_TIMEZONE,
  DELETE_USER_CONTACTS,
  UPDATE_USER_PIC_PROFILE,
  VERIFY_REFERRAL,
} from 'Queries';
import { CheckboxOptions, User, Timezone, Contact, Step } from 'Types';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import useToggle from 'Hooks/useToggle';
import Swal from 'sweetalert2';
import Style from './AboutMe.module.css';
import { usePrompt } from 'Hooks/blockingHooks';
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import { imgUploadFile } from '../../Firebase/fileUpload.js';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useDebounce from 'PMM2/utils/useDebounce';
import LoadingCircle from 'PMM2/utils/LoadingCircle';
interface State {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  [key: string]: any;
  username: string;
  contacts: Contact[]; //
  profile: string;
  email: string;
  URLs: string[]; // urls
  timeZone: string; // id
  languages: string[]; // ids
  bio: string;
  profileType: string[]; // Proposer/Mentor/Both
}

function AboutMe({ userId }: any) {
  const { username } = useNetworkAuth();
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [getUserAbout, { data: userData, loading: userLoading }] = useLazyQuery(GET_USER_ABOUT, {
    //pollInterval: 1000,
    fetchPolicy: 'no-cache',
    variables: {
      userId: userId,
    },
  });
  const [verifyReferral, { data: userVerifiedUrl, loading: userVerifiedUrlLoading }] = useLazyQuery(VERIFY_REFERRAL);
  const { data: dataTZone } = useQuery(GET_TIMEZONES);
  const { data: dataLanguages } = useQuery(GET_LANGUAGES);
  const [updateUser] = useMutation(UPDATE_USER);
  const [UpdateUserRolesLangsTimezone] = useMutation(UPDATE_USER_ROLES_LANGS_TIMEZONE);
  const [deleteUserContacts] = useMutation(DELETE_USER_CONTACTS);
  const [updatePicUrl] = useMutation(UPDATE_USER_PIC_PROFILE);
  const [isContactOpen, toggleContactOpen] = useToggle(false);
  const [languages, setLanguages] = useState<CheckboxOptions[]>([]);
  const [contactsToDelete, setContactsToDelete] = useState<string[]>([]);
  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are some unsaved changes. Are you sure you want to leave?', isDataChanged);
  const [values, setValues] = useState<State>({
    id: '',
    username: '',
    contacts: [] as Contact[],
    profile: '',
    email: '',
    URLs: [],
    timeZone: '',
    languages: [] as string[], // ids
    bio: '',
    profileType: [],
    referralUrl: '',
  } as State); //Added correction by ChatGPT

  //TOUR VARIABLES
  const stopAboutMeTour = localStorage.getItem('stopAboutMeTour');
  const stopAllTours = localStorage.getItem('stopAllTours');
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    getUserAbout({ variables: { userId: userId } });
  }, [getUserAbout, userId]); //Added changes by CGPT

  useEffect(() => {
    if (userData?.User?.length) {
      const user = userData.User[0] as User;
      setValues((values) => ({
        ...values,
        id: user.id,
        username: user.username,
        email: user.email,
        contacts: user.contacts || [],
        profile: user.profile,
        URLs: user.URLs || [],
        bio: user.bio || '',
        timeZone: user.inZone?.id || '',
        languages: user.languages.map((l) => l.id),
        profileType: user.roles.map((r) => r.id),
        referralUrl: user.referralUrl,
      }));
    }
  }, [
    userData,
    userData?.User[0]?.bio,
    userData?.User[0]?.URLs,
    userData?.User[0]?.contacts,
    userData?.User[0]?.inZone?.id,
    userData?.User[0]?.languages,
    userData?.User[0]?.roles,
    userData?.User[0]?.referralUrl,
  ]);
  const [verifiedUrl, setVerifiedUrl] = useState(false);
  const debouncedReferralUrl = useDebounce(values.referralUrl, 300);

  const verifyUrl = async () => {
    await verifyReferral({
      variables: {
        referralUrl: values.referralUrl,
      },
    });
  };

  useEffect(() => {
    // refetchUrls();
    const p = async () => {
      await verifyUrl();
    };
    p();
  }, [debouncedReferralUrl]);

  useEffect(() => {
    if (values.referralUrl === userData?.User[0]?.referralUrl) {
      setVerifiedUrl(true);
    } else if (values.referralUrl.length === 0) {
      setVerifiedUrl(false);
    } else if (!userVerifiedUrlLoading && userVerifiedUrl !== undefined) {
      setVerifiedUrl(userVerifiedUrl.User.length === 0);
    }
  }, [userVerifiedUrlLoading, verifyUrl, userData?.User[0]?.referralUrl, debouncedReferralUrl]);

  useEffect(() => {
    if (dataTZone?.Timezone) {
      setTimezones(dataTZone.Timezone as Timezone[]);
    }
    //SHOW TOUR?
    // setIsLoading(true);
    if (stopAboutMeTour == null && stopAllTours == null) {
      setSteps([
        {
          target: '[data-step="1"]',
          title: 'Welcome to your profile!',
          content: "Here you'll change all your info.",
        },
        {
          target: '.contacts',
          content: 'Add your contacts here.',
        },
        {
          target: '.profile-type',
          content:
            "You can select your profile type between Mentor, Proposer and Collaborator and receive recommendations based on the interests that you'll set later in the preferences section",
        },
      ]);
      // setIsLoading(false);
    }
  }, [dataTZone]);

  useEffect(() => {
    if (dataLanguages?.Language) {
      setLanguages(dataLanguages.Language as CheckboxOptions[]);
    }
  }, [dataLanguages]);

  const handleChange = useCallback((field: string, value) => {
    setValues((values) => ({ ...values, [field]: value }));
    setDataChanged(true);
  }, []);

  const handleChangeReferralUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
    setDataChanged(true);
    // verifyUrl();
  }, []);

  const handleRoleChange = (event: SelectChangeEvent) => {
    setDataChanged(true);
    const arr = values.profileType;
    if (arr.includes(event.target.value)) {
      arr.splice(arr.indexOf(event.target.value), 1);
      setValues((values) => ({ ...values, profileType: arr }));
    } else {
      arr.push(event.target.value);
      setValues((values) => ({ ...values, profileType: arr }));
    }
  };
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handleIndexedChange = (field: string, index: number, value: any) => {
    setDataChanged(true);
    setValues((values) => ({
      ...values,
      [field]: [...values[field].slice(0, index), value, ...values[field].slice(index + 1)],
    }));
  };

  const addIndexedValue = (field: string, value: any) => {
    setDataChanged(true);
    setValues((values) => ({ ...values, [field]: [...values[field], value] }));
  };

  // const removeIndexedValue = useCallback(
  //   (field: string, index: number) => {
  //     const valueToRemove = values[field][index];
  //     setDataChanged(true);
  //     setValues((values) => ({ ...values, [field]: values[field].slice(0, index).concat(values[field].slice(index + 1)) }));
  //     if (field === 'contacts' && valueToRemove.id) {
  //       setContactsToDelete((toDelete) => [...toDelete, valueToRemove.id]);
  //     }
  //   },
  //   [values],
  // );

  const handleTimezoneSelectChange = (event: SelectChangeEvent) => {
    setValues({
      ...values,
      timeZone: event.target.value,
    });
    setDataChanged(true);
  };

  const handleToggle = useCallback(
    (value: string) => {
      const currentIndex = values.languages.indexOf(value);
      const newChecked = [...values.languages];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setValues((values) => ({ ...values, languages: newChecked }));
      setDataChanged(true);
    },
    [values],
  );
  // UPDATE PROFILE PICTURE
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);

  const handleSubmitChangeProfilePic = async () => {
    try {
      const picurl = await imgUploadFile(imgFile);
      await updatePicUrl({
        variables: {
          id: userData?.User[0]?.id,
          picurl: picurl,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  useEffect(() => {
    handleSubmitChangeProfilePic();
  }, [imgFile]);
  // END PROFILE PICTURE
  const [contactToAdd, setContactToAdd] = useState<Contact>({ type: 'email', contact: '', id: '' });

  const handleChangeContactToAdd = (field: string, value: string) => {
    setContactToAdd((contactToAdd) => ({ ...(contactToAdd || {}), [field]: value }));
    setDataChanged(true);
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (evt) => {
      window.scrollTo(0, 0);
      setLoading(true);
      setDataChanged(false);
      evt.preventDefault();
      if (values.username && values.email) {
        //$id: ID!, $username: String, $email: String, $bio: String, $profile: String, $URLs: [String]
        const { errors } = await updateUser({
          variables: {
            id: values.id,
            bio: values.bio,
            profile: values.profile,
            urls: values.URLs,
          },
          fetchPolicy: 'no-cache',
        });
        if (errors) {
          setLoading(false);
          setDataChanged(false);
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          // report errors about user update to display
        }
      }
      await UpdateUserRolesLangsTimezone({
        variables: {
          userId: values.id,
          roles: values.profileType,
          languages: values.languages,
          timezone: values.timeZone,
          referralUrl: values.referralUrl,
        },
      });

      // const contactRes = await addUserContacts({
      //   variables: {
      //     input: {
      //       username: username,
      //       contacts: values.contacts.map((c) => {
      //         return {
      //           type: c.type,
      //           contact: c.contact,
      //         };
      //       }),
      //     },
      //   },
      // });
      // este array esta para mapear los ids para poder dejar solo los que contenga el mismo
      // const contactsIds = contactRes?.data?.AddUserContacts[0]?.contacts.map((contact: any) => contact.id);
      await deleteUserContacts({
        variables: {
          userId: values.id,
          contacts: contactsToDelete.map((id) => id),
        },
      });

      setLoading(false);
      setDataChanged(false);
      Swal.fire({
        title: 'Saved!',
        text: 'Your profile has been updated.',
        icon: 'success',
        confirmButtonText: 'OK',
        didDestroy: () => {
          //return window.location.reload();
        },
      });
    },
    [values, username, contactsToDelete],
  );
  const removeContact = useCallback(
    (contact: Contact, i: number) => {
      if (contact.id) {
        setContactsToDelete((contacts) => [...contacts, contact.id as string]);
      }
      setValues((values) => ({ ...values, contacts: values.contacts.slice(0, i).concat(values.contacts.slice(i + 1)) }));
      setDataChanged(true);
    },
    [values],
  );
  const removeUrl = (index: number) => {
    const urlArr = values.URLs;
    setValues((values) => ({ ...values, URLs: urlArr.slice(0, index).concat(urlArr.slice(index + 1)) }));
    setDataChanged(true);
  };

  const handleSuccess = useCallback(() => {
    if (contactToAdd.contact && contactToAdd.type) {
      addIndexedValue('contacts', contactToAdd);
      setContactToAdd({ type: 'email', contact: '', id: '' });
      toggleContactOpen();
    }
  }, [contactToAdd]);

  if (userLoading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  // const handleJoyrideEnd = (data: any) => {
  //   const { action, index, status, type } = data;

  //   if (status === 'finished') {
  //     localStorage.setItem('stopAboutMeTour', 'true');
  //   }
  //   if (status === 'skipped') {
  //     Swal.fire({
  //       title: 'Skip tour!',
  //       text: 'Skip all tours or just this one?',
  //       icon: 'info',
  //       confirmButtonText: 'No, just this one',
  //       showDenyButton: true,
  //       denyButtonText: 'All',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         localStorage.setItem('stopAboutMeTour', 'true');
  //       } else if (result.isDenied) {
  //         localStorage.setItem('stopAllTours', 'true');
  //       }
  //     });
  //   }
  //   return;
  // };

  return (
    <form onSubmit={handleSubmit} style={{ overflow: 'hidden', marginBottom: '30px' }}>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.38)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <LinearProgress
            sx={{
              width: '70%',
              height: '5px',
              backgroundColor: '#fff',
            }}
          />
        </Box>
      )}
      <Grid container component="main" spacing={3} sx={{ width: '85%', margin: 'auto' }}>
        {/* {!isLoading && (
          <Joyride
            steps={steps}
            floaterProps={{
              placement: 'top',
            }}
            callback={handleJoyrideEnd}
            showProgress
            continuous
            showSkipButton
            styles={{
              buttonBack: {
                backgroundColor: 'var(--textDark)',
                color: 'white',
              },
              buttonNext: {
                backgroundColor: 'var(--primaryBlue)',
              },
              tooltipContent: {
                fontFamily: 'inherit',
              },
              tooltip: {
                fontFamily: 'inherit',
              },
              options: {
                zIndex: 1000,
              },
            }}
          />
        )} */}
        {/* FIRST BOX */}
        <Grid item xs={12} md={6} lg={4} data-step={'1'}>
          <Box>
            {/* USERNAME TEXTFIELD */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Name or Alias
              </Typography>
              <FilledInput
                disabled={true}
                required
                fullWidth
                size="small"
                id="username-input"
                type="text"
                value={values.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </FormControl>
            {/* PROFILE TYPE SELECT */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: '22px' }} className={'profile-type'}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Choose a Profile
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', ml: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleRoleChange}
                      inputProps={{ 'aria-label': 'role-mentor' }}
                      checked={values.profileType.includes('role-mentor')}
                      size="small"
                    />
                  }
                  label="Mentor"
                  value={'role-mentor'}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleRoleChange}
                      inputProps={{ 'aria-label': 'role-proposer' }}
                      checked={values.profileType.includes('role-proposer')}
                      size="small"
                    />
                  }
                  label="Proposer"
                  value={'role-proposer'}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleRoleChange}
                      inputProps={{ 'aria-label': 'role-collaborator' }}
                      checked={values.profileType.includes('role-collaborator')}
                      size="small"
                    />
                  }
                  label="Collaborator"
                  value={'role-collaborator'}
                />
              </FormControl>
            </FormControl>
            {/* CONTACT INFO TEXTFIELD */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Contacts
              </Typography>
              {!values.contacts.length && (
                <Typography variant="body2" component="div" sx={{ bgcolor: 'lightgray', mb: 1, p: 2 }}>
                  No contacts added yet
                </Typography>
              )}
              {values.contacts?.map((contact: Contact, i: number) => (
                <FilledInput
                  required
                  fullWidth
                  type="text"
                  size="small"
                  placeholder="Contact"
                  key={i}
                  value={contact.contact}
                  onChange={(evt) => !contact.id && handleIndexedChange('contacts', i, evt.target.value)}
                  sx={{ marginBottom: '5px' }}
                  endAdornment={<Delete sx={{ cursor: 'pointer' }} onClick={() => removeContact(contact, i)} />}
                  startAdornment={
                    contact.type === 'telephone' ? (
                      <Phone sx={{ width: '22px', marginRight: '8px' }} />
                    ) : contact.type === 'telegram' ? (
                      <Telegram sx={{ width: '22px', marginRight: '8px' }} />
                    ) : contact.type === 'email' ? (
                      <Email sx={{ width: '22px', marginRight: '8px' }} />
                    ) : (
                      <AlternateEmail sx={{ width: '22px', marginRight: '8px' }} />
                    )
                  }
                />
              ))}
              <FormHelperText sx={{ width: '70%', marginBottom: '-24px' }}>Any way for people inside PMM get in touch</FormHelperText>
            </FormControl>
            <Dialog disableEscapeKeyDown open={isContactOpen} onClose={toggleContactOpen}>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel htmlFor="contact-select">Contact</InputLabel>
                    <Select
                      native
                      name="contact-select"
                      id="contact-select"
                      onChange={(evt) => {
                        handleChangeContactToAdd('type', evt.target.value as string);
                      }}
                      displayEmpty
                      input={<OutlinedInput label="contactInputType" id="contact-select-input" />}
                    >
                      <option value="email">Email</option>
                      <option value="telephone">Telephone</option>
                      <option value="telegram">Telegram</option>
                      <option value="discord">Discord</option>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-dialog-select-label">Contact</InputLabel>
                    <FilledInput
                      id="select"
                      required
                      fullWidth
                      size="small"
                      type="text"
                      placeholder="Contact"
                      onChange={(evt) => handleChangeContactToAdd('contact', evt.target.value)}
                    />
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleContactOpen}>Cancel</Button>
                <Button onClick={handleSuccess}>Ok</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Button
            className={'contacts'}
            onClick={toggleContactOpen}
            variant="text"
            startIcon={<AddSharpIcon />}
            sx={{ color: 'var(--textDark)' }}
          >
            Add Contact
          </Button>
        </Grid>
        {/* SECOND BOX */}
        <Grid item xs={12} md={6} lg={4}>
          <Box>
            {/* Brief Bio word-profile TEXTFIELD */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Define your Profile
              </Typography>
              <FilledInput
                required
                fullWidth
                id="brief-bio-input"
                type="text"
                size="small"
                placeholder="Engineer, Dev, Designer..."
                value={values.profile}
                onChange={(evt) => handleChange('profile', evt.target.value)}
              />
              <FormHelperText sx={{ marginBottom: '-24px' }}>Let others know, in a few words, who you are</FormHelperText>
            </FormControl>
            {/* TIME ZONE SELECT */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Time Zone
              </Typography>
              <Select
                value={values.timeZone}
                onChange={handleTimezoneSelectChange}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
              >
                {timezones?.map((timezone: Timezone) => (
                  <MenuItem key={timezone.id} value={timezone.id}>
                    {timezone.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ marginBottom: '-24px' }}>Let others know your time zone to arrange meetings</FormHelperText>
            </FormControl>
            {/* URL TEXTFIELD */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 1 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                URL
              </Typography>

              {!values.URLs.length && (
                <Typography variant="body2" component="div" sx={{ bgcolor: 'lightgray', padding: '8px' }}>
                  No URLs added yet
                </Typography>
              )}
              {values.URLs?.map((url: string, i: number) => (
                <FilledInput
                  required
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="enter your URL"
                  key={i}
                  value={url}
                  onChange={(evt) => handleIndexedChange('URLs', i, evt.target.value)}
                  endAdornment={<Delete sx={{ cursor: 'pointer' }} onClick={() => removeUrl(i)} />}
                  sx={{ marginBottom: '8px' }}
                />
              ))}
              <FormHelperText sx={{ width: '70%' }}>
                Do you want to share a portfolio? Maybe a personal website? Go for it, express yourself
              </FormHelperText>
              <Button
                onClick={() => {
                  addIndexedValue('URLs', '');
                }}
                variant="text"
                startIcon={<AddSharpIcon />}
                sx={{ color: 'var(--textDark)', textAlign: 'left', justifyContent: 'start' }}
              >
                Add URL
              </Button>
            </FormControl>
            {/* ADD EXTRA URL FIELD BUTTON */}
          </Box>
        </Grid>
        {/* THIRD BOX */}
        {/* PROFILE PICTURE & LANGUAGES */}
        <Grid item xs={12} lg={4}>
          <Box>
            <Box sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                Profile Picture
              </Typography>
              <Avatar
                src={userData?.User[0]?.picurl}
                sx={{
                  width: '170px',
                  height: '170px',
                  borderRadius: '100px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '25px',
                }}
              ></Avatar>
              <IconButton aria-label="upload picture" component="label" sx={{ marginBottom: '150px' }}>
                <input hidden accept="image/*" type="file" onChange={(e) => setImgFile(e.target.files?.[0])} />
                <EditIcon />
              </IconButton>
            </Box>
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 1 }}>
              {/* REFERAL URL */}
              <Box display={values.profileType.includes('role-mentor') ? 'block' : 'none'}>
                <Box display={'flex'} alignItems={'center'} mt={'12px'}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem' }}>
                    Your referral URL
                  </Typography>
                  {userVerifiedUrlLoading ? (
                    <Box display={'flex'} alignItems={'center'} ml={'4px'} height={'0px'}>
                      <LoadingCircle size={18} height={'0px'} />
                    </Box>
                  ) : (
                    <Box display={'flex'} alignItems={'center'} ml={'4px'}>
                      {verifiedUrl ? (
                        <Tooltip title={'Url Available'}>
                          <CheckCircleIcon
                            sx={{
                              fontSize: '18px',
                              color: '#38D059',
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title={'Url Unavaible'}>
                          <ErrorIcon
                            color="error"
                            sx={{
                              fontSize: '18px',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>
                <Box display={'flex'} alignItems="flex-end">
                  <Typography>Promem.co/</Typography>
                  <FilledInput
                    required={values.profileType.includes('role-mentor')}
                    fullWidth
                    size="small"
                    id="referalLink-input"
                    type="text"
                    placeholder="Mentor1234"
                    color={verifiedUrl ? 'success' : 'error'}
                    name={'referralUrl'}
                    onChange={handleChangeReferralUrl}
                    value={values.referralUrl}
                  />
                </Box>
                <FormHelperText>Personalize the URL that your mentees will see.</FormHelperText>
              </Box>
            </FormControl>
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 1 }}>
              {/* LANGUAGE TEXTFIELD */}
              <Typography variant="h6" component="h2" sx={{ fontWeight: '400', fontSize: '1rem', marginTop: '12px' }}>
                Language
              </Typography>
              {/* <FilledInput
              required
              fullWidth
              id="language-input"
              type="text"
              placeholder="English, Japanese, Spanish..."
              value={values.contactInfo}
            /> */}
              <CheckboxList options={(languages || []) as CheckboxOptions[]} handleToggle={handleToggle} checked={values.languages} />
              <FormHelperText>Get in touch with people you can communicate in the same language</FormHelperText>
            </FormControl>
            {/* CLOSE ACCOUNT LINK */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" startIcon={<CloseSharpIcon />} sx={{ color: 'var(--textDark)' }}>
                Close my PMM Account
              </Button>
            </Box> */}
          </Box>
        </Grid>
        {/* END PROFILE PICTURE & LANGUAGES */}

        {/* BOTTOM BIOGRAPHY TEXTAREA */}
        <Grid item xs={12} sx={{ paddingTop: 0 }} className={Style.bio}>
          <Box>
            <FormControl fullWidth sx={{ borderRadius: '4px' }}>
              <Typography>Bio</Typography>
              <TextField
                id="bio-input"
                value={values.bio}
                multiline
                rows={4}
                placeholder="Let us know a little bit about you, what you are interested in, what you are looking for..."
                variant="outlined"
                fullWidth
                onChange={(evt) => {
                  handleChange('bio', evt.target.value);
                }}
              />
            </FormControl>
          </Box>
        </Grid>
        {/* SUBMIT BUTTON */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} flexDirection={isMobile ? 'column' : 'row'}>
            <Button
              variant="contained"
              // type="submit"
              sx={{
                display: 'flex',
                width: '100%',
                height: '56px',
                backgroundColor: 'var(--primaryBlue)',
                color: 'white',
                textTransform: 'none',
                maxWidth: !isMobile ? '273px' : 'none',
                // px: 15,
                // py: 2,
                '&hover': { backgroundColor: 'var(--primaryBlueHover) !important' },
                mr: !isMobile ? '26px' : 'none',
                mb: isMobile ? '26px' : 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!verifiedUrl}
              sx={{
                display: 'flex',
                width: '100%',
                maxWidth: !isMobile ? '273px' : 'none',
                height: '56px',
                backgroundColor: 'var(--primaryBlue)',
                color: 'white',
                textTransform: 'none',
                // px: 15,
                // py: 2,
                '&hover': { backgroundColor: 'var(--primaryBlueHover) !important' },
              }}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default AboutMe;

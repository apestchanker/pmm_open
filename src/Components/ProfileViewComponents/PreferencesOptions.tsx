import { useMutation, useQuery } from '@apollo/client';
import { Autocomplete, Box, Button, Chip, CircularProgress, FormControl, Grid, TextField, Typography } from '@mui/material';
import CheckboxList from 'Components/CheckBoxList/CheckBoxList';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_SINGLE_USER_INTERESTS, GET_USER_INTERESTS, UPDATE_USER_PREFERENCES, UPDATE_USER_INTERESTS } from 'Queries';
import React, { useEffect, useState } from 'react';
import { CheckboxOptions } from 'Types';
import Swal from 'sweetalert2';
import { usePrompt } from 'Hooks/blockingHooks';

interface State {
  interests: string;
  meetingPreferences: string[];
}

const PreferencesOptions = (props: any) => {
  //const [checked, setChecked] = useState<any[]>([]);
  const [updateUserPreferences, { data: updatePreferencesData }] = useMutation(UPDATE_USER_PREFERENCES);
  const [updateUserInterests, { data: updateInterestsData }] = useMutation(UPDATE_USER_INTERESTS);
  const { username } = useNetworkAuth();

  const newArrDefValues: any = [];

  const { data, loading } = useQuery(GET_SINGLE_USER_INTERESTS, {
    variables: {
      username,
    },
  });

  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);

  const { data: interestsData } = useQuery(GET_USER_INTERESTS);

  const [values, setValues] = useState<any>([]);

  const handleToggle = (value: string) => {
    const currentIndex = props.checked.indexOf(value);
    const newChecked = [...props.checked];
    setDataChanged(true);
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    props.setChecked(newChecked);
  };

  //setting initial values for interests.
  useEffect(() => {
    setValues(data?.User[0]?.interestedIn);
  }, [data]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setDataChanged(false);
    await updateUserPreferences({
      variables: {
        userId: data?.User[0]?.id,
        preferences: props.checked,
      },
    });
    if (props.checked) {
      setDataChanged(false);
      Swal.fire({
        title: 'Preferences Updated!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    } else {
      Swal.fire({
        title: 'Something went wrong!',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
    const processedValuesArray = values.map((val: any) => val.id);
    if (values) {
      await updateUserInterests({
        variables: {
          userId: data?.User[0]?.id,
          interests: processedValuesArray,
        },
      });
    }
  };

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
    setDataChanged(true);
  };

  const handleChangeAU = (event: any, newVal: string | null) => {
    setValues([...values, newVal]);
    setDataChanged(true);
  };

  const optionsList: CheckboxOptions[] = [];

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  // Array for selected options in interests
  const userIntArr = data?.User[0]?.interestedIn;
  //const userIntArr = data?.users[0]?.interestedIn?.map((int: any) => int.id);

  userIntArr?.forEach((userInt: any) => {
    const index = interestsData?.Interest.findIndex((Int: any) => Int.name === userInt.name);
    newArrDefValues.push(interestsData?.Interest[index]);
  });

  return (
    <Grid container spacing={3} sx={{ backgroundColor: 'rgb(235 240 249)', width: '90%', margin: 'auto', marginBottom: '30px' }}>
      <Grid item xs={12} sx={{ paddingTop: '2px' }}>
        <Typography
          sx={{ paddingTop: '5px', mb: 1, mt: 1, lineHeight: '36px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
          variant="h4"
          component="h2"
        >
          {/* CHANGE TO props.profileType later */}
          {'Mentor & Proposer'}
        </Typography>
      </Grid>
      <Grid container sm={12} sx={{ padding: { xs: '10px', lg: '10px 120px' } }}>
        {/* INTERESTS */}
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            width: 'inherit',
          }}
        >
          <>
            <Typography
              sx={{ mb: '8px', mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
              variant="h6"
              component="h3"
            >
              Interests
            </Typography>
            <Typography
              sx={{ mb: 3, mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '0.9rem', width: 'auto', color: '#808080' }}
              // variant="body2"
            >
              What your interests are when it comes to mentoring?
            </Typography>
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5, maxWidth: '350px', marginBottom: '15px' }}>
              <Autocomplete
                fullWidth
                multiple
                limitTags={2}
                value={values}
                onChange={(event: any, newValue: any | null) => (setValues(newValue), setDataChanged(true))}
                id="tags-outlined"
                getOptionLabel={(interest: any) => interest?.name}
                defaultValue={newArrDefValues}
                options={interestsData?.Interest === undefined ? [] : interestsData?.Interest}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} variant="filled" placeholder="Social impact, Development..." />}
              />
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '350px' }}>
              {values?.map((tag: any, index: number) => {
                return <Chip sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', m: 1 }} key={index} label={tag.name} />;
              })}
            </Box>
          </>
        </Grid>
        {/* MEETING PREFERENCES */}
        <Grid item sm={12} md={6}>
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{ mb: '8px', mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
              variant="h6"
              component="h3"
            >
              Meeting Preferences
            </Typography>
            <Typography
              sx={{ mb: 3, mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '0.9rem', color: '#808080' }}
              // variant="body2"
            >
              Tell us a little more about your preferences...
            </Typography>
            <CheckboxList options={props.options} handleToggle={handleToggle} checked={props.checked} />
          </Box>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center', padding: '10px !important' }}
      >
        <Button
          variant="contained"
          sx={{
            display: 'flex',
            width: '130px',
            height: '56px',
            backgroundColor: 'var(--primaryBlue)',
            color: 'white',
            textTransform: 'none',
          }}
          onClick={handleSubmit}
        >
          SAVE
        </Button>
      </Grid>
    </Grid>
  );
};

export default PreferencesOptions;

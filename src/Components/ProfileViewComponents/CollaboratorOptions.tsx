import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Autocomplete, Box, Button, Chip, CircularProgress, FormControl, Grid, TextField, Typography } from '@mui/material';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_USER_INTERESTS, UPDATE_USER_INTERESTS } from 'Queries';
import React, { useEffect, useState } from 'react';
import { CheckboxOptions } from 'Types';
import Swal from 'sweetalert2';
import { GET_SKILLS, GET_USER_SKILLS, UPDATE_USER_AVAILABILITY, UPDATE_USER_SKILLS } from 'Queries/collaboratorQueries';
import { usePrompt } from 'Hooks/blockingHooks';

interface State {
  interests: string;
  meetingPreferences: string[];
}

const CollaboratorOptions = (props: any) => {
  //const [checked, setChecked] = useState<any[]>([]);
  const { data: skillsData, loading: skillsLoading } = useQuery(GET_SKILLS);
  const [skillsDataState, setSkillsDataState] = useState<any>([]);
  const [tagValues, setTagValues] = React.useState<any>([]);
  const [updateUserSkills, { data: updateUserSkillsData, loading: updateUserSkillsLoading, error: updateUserSkillsError }] =
    useMutation(UPDATE_USER_SKILLS);
  const [
    updateUserAvailability,
    { data: updateUserAvailabilityData, loading: updateUserAvailabilityLoading, error: updateUserAvailabilityError },
  ] = useMutation(UPDATE_USER_AVAILABILITY);
  const [updateUserInterests, { data: updateInterestsData }] = useMutation(UPDATE_USER_INTERESTS);
  const { username } = useNetworkAuth();
  const newArrDefValues: any = [];
  useEffect(() => {
    setSkillsDataState(skillsData?.Skill);
  }, [skillsData, skillsData?.Skill]);

  //MAIN DATA FOR LOGIC
  const [getUserInfo, { data, loading }] = useLazyQuery(GET_USER_SKILLS, { fetchPolicy: 'no-cache' });
  /*   const { data, loading } = useQuery(GET_USER_SKILLS, {
    variables: {
      username,
    },
  }); */

  useEffect(() => {
    getUserInfo({ variables: { username } });
  }, [username, getUserInfo]);

  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);

  const { data: interestsData } = useQuery(GET_USER_INTERESTS);

  const [values, setValues] = useState<any>([]);
  const [availability, setAvailability] = useState<any>(null);

  //setting initial values for interests.
  useEffect(() => {
    loading ? setTagValues([]) : setTagValues(data?.User[0]?.hasSkill);
    setAvailability(data?.User[0]?.availability);
  }, [data, data?.User[0]?.availability, data?.User[0]?.hasSkill, loading]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await updateUserSkills({
      variables: {
        userId: data?.User[0]?.id,
        skills: tagValues.map((tag: any) => tag.id),
      },
    });
    await updateUserAvailability({
      variables: {
        userId: data?.User[0]?.id,
        availability: Number(availability),
      },
    });
    if (updateUserSkillsError || updateUserAvailabilityError) {
      Swal.fire({
        title: 'Something went wrong!',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          //return window.location.reload();
        },
      });
    } else {
      setDataChanged(false);
      Swal.fire({
        title: 'Preferences Updated!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          //return window.location.reload();
        },
      });
    }
  };

  const optionsList: CheckboxOptions[] = [];

  if (loading && data === undefined) {
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
          sx={{ paddingTop: '5px', mb: 3, mt: 1, lineHeight: '36px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
          variant="h4"
          component="h2"
        >
          {/* CHANGE TO props.profileType later */}
          {'Collaborator'}
        </Typography>
      </Grid>
      <Grid container sm={12} sx={{ padding: { xs: '10px', md: '10px 120px' } }}>
        {/* INTERESTS */}
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            width: 'inherit',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{ mb: '8px', mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
              variant="h6"
              component="h3"
            >
              Skills
            </Typography>
            <Typography
              sx={{ mb: 3, mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '0.9rem', minHeight: '40px', color: '#808080' }}
              variant="body2"
            >
              What are your skills?
            </Typography>
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5, maxWidth: '350px', marginBottom: '15px' }}>
              <Autocomplete
                multiple
                limitTags={2}
                value={tagValues}
                onChange={(event: any, newValue: any | null) => (setTagValues(newValue), setDataChanged(true))}
                id="tags-outlined"
                getOptionLabel={(interest: any) => interest?.name}
                options={skillsDataState === undefined ? [] : skillsDataState}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} variant="filled" placeholder={tagValues.length === 0 ? 'Javascript, Management, Design...' : ''} />
                )}
              />
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '350px' }}>
              {loading
                ? 'pimba'
                : tagValues?.map((tag: any, index: number) => {
                    return <Chip sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', m: 1 }} key={index} label={tag.name} />;
                  })}
            </Box>
          </Box>
        </Grid>
        {/* MEETING PREFERENCES */}
        <Grid
          item
          xs={12}
          md={6}
          // sx={{
          //   marginLeft: '10px',
          // }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{ mb: '8px', mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '1.2rem' }}
              variant="h6"
              component="h3"
            >
              Availability
            </Typography>
            <Typography
              sx={{ mb: 3, mt: 1, lineHeight: '20px', letterSpacing: '0.25px', fontSize: '0.9rem', minHeight: '40px', color: '#808080' }}
              // variant="body2"
            >
              Let others know your availability per week in hours.
            </Typography>
            <TextField
              fullWidth
              variant="filled"
              type="number"
              value={availability}
              name="availability"
              sx={{
                maxWidth: '350px',
              }}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => (Number(e.target.value) > 0 ? (setAvailability(e.target.value), setDataChanged(true)) : setAvailability(0))}
            ></TextField>
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

export default CollaboratorOptions;

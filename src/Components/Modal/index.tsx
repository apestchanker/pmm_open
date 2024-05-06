import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete, FormControl, Grid, InputLabel, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Select from '@mui/material/Select';
import TuneIcon from '@mui/icons-material/Tune';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import CheckboxList from 'Components/CheckBoxList/CheckBoxList';
import { GET_TIMEZONES, GET_CHALLENGES } from 'Queries';
import { GET_USER_ROLES } from 'Queries';
import { useQuery } from '@apollo/client';
import { Interest } from 'Types';
const modalStyle = {
  position: 'relative',
  bgcolor: 'rgba(229, 229, 229, 1)',
  borderRadius: '10px',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
  width: '80%',
  maxWidth: '700px',
  maxHeight: '100%',
};

export default function BasicModal(props: any) {
  const newArrDefValues: any = [];
  const { data: timeZonesArray } = useQuery(GET_TIMEZONES);
  const { data: challengesArray } = useQuery(GET_CHALLENGES);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const roles = userLabelsData?.User[0]?.roles;
  const isMentor = roles?.includes('Mentor');
  const [fundingStateArray, setFundingStateArray] = React.useState<any>([]);
  const [fundingState, setFundingState] = React.useState<any>('');
  const [filteredChallenges, setFilteredChallenges] = React.useState<any>([]);
  React.useEffect(() => {
    setFilteredChallenges(challengesArray?.Challenge?.filter((challenge: any) => challenge.fund === fundingState));
  }, [fundingState]);
  React.useEffect(() => {
    if (challengesArray) {
      setFundingStateArray(Array.from(new Set(challengesArray?.Challenge.map((challenge: any) => challenge.fund))));
    }
  }, [challengesArray]);
  const handleApplyFilters = () => {
    props.applyFilter();
    setOpen(false);
  };
  const handleChangeTimezone = (event: SelectChangeEvent) => {
    props.setTimeZone(event.target.value);
  };
  const handleChangeChallenge = (event: SelectChangeEvent) => {
    props.setChallenge(event.target.value);
  };
  const handleToggle = (value: string) => {
    const currentIndex = props.checked.indexOf(value);
    const newChecked = [...props.checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    props.setChecked(newChecked);
  };
  React.useEffect(() => {
    props.setChecked([]);
    props.setChallenge('');
    props.setTimeZone('');
  }, [props.selectedInterest]);
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '16px', marginRight: '5px' }}> Filter </Typography>
        <TuneIcon fontSize="large" sx={{ cursor: 'pointer', fontSize: '1.7rem' }} onClick={handleOpen} />
      </Box>
      <Modal
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box>
            <CancelIcon
              sx={{ position: 'absolute', cursor: 'pointer', right: 10, top: 10, width: '30px', height: '30px' }}
              onClick={handleClose}
            />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              sx={{ fontWeight: '900', paddingBottom: '20px' }}
              id="modal-modal-title"
              variant="h5"
              component="h1"
              fontSize="1.3rem"
            >
              Filters
            </Typography>
          </Box>
          {props.tab === 'Collaborators' || props.tab === 'Tasks' ? (
            <FormControl fullWidth>
              <Autocomplete
                multiple
                fullWidth
                limitTags={2}
                value={props.selectedSkills}
                onChange={(event: any, newValue: any[] | null) => props.setSelectedSkills(newValue)}
                getOptionLabel={(skill: any) => skill?.name}
                // defaultValue={newArrDefValues}
                options={props.skillsData?.Skill}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} placeholder="HTML, CSS..." />}
              />
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <Autocomplete
                multiple
                fullWidth
                limitTags={2}
                value={props.selectedInterest}
                onChange={(event: any, newValue: any[] | null) => props.setSelectedInterest(newValue as Interest[])}
                getOptionLabel={(interest: any) => interest?.name}
                defaultValue={newArrDefValues}
                options={props.interestsData?.Interest}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} placeholder="Social impact, Development..." />}
              />
            </FormControl>
          )}

          <Typography
            sx={{ marginLeft: '12px', fontWeight: '900', paddingTop: '20px' }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontSize="1.1rem"
          >
            Preferences
          </Typography>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginLeft: '12px' }}>
              <CheckboxList options={props.options} handleToggle={handleToggle} checked={props.checked} />
            </Box>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: '30px' }}>
            <Grid container sx={{ paddingTop: '25px' }}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ marginLeft: '12px', fontWeight: '900' }}
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  fontSize="1.1rem"
                >
                  Time Zone Difference
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="timeZoneLabel">Select timezone</InputLabel>
                  <Select
                    sx={{ bgcolor: 'white', boxShadow: 10 }}
                    labelId="timeZoneLabel"
                    label="Select timezone"
                    value={props.timeZone}
                    variant="outlined"
                    onChange={handleChangeTimezone}
                    fullWidth
                  >
                    <MenuItem value={'Any'}>Any</MenuItem>
                    {timeZonesArray?.Timezone?.map((timezone: any) => {
                      return (
                        <MenuItem key={timezone.id} value={timezone.id}>
                          {timezone.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          {isMentor && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: '47px' }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{ marginLeft: '12px', fontWeight: '900' }}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    fontSize="1.1rem"
                  >
                    Challenge
                  </Typography>
                </Grid>
                {/* CAMPAIGN START*/}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <Typography>Fund *</Typography>
                    <Select
                      required
                      sx={{ width: '95%' }}
                      inputProps={{ 'aria-label': 'Without label' }}
                      type="text"
                      value={fundingState}
                      onChange={(e) => setFundingState(e.target.value)}
                    >
                      {fundingStateArray?.map((challenge: any, index: number) => (
                        <MenuItem key={`${challenge}inchall${index}`} value={challenge}>
                          {challenge}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <Typography>Challenge *</Typography>
                    <Select
                      required
                      inputProps={{ 'aria-label': 'Without label' }}
                      id="campaign-select"
                      type="text"
                      value={fundingState.title}
                      onChange={handleChangeChallenge}
                    >
                      {filteredChallenges?.map((challenge: any) => (
                        <MenuItem key={challenge.id} value={challenge.id}>
                          {challenge.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* CAMPAIGN END*/}
              </Grid>
            </Box>
          )}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '25px' }}>
            <Button sx={{ width: '175px', bgcolor: 'rgba(38, 53, 96, 1)' }} variant="contained" onClick={handleApplyFilters}>
              Apply filters
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

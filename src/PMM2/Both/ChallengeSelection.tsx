import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const ChallengeSelection = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints['down']('md'));
  // const isXs = useMediaQuery(theme.breakpoints['only']('xs'));
  const isMd = useMediaQuery(theme.breakpoints['only']('md'));

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [selectValues, setSelectValues] = useState({
    firstChallenge: '',
    secondChallenge: '',
    thirdChallenge: '',
  });

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectValues({ ...selectValues, [event.target.name]: event.target.value });
  };

  const [radioValue, setRadioValue] = React.useState('first-challenge');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        mb: '50px',
      }}
    >
      <Accordion defaultExpanded expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          Choose three challenges
        </AccordionSummary>
        <AccordionDetails>
          <Box p={isMobile ? 'none' : '0px 83px 0 83px'}>
            <Typography pb={'30px'} fontFamily="Roboto" fontSize={'16px'} fontWeight={400} lineHeight={'20px'} letterSpacing={'0.25px'}>
              Please, taking into account the information provided about challenges (link) please choose 3 possible challenges and explain
              why.
            </Typography>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} mb={'48px'} flexWrap="wrap">
              <FormControl sx={{ minWidth: isMd ? 'auto' : '275px', mr: '26px' }} size="small">
                <Select name="firstChallenge" value={selectValues.firstChallenge} onChange={handleSelectChange} displayEmpty>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="challenge-x">Challenge X</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <RadioGroup value={radioValue} onChange={handleRadioChange}>
                  <FormControlLabel value="first-challenge" control={<Radio />} label="" />
                </RadioGroup>
              </FormControl>
              <Typography
                color="#34C053"
                fontFamily="Roboto"
                fontWeight={700}
                fontSize={'24px'}
                lineHeight={'28.13px'}
                ml={isMobile ? 'none' : '44px'}
              >
                0.25% of budget
              </Typography>
            </Box>
            <Box
              sx={{
                border: '1px solid black',
                borderRadius: '20px',
                p: '22px 37px',
                mb: '47px',
              }}
            >
              <Typography
                fontFamily="Roboto"
                fontWeight={400}
                fontSize={'14px'}
                lineHeight={'20px'}
                letterSpacing={'0.25px'}
                ml={isMobile ? 'none' : '44px'}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} mb={'48px'} flexWrap="wrap">
              <FormControl sx={{ minWidth: isMd ? 'auto' : '275px', mr: '26px' }} size="small">
                <Select name="secondChallenge" value={selectValues.secondChallenge} onChange={handleSelectChange} displayEmpty>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="challenge-x">Challenge X</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <RadioGroup value={radioValue} onChange={handleRadioChange}>
                  <FormControlLabel value="second-challenge" control={<Radio />} label="" />
                </RadioGroup>
              </FormControl>
              <Typography
                color="#FF5C00"
                fontFamily="Roboto"
                fontWeight={700}
                fontSize={'24px'}
                lineHeight={'28.13px'}
                ml={isMobile ? 'none' : '44px'}
              >
                2.5% of budget
              </Typography>
            </Box>
            <Box
              sx={{
                border: '1px solid black',
                borderRadius: '20px',
                p: '22px 37px',
                mb: '47px',
              }}
            >
              <Typography
                fontFamily="Roboto"
                fontWeight={400}
                fontSize={'14px'}
                lineHeight={'20px'}
                letterSpacing={'0.25px'}
                ml={isMobile ? 'none' : '44px'}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} mb={'48px'} flexWrap="wrap">
              <FormControl sx={{ minWidth: isMd ? 'auto' : '275px', mr: '26px' }} size="small">
                <Select name="thirdChallenge" value={selectValues.thirdChallenge} onChange={handleSelectChange} displayEmpty>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="challenge-x">Challenge X</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <RadioGroup value={radioValue} onChange={handleRadioChange}>
                  <FormControlLabel value="third-challenge" control={<Radio />} label="" />
                </RadioGroup>
              </FormControl>
              <Typography
                color="#FE1313"
                fontFamily="Roboto"
                fontWeight={700}
                fontSize={'24px'}
                lineHeight={'28.13px'}
                ml={isMobile ? 'none' : '44px'}
              >
                15% of budget
              </Typography>
            </Box>
            <Box
              sx={{
                border: '1px solid black',
                borderRadius: '20px',
                p: '22px 37px',
                mb: '47px',
              }}
            >
              <Typography
                fontFamily="Roboto"
                fontWeight={400}
                fontSize={'14px'}
                lineHeight={'20px'}
                letterSpacing={'0.25px'}
                ml={isMobile ? 'none' : '44px'}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ChallengeSelection;

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AboutMe from 'Components/ProfileViewComponents/AboutMe';
import Preferences from 'Components/ProfileViewComponents/Preferences';
import TourCarousel from 'Components/TourCarousel/TourCarousel';
import { UPDATE_USER_MEMBER_DATE, GET_USER_ID, GET_USER_MEMBER_SINCE } from 'Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';

const steps = ['Set your Profile', 'Set your Preferences', 'More Info', ''];

export default function TourStepper() {
  const { username } = useNetworkAuth();
  console.log(username, '123');
  const navigate = useNavigate();

  const { data: userMemberSince, loading: memberSinceLoading } = useQuery(GET_USER_MEMBER_SINCE, {
    variables: { username: username },
  });
  console.log(userMemberSince, memberSinceLoading, '123');
  React.useEffect(() => {
    if (!memberSinceLoading) {
      if (userMemberSince !== undefined && userMemberSince?.User[0]?.memberSince?.formatted !== '2022-01-01T00:00:00Z') {
        navigate('/');
      }
    }
  }, [userMemberSince, memberSinceLoading]);
  console.log(userMemberSince, memberSinceLoading, '123');

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [updateMemberSince, { loading, error, data }] = useMutation(UPDATE_USER_MEMBER_DATE);
  const { data: userData } = useQuery(GET_USER_ID, {
    variables: { username },
  });
  const userId = userData?.User[0]?.id;
  console.log(userData, '123');
  const isStepOptional = (step: number) => {
    return step === -1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = async () => {
    /* if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    } */

    /* setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    }); */
    await updateMemberSince({
      variables: {
        memberSince: new Date().toISOString(),
        id: userData?.User[0]?.id,
      },
    });
    navigate('/');
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleMarketplaceRedirect = () => {
    handleSkip();
    navigate('/marketplace');
  };
  return (
    <Box sx={{ width: '80%', margin: 'auto', marginTop: '35px' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All set... Welcome to PMM!</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* <Button onClick={handleReset}>Reset</Button> */}
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            {
              <Button
                color="inherit"
                disabled={activeStep === 0 || activeStep === 2}
                sx={{ mr: 1, display: activeStep === 0 || activeStep === 2 ? 'none' : 'block' }}
                onClick={handleBack}
              >
                Back
              </Button>
            }
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            {activeStep !== steps.length - 1 ? (
              activeStep === 2 ? null : (
                <Button onClick={handleNext}>Next</Button>
              )
            ) : (
              <Button onClick={handleSkip}>Finish</Button>
            )}
          </Box>
          {/* INSERT COMPONENTS */}
          {activeStep === 0 && (
            <Box sx={{ width: '100%' }}>
              <AboutMe userId={userId} />
            </Box>
          )}
          {activeStep === 1 && (
            <Box sx={{ width: '100%' }}>
              <Preferences />
            </Box>
          )}
          {activeStep === 2 && (
            <Paper
              elevation={2}
              sx={{ width: '80%', margin: 'auto', marginTop: '25px', padding: '20px', backgroundColor: 'var(--bgGray)' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Want a quick tour?
                </Typography>
                <Button
                  sx={{
                    color: 'white',
                    backgroundColor: 'var(--primaryBlue)',
                    '&:hover': {
                      backgroundColor: 'var(--primaryBlueHover)',
                    },
                  }}
                  onClick={handleNext}
                >
                  Let&apos;s Go
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Go to Marketplace!
                </Typography>
                <Button
                  sx={{
                    color: 'white',
                    backgroundColor: 'var(--primaryBlue)',
                    '&:hover': {
                      backgroundColor: 'var(--primaryBlueHover)',
                    },
                  }}
                  onClick={handleMarketplaceRedirect}
                >
                  Marketplace
                </Button>
              </Box>
            </Paper>
          )}
          {activeStep === 3 && (
            <Box sx={{ width: '100%' }}>
              <TourCarousel handleNext={handleNext} activeStep={activeStep} stepLength={steps.length} />
            </Box>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}

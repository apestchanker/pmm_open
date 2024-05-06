import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@mui/material';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_USER_PREFERENCES_LABEL, GET_USER_PREFERENCES, GET_USER_ROLES } from 'Queries';
import { useEffect, useState } from 'react';
import { Step, User } from 'Types';
import CollaboratorOptions from './CollaboratorOptions';
import PreferencesOptions from './PreferencesOptions';
import Joyride from 'react-joyride';
import Swal from 'sweetalert2';

function Preferences() {
  const { username } = useNetworkAuth();
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [checkedMentor, setCheckedMentor] = useState<any[]>([]);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [checkedProposer, setCheckedProposer] = useState<any[]>([]);
  const { data, loading } = useQuery(GET_USER_PREFERENCES_LABEL);
  const { data: userData } = useQuery(GET_USER_PREFERENCES, { variables: { username }, fetchPolicy: 'no-cache' });
  const { data: dataRoles, loading: rolesLoading } = useQuery(GET_USER_ROLES, { variables: { username }, fetchPolicy: 'no-cache' });
  const [userType, setUserType] = useState('');

  //TOUR VARIABLES
  const stopPreferencesTour = localStorage.getItem('stopPreferencesTour');
  const stopAllTours = localStorage.getItem('stopAllTours');

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (userData?.User?.length) {
      const user = userData?.User[0] as User;
      const userType = user.roles?.reduce((acc: string, r) => {
        if (acc === 'Proposer' && r.name === 'Mentor') {
          return 'Both';
        }
        if (acc === 'Mentor' && r.name === 'Proposer') {
          return 'Both';
        }
        return r.name;
      }, '');
      setUserType(userType);
      setCheckedMentor(user?.preferences?.map((pref) => pref.id));
      setCheckedProposer(user?.preferences?.map((pref) => pref.id));
    }
    //SHOW TOUR?
    if (stopPreferencesTour == null && stopAllTours == null) {
      setSteps([
        {
          target: '[data-step="1"]',
          title: 'Welcome to the Preferences page!',
          content:
            "This is where you'll set your preferences, this is extremely important for us, as this info is what we'll use to give you appropriate matches.",
        },
      ]);
    }
  }, [userData]);

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;

    if (status === 'finished') {
      localStorage.setItem('stopPreferencesTour', 'true');
    }
    if (status === 'skipped') {
      Swal.fire({
        title: 'Skip tour!',
        text: 'Skip all tours or just this one?',
        icon: 'info',
        confirmButtonText: 'No, just this one',
        showDenyButton: true,
        denyButtonText: 'All',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('stopPreferencesTour', 'true');
        } else if (result.isDenied) {
          localStorage.setItem('stopAllTours', 'true');
        }
      });
    }
    return;
  };

  const userRoles = dataRoles?.User[0]?.roles.map((r: any) => r.name);
  return rolesLoading ? (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
    </Box>
  ) : (
    <Box>
      {(userRoles?.includes('Proposer') || userRoles?.includes('Mentor')) && (
        <Box data-step={'1'}>
          {/* <Joyride
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
          /> */}
          <PreferencesOptions
            sx={{ marginBottom: '30px' }}
            checked={checkedProposer}
            setChecked={setCheckedProposer}
            options={data?.UserPreference || []}
          />
        </Box>
      )}
      {userRoles?.includes('Collaborator') && <CollaboratorOptions />}
    </Box>
  );
}

export default Preferences;

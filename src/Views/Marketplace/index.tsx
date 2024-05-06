import { useState, SyntheticEvent, useEffect } from 'react';
import MarketplaceContainer from 'Components/MarketplaceContainer';
import CenteredTabs from 'Components/Tabs';
import Proposals from './Proposals';
import Tasks from './Tasks';
import SearchEngine from './SearchEngine';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useQuery } from '@apollo/client';
import { GET_USER_PREFERENCES } from 'Queries';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Box } from '@mui/material';
// const [role, setRole] = useState<roles[]>([
//
//]
//
//)

export default function Marketplace() {
  const { marketplaceTab } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { username } = useNetworkAuth();
  useEffect(() => {
    if (marketplaceTab === 'proposals') {
      setValue(0);
    } else if (marketplaceTab === 'tasks') {
      setValue(1);
    } else if (marketplaceTab === 'search') {
      setValue(2);
    }
  }, []);

  const { data: UserRole } = useQuery(GET_USER_PREFERENCES, {
    variables: { username },
  });

  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (UserRole) {
      setUserRoles(UserRole?.User[0]?.roles?.map((role: any) => role?.name) || []);
    }
  }, [UserRole]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/marketplace/${newValue === 0 ? 'proposals' : newValue === 1 ? 'tasks' : 'search'}`);
  };

  //VER COMO  HACER PARA VER TASKS SOLO SI SOY PROPOSER O MENTOR
  const taskView = userRoles?.includes('Proposer' || 'Collaborator');

  const tabs = [
    { label: 'Proposals', ariaAttribute: 0 },
    { label: 'Tasks', ariaAttribute: 1 },
    { label: 'Find your Match', ariaAttribute: 2 },
  ];

  // JOYRIDE
  const steps = [
    {
      target: '.proposals-container',
      content: `Inside Marketplace you will find your proposals, our search engine \"Find your match\" and the feedback tab, 
          there you'll find both, received and given feedback within the community.`,
    },
  ];

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;

    if (status === 'finished') {
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
        } else if (result.isDenied) {
        }
      });
    }
    return;
  };

  return (
    <MarketplaceContainer>
      <Box>
        {/* <Joyride
          steps={steps}
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
      </Box>
      <CenteredTabs tabs={tabs} handleChange={handleChange} tabValue={value} />
      {value == 0 && <Proposals />}
      {value == 1 && <Tasks />}
      {value == 2 && <SearchEngine />}
    </MarketplaceContainer>
  );
}

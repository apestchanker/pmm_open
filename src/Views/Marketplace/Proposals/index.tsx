import React, { useState, useEffect, useCallback } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import Card from 'Components/ProposalCard';
import Grid from '@mui/material/Grid';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import ToggleButton, { Choice } from 'Components/ToggleButton';
// import Search from 'Components/Search';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DropDown from 'Components/DropDown';
import { Contract, Proposal, Step } from 'Types';
import AddProposalButton from 'Components/AddProposalButton';
import AddProposalForm from 'Components/AddProposalForm';
import Cards from 'Components/Cards';
import { GET_MENTORING_PROPOSALS, GET_USER_ROLES } from 'Queries';
import Style from './Proposals.module.css';
import Swal from 'sweetalert2';
// import { DragDropContext } from 'react-beautiful-dnd';
// import DragAndDrop from 'Components/DragAndDrop';

const GetUserProposals = gql`
  query ($username: String, $type: String) {
    Proposal(filter: { proposedBy: { username: $username }, AND: { status: { type: $type } } }) {
      id
      title
      detailedPlan
      inChallenge {
        title
      }
      proposedBy {
        username
      }
      status {
        id
        type
      }
      fundingStatus {
        id
        value
        name
      }
      relatedContracts(filter: { status: "ACCEPTED" }) {
        id
        mentor {
          id
        }
      }
    }
  }
`;

const activeChoices: Choice[] = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const Proposals = () => {
  const { username } = useNetworkAuth();
  const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [componentToShow, setComponentToShow] = useState<string>('Proposals');
  const [status, setStatus] = useState('Active');
  const [fetchProposals, { data }] = useLazyQuery(GetUserProposals, { pollInterval: 2000, fetchPolicy: 'network-only' });
  const [fetchContracts, { data: dataC }] = useLazyQuery(GET_MENTORING_PROPOSALS, {
    fetchPolicy: 'network-only',
    pollInterval: 2000,
  });
  const [listOfProposals, setListOfProposals] = useState<any[][]>([[], [], [], [], []]);
  const [listOfMentoringProposals, setListOfMentoringProposals] = useState<any[][]>([[], [], [], [], []]);
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const [activeSelected, setActiveSelected] = useState(0);
  const [selectedProposalType, setSelectedProposalType] = useState('all');

  //TOUR VARIABLES
  const stopProposalsTour = localStorage.getItem('stopProposalsTour');
  const stopAllTours = localStorage.getItem('stopAllTours');

  const [steps, setSteps] = useState<Step[]>([]);

  const handleToggle = useCallback(
    (choice: Choice) => {
      setStatus(choice.value);
      setActiveSelected(activeChoices.indexOf(choice));
      fetchProposals({ variables: { username: username, type: status } });
    },
    [fetchProposals, username],
  );

  const getMentoringProposals = useCallback(() => {
    if (status) {
      fetchContracts({ variables: { username: username, type: status } });
    }
  }, [status, fetchContracts, username]);

  useEffect(() => {
    if (status) {
      getMentoringProposals();
      fetchProposals({ variables: { username: username, type: status } });
    }
  }, [status, username, fetchProposals]);

  useEffect(() => {
    //SHOW TOUR?
    if (stopProposalsTour == null && stopAllTours == null) {
      setSteps([
        {
          target: '.proposals-container',
          content: `Inside Marketplace you will find your proposals and our search engine \"Find your match\".`,
        },
      ]);
    }
  }, []);

  const handleDropdownSelect = useCallback(
    (e: SelectChangeEvent) => {
      if (e.target.value === 'mentor') {
        getMentoringProposals();
        setSelectedProposalType('mentor');
      } else if (e.target.value === 'all') {
        getMentoringProposals();
        fetchProposals({ variables: { username: username, type: status } });
        setSelectedProposalType('all');
      } else {
        fetchProposals({ variables: { username: username, type: status } });
        setSelectedProposalType('proposer');
      }
    },
    [getMentoringProposals, username, status],
  );

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;

    if (status === 'finished') {
      localStorage.setItem('stopProposalsTour', 'true');
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
          localStorage.setItem('stopProposalsTour', 'true');
        } else if (result.isDenied) {
          localStorage.setItem('stopAllTours', 'true');
        }
      });
    }
    return;
  };

  //const [searchValue, setSearchValue] = useState('');

  // const handleSearchUpdate = useCallback((text: string) => {
  //  setSearchValue(text);
  // }, []);

  useEffect(() => {
    const Proposals: Proposal[][] = [[], [], [], [], []];
    (data?.Proposal || []).forEach((proposal: Proposal) => {
      Proposals[proposal?.fundingStatus?.value].push(proposal);
    });
    setListOfProposals(Proposals);
  }, [data]);

  useEffect(() => {
    const contracts = dataC?.contracts as Contract[];
    const proposals = (contracts || []).map((c) => c.relatedProposal) as Proposal[];
    const Proposals: Proposal[][] = [[], [], [], [], []];
    proposals.forEach((proposal) => Proposals[proposal?.fundingStatus?.value].push(proposal));
    setListOfMentoringProposals(Proposals);
  }, [dataC]);
  const borderBottom = ['3px solid #808080', '3px solid #FFC700', '3px solid #BDFF00', '3px solid #38D059', '3px solid #1BC3DA'];
  const [userRoles, setUserRoles] = useState<string[]>([]);
  useEffect(() => {
    if (!labelsLoading) {
      setUserRoles(userLabelsData?.User[0]?.roles?.map((role: any) => role?.name) || []);
    }
  }, [labelsLoading]);
  const isProposer = userRoles?.includes('Proposer');
  useEffect(() => {
    const cards: JSX.Element[] = [];
    const proposalStatusTypes: string[] = ['Draft', 'Looking For Mentor', 'Mentor Assigned', 'Presented', 'Funded'];
    for (let i = 0; i < 5; i++) {
      const cardsSection: JSX.Element[] = [];
      if (selectedProposalType === 'all' || selectedProposalType === 'proposer') {
        for (let j = 0; j < listOfProposals[i].length; j++) {
          const proposal1 = listOfProposals[i][j];
          const key1 = `${i}-all-proposals-proposed`;

          cardsSection.push(
            <Box key={key1} width="90%" margin="0 auto" sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Card
                proposedBy={proposal1?.proposedBy}
                title={proposal1?.title || 'No Title'}
                status={proposal1?.status?.type || 'No Status'}
                challenge={proposal1?.inChallenge?.title || 'No Challenge'}
                mentors={proposal1?.relatedContracts?.length || 0}
                fundingStatus={proposal1?.fundingStatus?.value || 0}
                fstatus={proposal1?.fundingStatus?.id}
                detailedPlan={proposal1?.detailedPlan || 'No Detailed Plan'}
                id={proposal1?.id || 'No ID'}
              />
            </Box>,
          );
          if (!proposalStatusTypes[i]) {
            proposalStatusTypes[i] = proposal1?.fundingStatus?.name;
          }
        }
      }
      if (selectedProposalType === 'all' || selectedProposalType === 'mentor') {
        for (let j = 0; j < listOfMentoringProposals[i].length; j++) {
          const proposal2 = listOfMentoringProposals[i][j];
          const key2 = `${i}-all-proposals-mentoring`;
          cardsSection.push(
            <Box key={key2} width="90%" margin="0 auto">
              <Card
                proposedBy={proposal2.proposedBy}
                title={proposal2.title || 'No Title'}
                status={proposal2.status.type || 'No Status'}
                challenge={proposal2.inChallenge.title || 'No Challenge'}
                mentors={proposal2?.relatedContracts?.length || 0}
                fundingStatus={proposal2?.fundingStatus?.value || 0}
                fstatus={proposal2?.fundingStatus?.id}
                detailedPlan={proposal2.detailedPlan || 'No Detailed Plan'}
                id={proposal2.id || 'No ID'}
              />
            </Box>,
          );
          if (!proposalStatusTypes[i]) {
            proposalStatusTypes[i] = proposal2?.fundingStatus?.name;
          }
        }
      }
      cards.push(
        <Grid
          item
          className={Style.proposalsSectionsContainer}
          sx={{
            marginTop: '40px',
            marginBottom: '50px',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '60vh',
            minWidth: { xs: '100%', md: '50%', lg: '20%' },
          }}
          xs={12}
          sm={6}
          md={6}
          lg={1}
        >
          <Typography
            variant="h5"
            sx={{
              marginRight: { sm: 0, xl: 4 },
              marginLeft: { sm: 0, xl: 4 },
              fontSize: '12px',
              textAlign: 'center',
              borderBottom: borderBottom[i],
              width: { sm: '80%', md: '75%', lg: '60%' },
            }}
          >
            {proposalStatusTypes[i]}
          </Typography>
          <Box
            className={Style.proposalsSection}
            sx={{
              borderRight: i < 4 ? '2px solid #e5e5e5' : '',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {cardsSection}
          </Box>
        </Grid>,
      );
    }
    setCards(cards);
  }, [selectedProposalType, listOfMentoringProposals, listOfProposals]);

  if (componentToShow === 'AddProposalForm') {
    return <AddProposalForm setComponentToShow={setComponentToShow} />;
  } else {
    return (
      <Box className={'proposals-container'} sx={{ width: '90%', margin: 'auto', paddingBottom: 0, mt: 5 }}>
        {/* <Joyride
          steps={steps}
          floaterProps={{
            placement: 'top',
            disableFlip: true,
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: { xs: '10px', md: '0px' } }}>
            {isProposer && <AddProposalButton setComponentToShow={setComponentToShow} />}
            <Box sx={{ marginLeft: '50px' }}>
              <ToggleButton onToggle={handleToggle} choices={activeChoices} selected={activeSelected} />
              {/* <Typography sx={{ fontSize: '14px', mt: 2 }}>Drag and drop to change status</Typography> */}
            </Box>
          </Box>
          {isProposer && (
            <Box
              sx={{
                height: 'max-content',
              }}
            >
              <DropDown
                handleChange={handleDropdownSelect}
                selected={selectedProposalType}
                options={[
                  { value: 'all', display: 'All proposals' },
                  { value: 'mentor', display: 'As a mentor' },
                  { value: 'proposer', display: 'As a mentee' },
                ]}
              />
            </Box>
          )}
        </Box>

        <Cards>{cards}</Cards>
      </Box>
    );
  }
};

export default Proposals;

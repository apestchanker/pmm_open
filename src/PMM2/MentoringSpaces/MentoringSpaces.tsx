import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import mediaCheck from 'PMM2/utils/mediaCheck';
import React, { useEffect, useState } from 'react';
import { GET_USER_PROPOSALS } from 'Queries/PMM2/mentoringQueries';
import { useQuery } from '@apollo/client';
import { Contract, Proposal } from 'Types';
import FundClock from 'PMM2/Both/FundClock';
import { useNavigate } from 'react-router';
import KanbanBoard from './KanbanBoard';
import { CardData, LaneData } from 'react-trello';
import { useUpdateProposal } from 'Hooks/updateProposals';
interface MentoringSpacesI {
  roles: string[];
  userId: string | null | undefined;
}

const MentoringSpaces = ({ roles, userId }: MentoringSpacesI) => {
  const {
    data: getProposals,
    loading: getProposalsLoading,
    refetch,
  } = useQuery(GET_USER_PROPOSALS, {
    variables: {
      id: userId,
    },
  });
  //console.log(roles, 'ROLES Array');
  // SET profileType: Mentor or Proposer according to the role array
  const [selectValues, setSelectValues] = React.useState({
    profileType: 'Mentor',
  });
  const setProfileType = () => {
    if (roles.length === 1 && roles[0] === 'Proposer') {
      setSelectValues({ profileType: 'Proposer' });
    } else if (roles.includes('Mentor')) {
      setSelectValues({ profileType: 'Mentor' });
    }
  };

  useEffect(() => {
    setProfileType();
  }, [roles]);
  //console.log(selectValues, 'Select Values');

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectValues({ ...selectValues, [event.target.name]: event.target.value });
    //console.log(selectValues, 'Select Values event');
  };
  //////// If switch is changed - Change ProfileType.
  //////// END OF SET Profile Type

  const handleRedirect = (id: string) => {
    navigate(`/mentoring/path/${id}`);
  };

  // const { data: fundingStatusesData, loading: fundingStatusesLoading } = useQuery(GET_FUNDING_STATUS_LIST);
  // const [fundingStatuses, setFundingstatus] = useState<FundingStatus[]>([]);
  // useEffect(() => {
  //   if (!fundingStatusesLoading && fundingStatusesData !== undefined) {
  //     const newFundingStatuses = fundingStatusesData.FundingStatus.map((funding: FundingStatus) => funding);
  //     setFundingstatus(newFundingStatuses);
  //     console.log(newFundingStatuses, 'New funding status');
  //   }
  //   console.log(fundingStatusesData, 'Funding Status:');
  // }, [fundingStatusesData, fundingStatusesLoading]);

  // const getProposalStatusId = (props: Proposal[], index: number, targetL: string) => {
  //   return props.map((proposal: Proposal, i) => {
  //     if (i === index) {
  //       return {
  //         ...proposal,
  //         fundingStatus: {
  //           ...proposal.fundingStatus,
  //           name: targetL,
  //         },
  //       };
  //     }
  //     return proposal.fundingStatus.id;
  //   });
  // };

  const { updateFundingStatus, error } = useUpdateProposal();

  const sendProposaltUpdate = async (propId: string, statusId: string) => {
    const result = await updateFundingStatus({ propId, statusId });
    if (result) {
      console.log(result, 'proposal Satus update OK');
    } else {
      console.log(error, 'proposal Status update NOT OK');
    }
    //console.log(propId, statusId, 'Entro al SendProposalUpdate');
  };

  const [proposals, setProposals] = useState<any[]>([]);

  const handleMoved = (cardId: string, sourceLane: string, targetLane: string) => {
    const index = proposals.findIndex((prop: Proposal) => prop.id === cardId);
    if (index !== -1) {
      sendProposaltUpdate(cardId, targetLane);
      const index2 = columns.findIndex((columna) => columna.id == targetLane);
      const updatedCards = cards;
      updatedCards[index].status = columns[index2].title;
      setCards(updatedCards);
      //console.log(targetLane, 'Update proposal with statusId');
    }
    //console.log(index, cardId, 'Updated Status Proposal');
  };

  useEffect(() => {
    //console.log('Main UseEffect de MentoringSpace antes de GetProposals');
    if (!getProposalsLoading && getProposals !== undefined) {
      if (selectValues.profileType === 'Mentor') {
        const contracts = getProposals.User[0].contractedBy.map((contracts: Contract[]) => contracts);
        const proposals = contracts.map((prop: Contract) => prop.relatedProposal);
        for (let i = 0; i < proposals.length; i++) {
          const objectCopy = JSON.parse(JSON.stringify(proposals[i]));
          objectCopy.contractId = contracts[i].id;
          proposals[i] = Object.preventExtensions(objectCopy);
        }
        //console.log(proposals, 'Proposals como mentor');
        setProposals(proposals);
      } else if (selectValues.profileType === 'Proposer') {
        setProposals(getProposals.User[0]?.proposals);
        //console.log(proposals, 'Proposals como Proposer');
      }
    }
    //console.log('Post GetProposals');
  }, [selectValues.profileType, getProposalsLoading, refetch, getProposals]);

  //console.log(proposals, 'prop');

  //console.log(getProposals, 'getProposals');
  const navigate = useNavigate();

  const [cards, setCards] = useState<CardData[]>([]);

  const cardStyle = {
    border: true ? '2px solid orange' : undefined,
  };

  useEffect(() => {
    //console.log(proposals, 'entro al use effect');
    setCards(
      proposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.proposedBy.username,
        description: proposal.title,
        status: proposal.fundingStatus.name,
        draggable: proposal.fundingStatus.name === 'First Step' ? false : true,
        isModified: true,
        style: cardStyle,
      })),
    );
  }, [proposals]);

  //console.log(cards, 'CARDS');

  const columns: LaneData[] = [
    {
      id: 'funding-status-005',
      title: 'First Step',
    },
    {
      id: 'funding-status-006',
      title: 'Challenge Selection',
    },
    {
      id: 'funding-status-007',
      title: 'Proposal Draft',
    },
    {
      id: 'funding-status-008',
      title: 'Final Proposal',
    },
    {
      id: 'funding-status-004',
      title: 'Funded',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          padding: '45px 70px',
          width: '100%',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className="title" mb={'64px'}>
              <Typography
                component={'h1'}
                fontFamily="Roboto"
                fontWeight={800}
                fontSize={mediaCheck('xs', 'only') ? '22px' : '36px'}
                lineHeight={'42.19px'}
                color={'#263560'}
              >
                MENTORING SPACES
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FundClock fundnumber={10} />
          </Grid>
          <Grid item xs={12} md={4}>
            {roles?.length >= 2 && (
              <FormControl sx={{ minWidth: '200px' }} size="small">
                <InputLabel id="sarasa">View as</InputLabel>
                <Select
                  labelId="sarasa"
                  name="profileType"
                  value={selectValues?.profileType}
                  onChange={handleSelectChange}
                  label="View as"
                  color={'secondary'}
                >
                  {roles?.map((role, index) => {
                    return (
                      <MenuItem key={`${role}-${index}`} value={role}>
                        {role}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
        <Box sx={{ marginTop: '30px', width: '100%' }}>
          <div>
            <KanbanBoard columns={columns} cards={cards} onCardClick={handleRedirect} handleCardMove={handleMoved} />;
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default MentoringSpaces;

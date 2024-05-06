import { useLazyQuery } from '@apollo/client';
import { Avatar, Box, Button, FormControlLabel, Link, Switch, Typography } from '@mui/material';
import LoadingCircle from 'PMM2/utils/LoadingCircle';
import { GET_PROPOSAL_INFO } from 'Queries/PMM2/mentoringQueries';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Proposal } from 'Types';
import ProposerAgreement from '../Proposer/Agreement';
import MentorAgreement from '../Mentor/Agreement';
import BudgedEstimator from './BudgetEstimator';
import ChallengeSelection from './ChallengeSelection';
import FundClock from './FundClock';
import MandatoryReading from './MandatoryReading';
import ProposalDraftAuditability from './ProposalDraftAuditability';
import ProposalDraftGeneral from './ProposalDraftGeneral';

interface MentoringPathI {
  userId: string | null | undefined;
}

const MentoringPath = ({ userId }: MentoringPathI) => {
  const { id } = useParams();
  const [getProposalInfo, { loading: proposalInfoLoading, data: proposalInfoData }] = useLazyQuery(GET_PROPOSAL_INFO); //, {
  //  pollInterval: 2000,
  //});

  const [proposalInfoState, setProposalInfoState] = useState<Proposal | undefined>();

  useEffect(() => {
    getProposalInfo({
      variables: {
        id: id,
      },
    }).then((data) => {
      console.log(data.data, 'data received at getPRoposalInfo');
      setProposalInfoState(data.data.Proposal[0]);
    });
  }, [id, proposalInfoData]);
  //FundClock tiene HARDCODED el Fundnumber!!
  console.log(id, userId, 'id y usrId de MentoringPath');

  return proposalInfoLoading || proposalInfoState === undefined ? (
    <LoadingCircle />
  ) : (
    <Box
      sx={{
        padding: '58px 36px',
      }}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
        <Link
          href="/mentoring"
          sx={{
            fontFamily: 'Roboto',
            fontSize: '20px',
            lineHeight: '23.44px',
            fontWeight: 400,
          }}
          color="secondary"
        >
          Return
        </Link>
        <FormControlLabel control={<Switch defaultChecked color="secondary" />} label="Mentor guided" />
      </Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'} mb={'46px'}>
        <Box display={'flex'} alignItems={'center'}>
          <Avatar
            sx={{
              width: '62px',
              height: '62px',
            }}
            src={proposalInfoState.proposedBy.picurl}
          ></Avatar>
          <Typography ml="21px" fontFamily={'Roboto'} fontSize={'20px'} lineHeight={'23.44px'} fontWeight={700} color="secondary">
            {`${proposalInfoState.proposedBy.username}’s Mentoring Path`}
          </Typography>
        </Box>
        <FundClock fundnumber={10} />
      </Box>
      <Box className="first-steps">
        <Typography
          fontFamily={'Roboto'}
          fontSize={'20px'}
          lineHeight={'23.44px'}
          fontWeight={700}
          sx={{
            mb: '27px',
          }}
        >
          First steps
        </Typography>
        {userId === proposalInfoState.proposedBy.id ? (
          <ProposerAgreement proposal={proposalInfoState} />
        ) : (
          <MentorAgreement proposal={proposalInfoState} />
        )}

        <MandatoryReading />
      </Box>
      <Box className="challenge-selection">
        <Typography
          fontFamily={'Roboto'}
          fontSize={'20px'}
          lineHeight={'23.44px'}
          fontWeight={700}
          sx={{
            mb: '27px',
          }}
        >
          Challenge Selection
        </Typography>
        <ChallengeSelection />
        <BudgedEstimator />
      </Box>
      <Box className="proposal-draft-general">
        <Typography
          fontFamily={'Roboto'}
          fontSize={'20px'}
          lineHeight={'23.44px'}
          fontWeight={400}
          sx={{
            mb: '27px',
          }}
        >
          Proposal’s draft - General
        </Typography>
        <ProposalDraftGeneral />
      </Box>
      <Box className="proposal-draft-auditability">
        <Typography
          fontFamily={'Roboto'}
          fontSize={'20px'}
          lineHeight={'23.44px'}
          fontWeight={400}
          sx={{
            mb: '27px',
          }}
        >
          Proposal’s draft - Auditability
        </Typography>
        <ProposalDraftAuditability />
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FF5C00',
            height: '59px',
            width: '180px',
            minWidth: '175px',
            // display: 'none',
          }}
        >
          next step
        </Button>
      </Box>
    </Box>
  );
};

export default MentoringPath;

import { useQuery } from '@apollo/client';
import { Grid, Skeleton, Typography } from '@mui/material';
import ProposalCardComponent from 'Components/ProposalCard';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_RECOMMENDED_PROPOSALS } from 'Queries';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export const Proposals = ({ tab, user, searched, setIdArraysProposals, filteredProposals, loadingFilteredProposals }: any) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_PROPOSALS, {
    variables: {
      username: user,
    },
  });
  const { username } = useNetworkAuth();
  const [proposals, setProposals] = React.useState([]);
  useEffect(() => {
    if (filteredProposals?.Proposal?.length > 0) {
      setProposals(filteredProposals?.Proposal);
      return;
    }
    if (searched.length > 0) {
      setProposals(searched);
      setIdArraysProposals(searched.map((proposal: any) => proposal.id));
      return;
    }
    if (data !== undefined && searched.length === 0) {
      setProposals(data?.User[0]?.proposalsWithSimilarInterests);
      setIdArraysProposals(data?.User[0]?.proposalsWithSimilarInterests?.map((proposal: any) => proposal?.id));
    }
  }, [data, loading, tab, searched, filteredProposals, loadingFilteredProposals]);
  useEffect(() => {
    if (filteredProposals?.Proposal?.length === 0) {
      Swal.fire({
        title: 'Filter does not match any proposal',
        text: 'Please try again',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
  }, [filteredProposals]);
  return (
    <div>
      {tab === 'Proposals' &&
        (loading ? (
          <Grid container justifyContent="center">
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={250} width={225} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={250} width={225} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={250} width={225} />
            </Grid>
          </Grid>
        ) : proposals?.length > 0 ? (
          <Grid container>
            {proposals?.map((proposal: any) => {
              if (proposal?.status?.type === 'Active' && proposal?.proposedBy?.username != username) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={`${proposal.id}-grid`}>
                    <ProposalCardComponent
                      key={proposal?.id}
                      title={proposal?.title || 'No title'}
                      status={proposal?.status?.type}
                      challenge={proposal?.inChallenge?.title}
                      mentors={proposal?.relatedContracts?.length || 0}
                      fundingStatus={proposal?.fundingStatus?.value}
                      fstatus={proposal?.fundingStatus?.id}
                      detailedPlan={proposal?.detailedPlan}
                      id={proposal?.id}
                      proposedBy={proposal?.proposedBy}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        ) : (
          <Typography>No proposals found</Typography>
        ))}
    </div>
  );
};

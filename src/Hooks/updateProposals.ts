import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PROPOSAL_FUNDING_STATUS } from 'Queries';

export const useUpdateProposal = () => {
  const [updateProposalFundingStatus, { error }] = useMutation(UPDATE_PROPOSAL_FUNDING_STATUS);

  const updateFundingStatus = useCallback(
    async ({ propId, statusId }: { propId: string; statusId: string }): Promise<boolean> => {
      try {
        await updateProposalFundingStatus({
          variables: {
            proposalId: propId,
            fundingStatusId: statusId,
          },
        });
        return true;
      } catch (err) {
        console.error('Error updating data:', err);
        //throw err;
        return false;
      }
    },
    [updateProposalFundingStatus],
  );

  return { updateFundingStatus, error };
};

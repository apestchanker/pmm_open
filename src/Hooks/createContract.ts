// src/hooks/useCreateContract.ts

import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { CREATE_CONTRACT } from 'Queries';

export const useCreateContract = () => {
  const [createContractMutation] = useMutation(CREATE_CONTRACT);

  const createContract = useCallback(
    async ({ proposalId, mentorId, proposedBy }: { proposalId: string; mentorId: string; proposedBy: string }): Promise<boolean> => {
      try {
        const contractId = uuidv4();
        const id = proposalId;
        const date = moment();
        await createContractMutation({
          variables: {
            data: {
              id: contractId,
              terms: 'PENDING',
              status: 'PENDING',
              isMentorApprover: false,
              date: { formatted: date },
            },
            proposalId: id,
            mentorId: mentorId,
            proposerId: proposedBy,
            contractId: contractId,
          },
        });
        return true;
      } catch (err) {
        console.error(err);
        console.log('Error creating contract');
        return false;
      }
    },
    [createContractMutation],
  );

  return { createContract };
};

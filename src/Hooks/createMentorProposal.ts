// src/hooks/createMentorProposal.ts

import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { ADD_MENTOR_PROPOSAL, CREATE_NOTIFICATION, CONNECT_NOTIFICATION_TO_USER } from 'Queries';

export const useMentorProposal = () => {
  const [addMentorProposal] = useMutation(ADD_MENTOR_PROPOSAL);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);

  const addProposal = useCallback(
    async ({ id, userId, mentorId, username }: { id: string; userId: string; mentorId:string; username: string }): Promise<boolean> => {
      try {
        const date = moment();
        const title = 'DRAFT-' + username;
        console.log(title, 'Title');
        console.log(id, 'ID');
        console.log(userId, 'UserId');
        await addMentorProposal({
          variables: {
            id: id,
            title: title,
            userId: userId,
          },
        });
        //Notify Mentor
        const uniqueId = uuidv4();
        await createNotification({
          variables: {
            id: uniqueId,
            message: `${username} sent you a request.`,
            date: { formatted: date },
            link: `/projects`,
          },
        });
        await connectNotification({
          variables: {
            userID: mentorId,
            notificationID: uniqueId,
          },
        });
        //Notify User
        const uniqueId2 = uuidv4();
        await createNotification({
          variables: {
            id: uniqueId2,
            message: `You have sent your mentor a request.`,
            date: { formatted: date },
            link: `/projects`,
          },
        });
        await connectNotification({
          variables: {
            userID: userId,
            notificationID: uniqueId2,
          },
        });
        return true;
      } catch (err) {
        console.error(err);
        console.log('Error creating proposal');
        return false;
      }
    },
    [addMentorProposal, createNotification, connectNotification],
  );

  return { addProposal };
};

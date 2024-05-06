import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { default as MuiAvatar } from '@mui/material/Avatar';
import defaultAvatar from 'Assets/default-avatar.png';
import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER_ABOUT } from 'Queries';
import { DateTime } from 'luxon';

interface propsReceived {
  date: string;
  sentBy: string;
  score: number;
  feedback: string;
}

const Avatar = styled(MuiAvatar)`
  width: 40px;
  height: 40px;
`;

const TitleContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Card = styled(MuiCard)`
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

const FeedbackCardComponent = ({ sentBy, score, feedback, date }: propsReceived) => {
  // eslint-disable-next-line prettier/prettier
  const username = sentBy;
  const { data: userData } = useQuery(GET_USER_ABOUT, {
    variables: { username: username },
  });

  const userToShow = userData?.User[0]?.username;
  const picture = userData?.User[0]?.picurl;

  return (
    <Card sx={{ maxWidth: '230px', height: '150px', margin: { xs: '10px auto', md: '10px 0px' } }}>
      <CardContent sx={{ padding: '14px' }}>
        <TitleContainer>
          <Avatar src={picture} />
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '16px' }}>
            <Typography
              sx={{
                lineHeight: '18px',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {userToShow}
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>{DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT)}</Typography>
            <Typography sx={{ fontSize: '14px' }}>
              <Rating value={score} readOnly />
            </Typography>
          </Box>
          {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', marginTop: '0px' }}>
            <ShareIcon sx={{ width: '25px', height: '25px', marginRight: '25px', color: 'rgba(0, 0, 0, 0.6)' }} />
            <CancelIcon sx={{ width: '25px', height: '25px', color: 'rgba(0, 0, 0, 0.6)' }} />
          </Box> */}
        </TitleContainer>
        <Typography variant="body2" sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)', padding: '5px', height: '80px' }}>
          {feedback}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeedbackCardComponent;

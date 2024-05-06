import { Typography, Box } from '@mui/material';
import './ReceivedMessage.css';

interface Props {
  text: string;
}

function ReceivedMessage({ text }: Props) {
  return (
    <Box className="talk-bubble-received tri-right left-top">
      <Box className="talktext">
        <Typography sx={{ fontSize: '14px', lineHeight: '16px', p: 1, overflowWrap: 'break-word', color: '#000' }}>{text}</Typography>
      </Box>
    </Box>
  );
}

export default ReceivedMessage;

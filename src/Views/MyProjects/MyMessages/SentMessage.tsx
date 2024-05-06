import { Typography, Box } from '@mui/material';
import './SentMessage.css';

interface Props {
  text: string;
}

function SentMessage({ text }: Props) {
  return (
    <Box className="talk-bubble tri-right right-top">
      <Box className="talktext">
        <Typography sx={{ fontSize: '14px', lineHeight: '16px', p: 1, overflowWrap: 'break-word', color: '#ffffff' }}>{text}</Typography>
      </Box>
    </Box>
  );
}

export default SentMessage;

import { Card, CardActions, CardContent, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface ProposalCardProps {
  text: string;
  title: string;
  id: string;
}

function ProposalsCard({ text, title, id }: ProposalCardProps) {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', background: '#e5e5e5' }}>
      <CardContent sx={{ maxWidth: '70%' }}>
        <Tooltip title={title} placement="top-end">
          <Typography sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="subtitle1">
            {title}
          </Typography>
        </Tooltip>
        <Typography sx={{ fontSize: '14px' }}>{text}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/proposals/details/${id}`} style={{ color: 'var(--primaryBlue)', fontFamily: 'roboto' }}>
          SEE +
        </Link>
      </CardActions>
    </Card>
  );
}

export default ProposalsCard;

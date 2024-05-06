import { Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface ProposerCardProps {
  bio: string;
  username: string;
  id: string;
}

function ProposalsCard({ bio, username, id }: ProposerCardProps) {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', background: '#e5e5e5' }}>
      <CardContent>
        <Typography variant="subtitle1">{username}</Typography>
        <Typography sx={{ fontSize: '14px' }}>{bio}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/users/${id}`} style={{ color: 'var(--primaryBlue)', fontFamily: 'roboto' }}>
          SEE +
        </Link>
      </CardActions>
    </Card>
  );
}

export default ProposalsCard;

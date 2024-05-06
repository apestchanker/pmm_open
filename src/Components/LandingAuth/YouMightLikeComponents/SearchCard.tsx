import { Card, CardContent, Typography } from '@mui/material';
import moment from 'moment';

interface SearchCardProps {
  text: string;
  id: string;
  index: number;
  date: any;
}

function SearchCard({ text, id, index, date }: SearchCardProps) {
  return (
    <>
      {index !== 0 && <hr />}
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
          background: 'transparent',
          padding: '2px',
          textAlign: 'left',
          boxShadow: 'none',
          borderRadius: '0',
        }}
      >
        <CardContent sx={{ padding: '5px !important' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>{text}</Typography>
        </CardContent>
        <CardContent sx={{ padding: '5px !important' }}>
          {date !== null && <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>{moment(date).fromNow()}</Typography>}
        </CardContent>
      </Card>
    </>
  );
}

export default SearchCard;

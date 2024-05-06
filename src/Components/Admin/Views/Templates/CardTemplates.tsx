import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';

export default function CardTemplates() {
  return (
    <Card sx={{ minWidth: 275, marginRight: '30px' }}>
      <CardContent sx={{ padding: '14px 14px 0px 14px', position: 'relative', height: '100%' }}>
        <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
          <Typography
            sx={{
              lineHeight: '24px',
              fontSize: '18px',
              fontWeight: 700,
              marginLeft: '5px',
              lineBreak: 'anywhere',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '180px',
            }}
          >
            One line title
          </Typography>
          <ShareIcon sx={{ width: '18px' }} />
        </Box>
        <Typography
          sx={{
            lineHeight: '24px',
            fontSize: '14px',
            fontWeight: 400,
            marginLeft: '5px',
            lineBreak: 'anywhere',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '180px',
          }}
        >
          Category: agreement / proposal
        </Typography>
        <Typography
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
            height: '80px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            lineBreak: 'auto',
            maxHeight: '80px',
            whiteSpace: 'wrap',
            maxWidth: '250px',
            mt: '10px',
          }}
          variant="body2"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: '35px',
            paddingTop: '100px',
          }}
        >
          <Button sx={{ color: 'var(--primaryBlue)', fontSize: '14px', marginRight: '80px' }} size="small">
            SEE +{' '}
          </Button>
          <Button sx={{ color: 'var(--primaryBlue)', fontSize: '14px' }} size="small">
            DELETE{' '}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

function TemplateCard({ description, title, image }: { description: string; title: string; image: string }) {
  const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Donec euismod, nisl eget consectetur euismod, nisl nunc ultrices eros,
    vitae porttitor nisl nunc eget lorem.`;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="subtitle1">{title || 'Template'}</Typography>
        <Typography sx={{ lineHeight: '20px', letterSpacing: '0.25px', fontSize: '14px' }}>{description || loremText}</Typography>
      </Box>
      <Box>{image !== '' ? <img src={image} alt={title} /> : 'Caption'}</Box>
    </Box>
  );
}

export default TemplateCard;

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Paper, Typography, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const MandatoryReading = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints['down']('md'));
  const isXs = useMediaQuery(theme.breakpoints['only']('xs'));
  // const isMd = useMediaQuery(theme.breakpoints['only']('md'));

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const items = [
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: true,
      id: '1',
    },
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: true,
      id: '2',
    },
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: false,
      id: '3',
    },
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: false,
      id: '4',
    },
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: false,
      id: '5',
    },
    {
      title: 'www.Loremipsum.com/ideascale',
      checked: false,
      id: '6',
    },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        mb: '50px',
      }}
    >
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography sx={{ width: '33%', flexShrink: 0 }} fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'18.75px'}>
            Mandatory reading
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={isMobile ? 'none' : '50px 83px 0 83px'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'48px'} flexWrap="wrap">
              <Box display={'flex'} alignItems={'center'} flexWrap="wrap" flexDirection={'column'} width={'100%'}>
                {items.map((item) => {
                  return (
                    <Box key={item.id} display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} mb={'21px'}>
                      <Box
                        sx={{
                          width: '100%',
                          bgcolor: '#D9D9D96B',
                          borderRadius: '15px',
                          p: isXs ? '12px 2px' : '21px 32px',
                        }}
                      >
                        <Typography fontFamily="Roboto" fontWeight={700} fontSize="16px" lineHeight={'18.75px'}>
                          {item.title}
                        </Typography>
                      </Box>
                      <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} color="secondary" checked={item.checked}></Checkbox>
                    </Box>
                  );
                })}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#FF5C00',
                    minWidth: '175px',
                    display: 'none',
                  }}
                >
                  done
                </Button>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default MandatoryReading;

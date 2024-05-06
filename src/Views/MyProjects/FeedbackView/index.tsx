import React from 'react';
import { Typography, Grid, Box, MenuItem, FormControl, Button } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/base/TextareaAutosize';

type CustomTextareaProps = Pick<TextareaAutosizeProps, 'aria-label' | 'minRows' | 'placeholder' | 'style'>;

function FleedbackView(props: CustomTextareaProps) {
  const [funded, setFunded] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setFunded(event.target.value as string);
  };
  return (
    <>
      <ReturnButton />
      <Grid xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
        <Typography variant="h5" sx={{ m: 3 }}>
          FEEDBACK
        </Typography>
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{ ml: 3, width: '50%' }}>User: {'IMPLEMENT'}</Typography>
          <Typography sx={{ ml: 3, width: '50%' }}>Role: {'IMPLEMENT'}</Typography>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{ ml: 3, width: '50%' }}>Star Rating: {'IMPLEMENT'}</Typography>
          <Typography sx={{ ml: 3, width: '50%' }}>
            Funded:
            <Box sx={{ minWidth: 100 }}>
              <FormControl sx={{ minWidth: 100 }}>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={funded} onChange={handleChange}>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Typography>
        </Grid>
        <Typography sx={{ ml: 3 }}>Status: {'IMPLEMENT'}</Typography>
      </Grid>
      <Grid sx={{ textAlign: 'center', p: 4, alignItems: 'center' }}>
        <Typography>Tell us a little bit about your experience with this person:</Typography>
        <FleedbackView
          aria-label="feedbackText"
          minRows={1}
          placeholder="Write your feedback here..."
          style={{ width: '100%', height: '150px', backgroundColor: 'rgba(33, 33, 33, 0.08)', margin: 5, padding: 5 }}
        />
        <Button variant={'contained'} sx={{ width: ' 150px', backgroundColor: '#263560', m: 5 }}>
          SAVE
        </Button>
      </Grid>
    </>
  );
}

export default FleedbackView;

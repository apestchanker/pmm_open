import React, { useState } from 'react';
import { Box, FormControl, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CustomizedSnackbars from 'PMM2/utils/CustomizedSnackbars';

const ProposalDraftAuditability = () => {
  const succesGreen = '#38D059';
  const gray = '#0000008a';

  const [snackOpen, setSnackOpen] = useState(false);

  const [selectValues, setSelectValues] = useState({
    success: '',
  });

  const [inputValues, setInputValues] = useState({
    measure: '',
    information: '',
    sdgRating: '',
  });

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectValues({ ...selectValues, [event.target.name]: event.target.value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <CustomizedSnackbars open={snackOpen} setOpen={setSnackOpen} text={'Link must be valid'} severity={'warning'} />
      <Paper
        className="measure-track"
        elevation={4}
        sx={{
          borderRadius: '32px',
          overflow: 'hidden',
          mb: '50px',
          p: '24px 42px',
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'33px'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Please describe what you will measure to track your project`s progress, and how will you measure these?
            </Typography>
            <Tooltip
              title="The title may show plim plum
plam lorem ipsum dolor sit amet and also lalalala"
            >
              <InfoIcon
                sx={{
                  color: '#0000008a',
                  ml: '10px',
                }}
              />
            </Tooltip>
          </Box>
          <CheckCircleIcon
            sx={{
              fontSize: '34px',
              color: succesGreen,
            }}
          />
        </Box>
        <OutlinedInput
          value={inputValues.measure}
          onChange={handleInputChange}
          name="measure"
          fullWidth
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
          }}
        ></OutlinedInput>
      </Paper>
      <Paper
        className="success"
        elevation={4}
        sx={{
          borderRadius: '32px',
          overflow: 'hidden',
          mb: '50px',
          p: '24px 42px',
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'33px'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              What does success for this project look like?
            </Typography>
            <Tooltip
              title="The title may show plim plum
plam lorem ipsum dolor sit amet and also lalalala"
            >
              <InfoIcon
                sx={{
                  color: '#0000008a',
                  ml: '10px',
                }}
              />
            </Tooltip>
          </Box>
          <CheckCircleIcon
            sx={{
              fontSize: '34px',
              color: succesGreen,
            }}
          />
        </Box>
        <FormControl fullWidth>
          <Select name="success" value={selectValues.success} onChange={handleSelectChange} displayEmpty>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="grow-latin-america">Grow Latin America</MenuItem>
          </Select>
        </FormControl>
        <Box display={'flex'} alignItems={'center'} sx={{ cursor: 'pointer', mt: '30px' }}>
          <u>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Mentor’s suggested link
            </Typography>
          </u>
          <OpenInNewIcon
            sx={{
              color: gray,
            }}
          />
        </Box>
      </Paper>
      <Paper
        className="information"
        elevation={4}
        sx={{
          borderRadius: '32px',
          overflow: 'hidden',
          mb: '50px',
          p: '24px 42px',
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'33px'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Please provide information on whether this proposal is a continuation of a previously funded project in Catalyst or an
              entirely new one.
            </Typography>
            <Tooltip
              title="The title may show plim plum
plam lorem ipsum dolor sit amet and also lalalala"
            >
              <InfoIcon
                sx={{
                  color: '#0000008a',
                  ml: '10px',
                }}
              />
            </Tooltip>
          </Box>
          <CheckCircleIcon
            sx={{
              fontSize: '34px',
              color: gray,
            }}
          />
        </Box>
        <OutlinedInput
          fullWidth
          value={inputValues.information}
          onChange={handleInputChange}
          name="information"
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
            color: inputValues.information.length > 140 ? '#FF5C00' : 'inherit',
          }}
          multiline
          rows={5}
        ></OutlinedInput>
        {inputValues.information.length > 140 ? (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {inputValues.information.length - 140} characters excedeed
          </Typography>
        ) : (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {140 - inputValues.information.length} characters left
          </Typography>
        )}

        <Box display={'flex'} alignItems={'center'} sx={{ cursor: 'pointer', mt: '30px' }}>
          <u>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Mentor’s suggested link
            </Typography>
          </u>
          <OpenInNewIcon
            sx={{
              color: gray,
            }}
          />
        </Box>
      </Paper>
      <Paper
        className="sdgRating"
        elevation={4}
        sx={{
          borderRadius: '32px',
          overflow: 'hidden',
          mb: '50px',
          p: '24px 42px',
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'33px'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Sustainable Development Goals (SDG) Rating
            </Typography>
            <Tooltip
              title="The title may show plim plum
plam lorem ipsum dolor sit amet and also lalalala"
            >
              <InfoIcon
                sx={{
                  color: '#0000008a',
                  ml: '10px',
                }}
              />
            </Tooltip>
          </Box>
          <CheckCircleIcon
            sx={{
              fontSize: '34px',
              color: gray,
            }}
          />
        </Box>
        <OutlinedInput
          fullWidth
          value={inputValues.sdgRating}
          onChange={handleInputChange}
          name="sdgRating"
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
          }}
          multiline
          rows={5}
        ></OutlinedInput>

        <Box display={'flex'} alignItems={'center'} sx={{ cursor: 'pointer', mt: '30px' }}>
          <u>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              Recommended guide for this topic
            </Typography>
          </u>
          <OpenInNewIcon
            sx={{
              color: gray,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProposalDraftAuditability;

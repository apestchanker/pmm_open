import React, { useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CustomizedSnackbars from 'PMM2/utils/CustomizedSnackbars';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const ProposalDraftGeneral = () => {
  const succesGreen = '#38D059';
  const gray = '#0000008a';

  const [snackOpen, setSnackOpen] = useState(false);

  const [selectValues, setSelectValues] = useState({
    challenge: '',
  });

  const [inputValues, setInputValues] = useState({
    title: '',
    problem: '',
    experience: '',
    links: '',
    funds: '',
  });
  const [links, setLinks] = useState<string[]>([]);

  const addLink = () => {
    const arr = [...links];
    if (inputValues.links.length > 4) {
      arr.push(inputValues.links);
      setLinks(arr);
      setInputValues({ ...inputValues, links: '' });
    } else {
      setSnackOpen(true);
    }
  };

  const deleteLink = (index: number) => {
    const arr = [...links];
    arr.splice(index, 1);
    setLinks(arr);
  };

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
        className="proposal-title"
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
              Proposal’s Title
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
          value={inputValues.title}
          onChange={handleInputChange}
          name="title"
          fullWidth
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
          }}
        ></OutlinedInput>
      </Paper>
      <Paper
        className="define-challenge"
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
              Define challenge and problem statement: Instructions 1234 please read the following articles and complete the assignment left
              on Google Drive
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
          <Select name="challenge" value={selectValues.challenge} onChange={handleSelectChange} displayEmpty>
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
        className="summarize-solution"
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
              Summarize your solution to the problem
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
          value={inputValues.problem}
          onChange={handleInputChange}
          name="problem"
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
            color: inputValues.problem.length > 140 ? '#FF5C00' : 'inherit',
          }}
          multiline
          rows={5}
        ></OutlinedInput>
        {inputValues.problem.length > 140 ? (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {inputValues.problem.length - 140} characters excedeed
          </Typography>
        ) : (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {140 - inputValues.problem.length} characters left
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
        className="summarize-experience"
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
              Summarize your relevant experience
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
          value={inputValues.experience}
          onChange={handleInputChange}
          name="experience"
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
            // color: inputValues.problem.length > 140 ? '#FF5C00' : 'inherit',
          }}
          multiline
          rows={5}
        ></OutlinedInput>
        {/* {inputValues.problem.length > 140 ? (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {inputValues.problem.length - 140} characters excedeed
          </Typography>
        ) : (
          <Typography fontFamily={'Roboto'} fontSize={'14px'} fontWeight={400} lineHeight={'16.41px'} mt={'7px'}>
            {140 - inputValues.problem.length} characters left
          </Typography>
        )} */}

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
      <Paper
        className="links"
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
              Website/GitHub link
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
          value={inputValues.links}
          onChange={handleInputChange}
          name="links"
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
            mb: '10px',
          }}
        ></OutlinedInput>
        {links.map((link, index) => {
          return (
            <Box key={`${link}-${index}`} display={'flex'} alignItems={'center'}>
              <OutlinedInput
                fullWidth
                value={link}
                disabled
                sx={{
                  borderRadius: '15px',
                  bgcolor: '#D9D9D96B',
                  mb: '10px',
                }}
              ></OutlinedInput>
              <Tooltip title="Delete link">
                <IconButton onClick={() => deleteLink(index)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} sx={{ cursor: 'pointer', mt: '30px' }}>
          <u>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700} onClick={addLink}>
              + Add link
            </Typography>
          </u>
        </Box>
      </Paper>
      <Paper
        className="attachments"
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
              Media and attachments
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
        <Box display={'flex'} alignItems={'center'}>
          <OutlinedInput
            fullWidth
            // value={inputValues.links}
            // onChange={handleInputChange}
            disabled
            name="links"
            sx={{
              borderRadius: '15px',
              bgcolor: '#D9D9D96B',
              mb: '10px',
            }}
          ></OutlinedInput>
          <Tooltip title="Add attachment">
            <IconButton>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {links.map((link, index) => {
          return (
            <Box key={`${link}-${index}`} display={'flex'} alignItems={'center'}>
              <OutlinedInput
                fullWidth
                value={link}
                disabled
                sx={{
                  borderRadius: '15px',
                  bgcolor: '#D9D9D96B',
                  mb: '10px',
                }}
              ></OutlinedInput>
              <Tooltip title="Delete link">
                <IconButton onClick={() => deleteLink(index)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} sx={{ cursor: 'pointer', mt: '30px' }}>
          <u>
            <Typography fontFamily={'Roboto'} fontSize={'16px'} fontWeight={700}>
              + Add attachment
            </Typography>
          </u>
        </Box>
      </Paper>
      <Paper
        className="requested-funds"
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
              Requested funds in USD
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
          value={inputValues.funds}
          onChange={handleInputChange}
          name="funds"
          fullWidth
          sx={{
            borderRadius: '15px',
            bgcolor: '#D9D9D96B',
          }}
        ></OutlinedInput>
      </Paper>
    </Box>
  );
};

export default ProposalDraftGeneral;

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Proposal } from 'Types';
import moment from 'moment';
import { ACCEPT_AGREEMENT } from 'Queries/PMM2/mentoringQueries';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import CancelIcon from '@mui/icons-material/Dangerous';
import { DateTime } from 'luxon';

interface AgreementI {
  proposal: Proposal;
}

const Agreement = ({ proposal }: AgreementI) => {
  const [sendAgreementMutation] = useMutation(ACCEPT_AGREEMENT);
  interface MyDateTime extends DateTime {
    formatted: string;
  }

  const mentorSignedDate = proposal.relatedContracts[0].dateMentorSigned as MyDateTime;
  const proposerSignedDate = proposal.relatedContracts[0].dateProposerSigned as MyDateTime;

  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  console.log(proposal, 'Proposal at Proposer Agreement Begins');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints['down']('md'));
  const isXs = useMediaQuery(theme.breakpoints['only']('xs'));
  const isMd = useMediaQuery(theme.breakpoints['only']('md'));

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [selectValues, setSelectValues] = React.useState({
    payment: proposal.relatedContracts[0].paymentType,
  });

  // const handleSelectChange = (event: SelectChangeEvent) => {
  //   setSelectValues({ ...selectValues, [event.target.name]: event.target.value });
  // };

  interface InputValuesI {
    paymentAmount: string;
    responsibilities: string;
  }

  const [inputValues, setInputValues] = useState<InputValuesI>({
    responsibilities: proposal.relatedContracts[0].terms,
    paymentAmount: proposal.relatedContracts[0]?.paymentAmount?.toString() || '',
  });

  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (proposal.relatedContracts[0]?.status === 'Signed') {
      setAccepted(true);
    } else if (proposal.relatedContracts[0]?.status === 'Rejected') {
      setRejected(true);
    }
  }, [proposal.relatedContracts]);

  const acceptAgreement = async () => {
    await sendAgreementMutation({
      variables: {
        status: 'Signed',
        contractId: proposal.relatedContracts[0].id,
        date: moment(),
        dateProposerSigned: moment(),
      },
    }).finally(() => {
      Swal.fire({
        title: 'The agreement was completed and sent to Mentor',
        icon: 'info',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    });
    setAccepted(true);
  };

  const rejectAgreement = async () => {
    await sendAgreementMutation({
      variables: {
        status: 'Rejected',
        contractId: proposal.relatedContracts[0].id,
        date: moment(),
        dateProposerSigned: moment(),
      },
    }).finally(() => {
      Swal.fire({
        title: 'The agreement was Rejected',
        icon: 'info',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    });
    setRejected(true);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        mb: '50px',
      }}
    >
      <Accordion defaultExpanded expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography sx={{ width: '33%', flexShrink: 0 }} fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'18.75px'}>
            Agreement
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box p={isMobile ? 'none' : '50px 83px 0 83px'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={'48px'} flexWrap="wrap">
              <Box display={'flex'} alignItems={'center'} flexWrap="wrap">
                <Typography fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'16px'} letterSpacing={'0.4px'} mr={'4px'}>
                  Mentor:
                </Typography>

                <Typography fontFamily="Roboto" fontSize={'16px'} fontWeight={400} lineHeight={'18.75px'} letterSpacing={'0.4px'}>
                  {proposal.relatedContracts[0].mentor.username}
                </Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'} flexWrap="wrap">
                <Typography fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'16px'} letterSpacing={'0.4px'} mr={'4px'}>
                  Payment:
                </Typography>
                <FormControl sx={{ minWidth: isMd ? 'auto' : '275px', mr: '26px' }} size="small">
                  <Select name="payment" value={selectValues.payment} disabled displayEmpty>
                    <MenuItem value="">
                      <em>No payment</em>
                    </MenuItem>
                    <MenuItem value="fixed-payment">Fixed payment</MenuItem>
                    <MenuItem value="conditional-payment-if-funded">Conditional payment if funded</MenuItem>
                    <MenuItem value="proposal-referral-fee">Proposal referral fee</MenuItem>
                  </Select>
                </FormControl>

                <OutlinedInput
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  sx={{ minWidth: isMd ? 'auto' : '275px' }}
                  size="small"
                  readOnly={true}
                  value={inputValues.paymentAmount}
                ></OutlinedInput>
              </Box>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexWrap="wrap">
              <Box display={'flex'} alignItems={'center'} flexWrap="wrap">
                <Typography fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'16px'} letterSpacing={'0.4px'} mr={'4px'}>
                  Proposer:
                </Typography>

                <Typography fontFamily="Roboto" fontSize={'16px'} fontWeight={400} lineHeight={'18.75px'} letterSpacing={'0.4px'}>
                  {proposal.relatedContracts[0].proposer.username}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography
                fontFamily="Roboto"
                fontSize={'16px'}
                fontWeight={700}
                lineHeight={'16px'}
                letterSpacing={'0.4px'}
                mt={'24px'}
                mb={'8px'}
              >
                Responsibilities:
              </Typography>
              <TextField
                multiline
                rows={6}
                fullWidth
                sx={{
                  borderRadius: '20px',
                }}
                variant={'outlined'}
                disabled
                value={inputValues.responsibilities}
              ></TextField>
            </Box>
            <Box
              display={!accepted && !rejected && proposal.relatedContracts[0].isMentorApprover ? 'flex' : 'none'}
              className="buttons-container"
              mt={'55px'}
              justifyContent={'center'}
              alignItems={'center'}
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  width: '175px',
                  height: '36px',
                  mr: isXs ? 'none' : '70px',
                  mb: !isXs ? 'none' : '10px',
                }}
                onClick={acceptAgreement}
              >
                <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.25px'}>
                  accept
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  width: '175px',
                  height: '36px',
                }}
                onClick={rejectAgreement}
              >
                <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.25px'}>
                  reject
                </Typography>
              </Button>
            </Box>
            <Box
              display={accepted || rejected ? 'flex' : 'none'}
              className="agreement-accepted"
              mt={'55px'}
              justifyContent={'center'}
              alignItems={'center'}
              flexWrap="wrap"
            >
              {rejected ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <CancelIcon
                    color="error"
                    sx={{
                      fontSize: '70px',
                    }}
                  />
                  <Box>
                    <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.2px'}>
                      Proposer: REJECTED <br />
                      {moment.utc(proposerSignedDate.formatted).local().format('MMMM Do YYYY, h:mm a')}
                    </Typography>
                  </Box>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircleIcon
                    color="success"
                    sx={{
                      fontSize: '70px',
                    }}
                  />
                  <Box>
                    <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.2px'}>
                      Proposer: SIGNED <br />
                      {moment.utc(proposerSignedDate.formatted).local().format('MMMM Do YYYY, h:mm a')}
                    </Typography>
                  </Box>
                </div>
              )}
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: '70px',
                }}
              />
              <Box>
                <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.2px'}>
                  Mentor: SIGNED <br />
                  {moment.utc(mentorSignedDate.formatted).local().format('MMMM Do YYYY, h:mm a')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default Agreement;

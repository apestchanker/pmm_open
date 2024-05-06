import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputAdornment,
  LinearProgress,
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
import CancelIcon from '@mui/icons-material/Dangerous';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Proposal } from 'Types';
import { useMutation } from '@apollo/client';
import { SEND_AGREEMENT, DRAFT_AGREEMENT } from 'Queries/PMM2/mentoringQueries';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

interface AgreementI {
  proposal?: Proposal;
}

const Agreement = ({ proposal }: AgreementI) => {
  const [sendAgreementMutation] = useMutation(SEND_AGREEMENT);
  const [saveDraftMutation] = useMutation(DRAFT_AGREEMENT);
  console.log(proposal, 'Proposal at Mentor Agreement Begins');

  if (!proposal) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  } else {
    interface MyDateTime extends DateTime {
      formatted: string;
    }

    const mentorSignedDate = proposal.relatedContracts[0].dateMentorSigned as MyDateTime;
    const proposerSignedDate = proposal.relatedContracts[0].dateProposerSigned as MyDateTime;

    const [expanded, setExpanded] = React.useState<string | false>('panel1');

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

    const handleSelectChange = (event: SelectChangeEvent) => {
      setSelectValues({ ...selectValues, [event.target.name]: event.target.value });
    };

    interface InputValuesI {
      paymentAmount: string;
      responsibilities: string;
    }

    const [inputValues, setInputValues] = useState<InputValuesI>({
      //paymentAmount: '',
      responsibilities: proposal.relatedContracts[0].terms,
      //paymentAmount: proposal.relatedContracts[0].paymentAmount.toString(),
      paymentAmount: proposal.relatedContracts[0]?.paymentAmount?.toString() || '',
      // responsibilities: proposal.relatedContracts[0].terms,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValues({ ...inputValues, [e.target.name]: e.target.value });
    };
    const handleBlur = () => {
      (inputValues.paymentAmount < '0' || inputValues.paymentAmount === '') && setInputValues({ ...inputValues, ['paymentAmount']: '0' });
    };

    useEffect(() => {
      if (selectValues.payment === '') {
        setInputValues({ ...inputValues, ['paymentAmount']: '0' });
      }
    }, [selectValues.payment]);

    const [isAgreementSent, setIsAgreementSent] = React.useState(false);
    const [propStatus, setPropStatus] = React.useState('Pending');

    useEffect(() => {
      setIsAgreementSent(proposal.relatedContracts[0].isMentorApprover);
      setPropStatus(proposal.relatedContracts[0].status);
    }, [proposal]);

    const saveAsDraft = async () => {
      console.log(proposal, selectValues, inputValues);
      await saveDraftMutation({
        variables: {
          status: 'Draft',
          contractId: proposal.relatedContracts[0].id,
          terms: inputValues.responsibilities,
          isMentorApprover: false,
          paymentType: selectValues.payment,
          paymentAmount: parseFloat(inputValues.paymentAmount),
          date: moment(),
        },
      }).finally(() => {
        setIsAgreementSent(false);
        setPropStatus('Draft');
        Swal.fire({
          title: 'The agreement was saved as draft',
          icon: 'info',
          showCloseButton: true,
          confirmButtonText: 'Ok',
        });
      });
    };

    const sendAgreement = async () => {
      await sendAgreementMutation({
        variables: {
          status: 'Sent',
          contractId: proposal.relatedContracts[0].id,
          terms: inputValues.responsibilities,
          isMentorApprover: true,
          paymentType: selectValues.payment,
          paymentAmount: parseFloat(inputValues.paymentAmount),
          date: moment(),
          dateMentorSigned: moment(),
        },
      }).finally(() => {
        setIsAgreementSent(true);
        setPropStatus('Sent');
        Swal.fire({
          title: 'The agreement was sent to the proposer',
          icon: 'info',
          showCloseButton: true,
          confirmButtonText: 'Ok',
        });
      });
    };

    console.log(proposal, selectValues, inputValues);
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
                    <Select name="payment" value={selectValues.payment} onChange={handleSelectChange} displayEmpty>
                      <MenuItem value="">
                        <em>No payment</em>
                      </MenuItem>
                      <MenuItem value="fixed-payment">Fixed payment</MenuItem>
                      <MenuItem value="conditional-payment-if-funded">Conditional payment if funded</MenuItem>
                      <MenuItem value="proposal-referral-fee">Proposal referral fee</MenuItem>
                    </Select>
                  </FormControl>

                  <OutlinedInput
                    disabled={selectValues.payment === ''}
                    value={inputValues.paymentAmount}
                    name={'paymentAmount'}
                    type="number"
                    inputProps={{
                      min: 0,
                    }}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    sx={{ minWidth: isMd ? 'auto' : '275px' }}
                    size="small"
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
                  value={inputValues.responsibilities}
                  name={'responsibilities'}
                  onChange={handleInputChange}
                ></TextField>
              </Box>
              {propStatus === 'Sent' ? (
                <Box className="buttons-container" mt={'55px'} justifyContent={'center'} alignItems={'center'} flexWrap="wrap">
                  <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.25px'}>
                    {`Agreement was sent. Awaiting party's response`}
                  </Typography>
                </Box>
              ) : (
                <Box
                  display={!isAgreementSent ? 'flex' : 'none'}
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
                    onClick={saveAsDraft}
                  >
                    <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.25px'}>
                      save as draft
                    </Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      width: '175px',
                      height: '36px',
                    }}
                    onClick={sendAgreement}
                  >
                    <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'14px'} lineHeight={'16px'} letterSpacing={'1.25px'}>
                      send agreement
                    </Typography>
                  </Button>
                </Box>
              )}

              <Box
                display={isAgreementSent ? 'flex' : 'none'}
                className="agreement-accepted"
                mt={'55px'}
                justifyContent={'center'}
                alignItems={'center'}
                flexWrap="wrap"
              >
                {propStatus === 'Rejected' ? (
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
                  <div
                    style={{
                      display: propStatus === 'Sent' ? 'none' : 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
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
  }
};

export default Agreement;

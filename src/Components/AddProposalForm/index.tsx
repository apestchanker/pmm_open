import {
  Autocomplete,
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Box } from '@mui/system';
import Style from './AddProposalForm.module.css';
import React, { useEffect, useState } from 'react';
import {
  ADD_DRAFT_PROPOSAL,
  ADD_PROPOSAL,
  CREATE_ATTACHMENT,
  CONNECT_NOTIFICATION_TO_USER,
  CREATE_LATEST_ACTIVITIES,
  GET_CHALLENGES,
  GET_USER_ID,
  GET_USER_INTERESTS,
  GET_USER_PROPOSAL_TEMPLATES,
} from 'Queries';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Checkbox from '@mui/material/Checkbox';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { usePrompt } from 'Hooks/blockingHooks';
import { imgUploadFile } from '../../Firebase/fileUpload.js';

interface State {
  id: string;
  challengeId: string;
  userId: string;
  title: string;
  problem: string;
  solution: string;
  relevantExperience: string;
  repo: string;
  detailedPlan: string;
  requestedFunds: string;
  tags: string[];
  coProposers: string[];
  attachments: string[];
  statusDate: string;
  describedSolution: string;
  howAddressesChallenge: string;
  projectRisks: string;
  budgetBreakdown: string;
  requiredTeamMembers: string;
  isProjectNew: string;
  sdgRating: string;
  isTemplate: boolean;
  interests: any[];
}

export interface SnackBarState extends SnackbarOrigin {
  open: boolean;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(229, 229, 229, 1)',
  borderRadius: '10px',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

function AddProposalForm({ setComponentToShow }: { setComponentToShow: (component: string) => void }) {
  const { username } = useNetworkAuth();
  const actualDate = new Date().toISOString();
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const navigate = useNavigate();

  ////////////////////////////////////////
  //////////////// TEMPLATE SELECT ////////////////
  ////////////////////////////////////////
  const [openModal, setOpenModal] = React.useState(true);
  const [filteredChallenges, setFilteredChallenges] = React.useState<any>([]);
  const { data: challengeData } = useQuery(GET_CHALLENGES);

  const { data: userData } = useQuery(GET_USER_ID, {
    variables: { username },
  });

  const [fundingStateArray, setFundingStateArray] = React.useState<any>([]);
  useEffect(() => {
    if (challengeData) {
      setFundingStateArray(Array.from(new Set(challengeData?.Challenge.map((challenge: any) => challenge.fund.fundnumber))));
    }
  }, [challengeData]);
  const [fundingState, setFundingState] = React.useState<any>('');
  useEffect(() => {
    if (userData) {
      setValues({ ...values, userId: userData?.User[0]?.id });
    }
  }, [userData]);

  useEffect(() => {
    setFilteredChallenges(challengeData?.Challenge?.filter((challenge: any) => challenge.fund.fundnumber === fundingState));
  }, [fundingState]);

  const [imgFile, setImgFile] = useState<File | undefined>(undefined);

  const handleSubmitAttachments = async () => {
    try {
      const picurl = await imgUploadFile(imgFile);
      // await updatePicUrl({
      //   variables: {
      //     id: userData?.User[0]?.id,
      //     picurl: picurl,
      //   },
      // });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleSubmitAttachments();
  }, [imgFile]);
  // END PROFILE PICTURE

  const [selected, setSelected] = React.useState('scratch');
  const [fetchTemplates, { data: dataTemplates }] = useLazyQuery(GET_USER_PROPOSAL_TEMPLATES, { fetchPolicy: 'network-only' });
  const [selectedProposalTitle, setSelectedProposalTitle] = React.useState('');
  const [createLatestAct] = useMutation(CREATE_LATEST_ACTIVITIES);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const proposalListing = dataTemplates?.User[0]?.proposals;
  const handleChangeModal = (event: any) => {
    setSelected(event.target.value);
    setDataChanged(true);
  };
  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);
  const handleChangeValues = (prop: any) => {
    setUniqueId(uuidv4());
    setValues({
      id: uniqueId,
      userId: userData?.User[0]?.id,
      challengeId: prop?.inChallenge?.id,
      title: prop?.title,
      problem: prop?.problem,
      solution: prop?.solution,
      relevantExperience: prop?.relevantExperience,
      repo: prop?.repo,
      detailedPlan: prop?.detailedPlan,
      requestedFunds: prop?.requestedFunds,
      tags: prop?.describedByInterests[0]?.name,
      coProposers: [],
      attachments: [],
      statusDate: actualDate,
      describedSolution: prop?.descriptionOfSolution,
      howAddressesChallenge: prop?.howAddressesChallenge,
      projectRisks: prop?.mainChallengesOrRisks,
      budgetBreakdown: prop?.detailedBudget,
      requiredTeamMembers: prop?.teamRequired,
      isProjectNew: prop?.continuationOrNew,
      sdgRating: prop?.sDGRating,
      isTemplate: false,
      interests: prop?.describedByInterests[0]?.name,
    });
    setDataChanged(true);
    closeModal();
  };

  const handleCloseModal = () => setOpenModal(false);
  const closeModal = () => {
    handleCloseModal();
  };
  React.useEffect(() => {
    fetchTemplates({ variables: { username: username } });
  }, [username, fetchTemplates]);

  ////////////////////////////////////////
  //////////////// SNACKBAR ////////////////
  ////////////////////////////////////////
  const msg = 'Proposal added successfully';
  const [snackBarState, setSnackBarState] = React.useState<SnackBarState>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = snackBarState;

  const handleSnackBarClose = () => {
    setSnackBarState({ ...snackBarState, open: false });
  };

  ////////////////////////////////////////
  //////////////// SNACKBAR ////////////////
  ////////////////////////////////////////

  const { data: interestsData } = useQuery(GET_USER_INTERESTS);

  const [tagValues, setTagValues] = React.useState<any>([]);
  const processedValuesArray = tagValues.map((val: any) => val.id);
  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    userId: '',
    challengeId: '',
    title: '',
    problem: '',
    solution: '',
    relevantExperience: '',
    repo: '',
    detailedPlan: '',
    requestedFunds: '',
    tags: [],
    coProposers: [],
    attachments: [],
    statusDate: actualDate,
    describedSolution: '',
    howAddressesChallenge: '',
    projectRisks: '',
    budgetBreakdown: '',
    requiredTeamMembers: '',
    isProjectNew: '',
    sdgRating: '',
    isTemplate: false,
    interests: [],
  });

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value, id: uniqueId });
    setUniqueId(uuidv4());
    setDataChanged(true);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setValues({ ...values, challengeId: event.target.value as string });
    setDataChanged(true);
  };

  const handleTagsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValues({ ...values, tags: event.target.value as string[] });
    setDataChanged(true);
  };
  //! userId and statusDate commented by query changes

  // ATTACHMENTS INIT
  const attachmentId = uuidv4();
  const [attachmentUrl, setAttachmentUrl] = useState(undefined);

  const [createAttachment] = useMutation(CREATE_ATTACHMENT, {
    variables: { attachmentId: attachmentId, attachmentUrl: attachmentUrl, proposalId: values.id },
  });

  const [createProposals, { data, loading, error }] = useMutation(ADD_PROPOSAL, {
    variables: {
      id: values.id,
      title: values.title,
      solution: values.solution,
      relevantExperience: values.relevantExperience,
      repo: values.repo,
      detailedPlan: values.detailedPlan,
      requestedFunds: Number(values.requestedFunds),
      challengeId: values.challengeId,
      problem: values.problem,
      descriptionOfSolution: values.describedSolution,
      howAddressesChallenge: values.howAddressesChallenge,
      mainChallengesOrRisks: values.projectRisks,
      detailedBudget: values.budgetBreakdown,
      teamRequired: values.requiredTeamMembers,
      continuationOrNew: values.isProjectNew,
      sDGRating: values.sdgRating,
      isTemplate: values.isTemplate,
      interests: processedValuesArray,
      userId: userData?.User[0]?.id,
      fundingId: 'funding-status-001',
    },
  });

  const [createDraftProposals, { data: draftData, error: draftError }] = useMutation(ADD_DRAFT_PROPOSAL, {
    variables: {
      id: values.id,
      title: values.title,
      solution: values.solution,
      relevantExperience: values.relevantExperience,
      repo: values.repo,
      detailedPlan: values.detailedPlan,
      requestedFunds: Number(values.requestedFunds),
      challengeId: values.challengeId,
      problem: values.problem,
      descriptionOfSolution: values.describedSolution,
      howAddressesChallenge: values.howAddressesChallenge,
      mainChallengesOrRisks: values.projectRisks,
      detailedBudget: values.budgetBreakdown,
      teamRequired: values.requiredTeamMembers,
      continuationOrNew: values.isProjectNew,
      sDGRating: values.sdgRating,
      isTemplate: false,
      interests: processedValuesArray,
      userId: userData?.User[0]?.id,
      fundingId: 'funding-status-000',
    },
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueId(uuidv4());
    setValues({ ...values, isTemplate: event.target.checked });
    setDataChanged(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      values.title === '' ||
      values.solution === '' ||
      values.relevantExperience === '' ||
      values.detailedPlan === '' ||
      values.requestedFunds === '' ||
      values.challengeId === '' ||
      values.statusDate === '' ||
      values.problem === '' ||
      values.describedSolution === '' ||
      values.projectRisks === '' ||
      values.budgetBreakdown === '' ||
      values.requiredTeamMembers === '' ||
      values.isProjectNew === '' ||
      !tagValues
    ) {
      Swal.fire({
        title: 'Something went wrong, please try again',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    } else {
      await createProposals();
      if (imgFile !== undefined) {
        const picurl = await imgUploadFile(imgFile);
        setAttachmentUrl(picurl);
        await createAttachment();
      }
      setDataChanged(false);
      Swal.fire({
        title: 'Proposal added successfully',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          setComponentToShow('Proposals');
        },
      });
    }
    await createLatestAct({
      variables: {
        id: `${uniqueId}-${actualDate} latact-proposal`,
        message: '#LAT-ACT - You created a proposal',
        date: { formatted: actualDate },
        link: '#',
      },
    }).then(() => {
      connectNotification({
        variables: {
          userID: userData?.User[0]?.id,
          notificationID: `${uniqueId}-${actualDate} latact-proposal`,
        },
      });
    });
  };

  const handleDraftSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (
      values.title === '' ||
      values.solution === '' ||
      values.relevantExperience === '' ||
      values.detailedPlan === '' ||
      values.requestedFunds === '' ||
      values.challengeId === ''
    ) {
      Swal.fire({
        title: 'Something went wrong, please try again',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    } else {
      await createDraftProposals();
      if (imgFile !== undefined) {
        const picurl = await imgUploadFile(imgFile);
        setAttachmentUrl(picurl);
        await createAttachment();
      }
      Swal.fire({
        title: 'Proposal draft added successfully',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          setComponentToShow('Proposals');
        },
      });
    }
    await createLatestAct({
      variables: {
        id: `${uniqueId}-${actualDate} latact-proposal`,
        message: '#LAT-ACT - You created a proposal as draft',
        date: { formatted: actualDate },
        link: '#',
      },
    }).then(() => {
      connectNotification({
        variables: {
          userID: userData?.User[0]?.id,
          notificationID: `${uniqueId}-${actualDate} latact-proposal`,
        },
      });
    });
  };

  if (!interestsData || !userData) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleSnackBarClose}
          autoHideDuration={7000}
          message={msg}
          key={vertical + horizontal}
          /* sx={{ backgroundColor: snColor }} */
        />
        <Grid
          container
          spacing={3}
          sx={{ position: 'relative', width: '80%', margin: 'auto', p: { xs: 1, md: 10 }, pt: { xs: 5, md: 10 } }}
        >
          <Button
            onClick={() => setComponentToShow('Proposals')}
            sx={{ color: 'var(--primaryBlue)', position: { md: 'absolute' }, top: { md: '10px' }, left: { md: '10px' } }}
            startIcon={<ArrowBackIosNewIcon />}
          >
            <Typography variant="h6">Return</Typography>
          </Button>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px' }}>New Proposal</Typography>
          {/* TITLE START*/}
          <Grid item xs={12} md={12} className={Style.gridItem}>
            <FormControl fullWidth sx={{ maxWidth: { md: '300px' } }}>
              <Typography>Proposal Title(35 characters) *</Typography>
              <FilledInput
                required
                fullWidth
                id="title-input"
                type="text"
                value={values.title}
                onChange={handleChange('title')}
                inputProps={{ maxLength: 35 }}
              />
            </FormControl>
          </Grid>
          {/* TITLE END*/}

          {/* CAMPAIGN START*/}
          <Grid item xs={12} md={4} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Fund *</Typography>
              <Select
                required
                sx={{ width: '90%' }}
                inputProps={{ 'aria-label': 'Without label' }}
                type="text"
                value={fundingState}
                onChange={(e) => setFundingState(e.target.value)}
              >
                {fundingStateArray?.map((challenge: any, index: number) => (
                  <MenuItem key={`${challenge}inchall${index}`} value={challenge}>
                    {challenge}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8} className={Style.gridItem}>
            <FormControl sx={{ width: '100%' }}>
              <Typography>Challenge *</Typography>
              <Select
                required
                sx={{ width: '100%' }}
                inputProps={{ 'aria-label': 'Without label' }}
                id="campaign-select"
                type="text"
                value={values.challengeId}
                onChange={handleSelectChange}
              >
                {filteredChallenges?.map((challenge: any) => (
                  <MenuItem key={challenge?.id} value={challenge?.id}>
                    {challenge?.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* CAMPAIGN END*/}

          {/* Problem Statement START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Problem Statement (140 characters) *</Typography>
              <FilledInput
                required
                inputProps={{ maxLength: 140 }}
                fullWidth
                id="problem-statement-input"
                type="text"
                placeholder=""
                value={values.problem}
                onChange={handleChange('problem')}
              />
            </FormControl>
          </Grid>
          {/* Problem Statement END*/}

          {/* 140 CHARAS DESCRIPTION START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Summarize your solution to the problem (140 characters) *</Typography>
              <FilledInput
                required
                fullWidth
                inputProps={{ maxLength: 140 }}
                id="description-140-charas-input"
                type="text"
                placeholder="Describe your idea, motivations, what you need as detailed as you wish..."
                value={values.solution}
                onChange={handleChange('solution')}
              />
            </FormControl>
          </Grid>
          {/* 140 CHARAS DESCRIPTION END*/}

          {/* Relevant experience START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Summarize your relevant experience (280 characters) *</Typography>
              <FilledInput
                required
                fullWidth
                inputProps={{ maxLength: 280 }}
                id="relevant-exp-input"
                type="text"
                value={values.relevantExperience}
                onChange={handleChange('relevantExperience')}
              />
            </FormControl>
          </Grid>
          {/* Relevant experience END*/}

          {/* Website/GitHub START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Website/GitHub repository (not required)</Typography>
              <FilledInput fullWidth id="web-github-input" type="text" value={values.repo} onChange={handleChange('repo')} />
            </FormControl>
          </Grid>
          {/* Website/GitHub END*/}

          {/* Requested funds in USD START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <FormControl fullWidth>
              <Typography>Requested funds in USD</Typography>
              <FilledInput
                fullWidth
                id="funds-input"
                type="number"
                value={values.requestedFunds}
                onChange={handleChange('requestedFunds')}
              />
            </FormControl>
          </Grid>
          {/* Requested funds in USD END*/}

          {/* TAGS START*/}
          {/* ADD required when implemented */}
          <Grid item xs={12} className={Style.gridItem}>
            {/* <FormControl fullWidth> */}
            <Typography>Tags: reach what you need by tagging topics related to your proposal *</Typography>
            {/* <FilledInput fullWidth id="funds-input" type="text" value={values.tags} onChange={handleTagsChange} /> */}
            {/* </FormControl> */}
            <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5, maxWidth: '350px' }}>
              <Autocomplete
                multiple
                limitTags={2}
                value={tagValues}
                onChange={(event: any, newValue: any | null) => setTagValues(newValue)}
                id="tags-outlined"
                getOptionLabel={(interest: any) => interest?.name}
                options={interestsData?.Interest}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} variant="filled" placeholder="Social impact, Development..." />}
              />
            </FormControl>
          </Grid>
          {/* TAGS END*/}

          {/* CO-PROPOSERS START*/}
          <Grid item xs={12} className={Style.gridItem} sx={{ display: 'none' }}>
            <FormControl fullWidth>
              <Typography>Co Proposers: add their names or tag them by using @</Typography>
              <FilledInput fullWidth id="coproposers-input" type="text" value={values.coProposers} onChange={handleChange('coProposers')} />
            </FormControl>
          </Grid>
          {/* CO-PROPOSERS END*/}

          {/* ATTACHMENTS START*/}
          {/* <Grid item xs={12} className={Style.gridItem}>
          <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
            <Grid item xs={8} md={9}>
              <FormControl fullWidth>
                <Typography>Attach an image or supporting document (up to 25 MB and 5 files)</Typography>
                <FilledInput
                  fullWidth
                  id="coproposers-input"
                  type="text"
                  disabled
                  placeholder="Browse file or Drag and Drop"
                  value={values.attachments}
                  onChange={handleChange('attachments')}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={2} className={Style.gridItem} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl sx={{ justifyContent: 'flex-end' }}>
                <Button
                  sx={{ backgroundColor: 'var(--primaryBlue)', textTransform: 'none', color: 'white', width: '127px', height: '56px' }}
                >
                  Upload File
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Grid> */}
          {/* ATTACHMENTS END*/}

          {/*Please describe your proposed solution* START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>Please describe your proposed solution*</Typography>
                <TextField
                  id="describedSolution-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.describedSolution}
                  onChange={handleChange('describedSolution')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* Please describe your proposed solution* END*/}

          {/*solutionApproachSTART*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>Please describe how your proposed solution will address the challenge?*</Typography>
                <TextField
                  id="howAddressesChallenge-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.howAddressesChallenge}
                  onChange={handleChange('howAddressesChallenge')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* solutionApproach END*/}

          {/*projectRisks START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>What main challenges or risks do you foresee to deliver this project succesfully?*</Typography>
                <TextField
                  id="projectRisks-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.projectRisks}
                  onChange={handleChange('projectRisks')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* projectRisks END*/}

          {/*projectTimeline START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>Please provide a detailed plan and timeline for delivering the solution*</Typography>
                <TextField
                  id="detailedPlan-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.detailedPlan}
                  onChange={handleChange('detailedPlan')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* projectTimeline END*/}

          {/*Please provide a detailed budget breakdown* START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>Please provide a detailed budget breakdown*</Typography>
                <TextField
                  id="budgetBreakdown-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.budgetBreakdown}
                  onChange={handleChange('budgetBreakdown')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* Please provide a detailed budget breakdown* END*/}

          {/* requiredTeamMembers START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>Please provide details of your team members required to complete the project*</Typography>
                <TextField
                  id="requiredTeamMembers-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.requiredTeamMembers}
                  onChange={handleChange('requiredTeamMembers')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* requiredTeamMembers END*/}

          {/* isProjectNew START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>
                  Please provide information on whether this proposal is a continuation of a previously funded project in Catalyst or an
                  entirely new one.*
                </Typography>
                <TextField
                  id="isProjectNew-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.isProjectNew}
                  onChange={handleChange('isProjectNew')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* isProjectNew END*/}
          {/* ATTACHMENTS START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
              <Grid item xs={8} md={9}>
                <FormControl fullWidth>
                  <Typography>Attach an image to identify your proposal</Typography>
                  <FilledInput
                    fullWidth
                    id="coproposers-input"
                    type="text"
                    disabled
                    placeholder={attachmentUrl === undefined ? 'Browse Image' : 'Image Uploaded'}
                    value={values.attachments}
                    onChange={handleChange('attachments')}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={2} className={Style.gridItem} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormControl sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: 'var(--primaryBlue)', textTransform: 'none', color: 'white', width: '127px', height: '56px' }}
                  >
                    Upload Image
                    <input hidden accept="image/*" multiple type="file" onChange={(e) => setImgFile(e.target.files?.[0])} />
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {/* ATTACHMENTS END*/}

          {/* sdgRating START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
                <Typography>SDG Rating (optional)</Typography>
                <TextField
                  id="sdgRating-input"
                  multiline
                  rows={4}
                  placeholder="..."
                  variant="filled"
                  fullWidth
                  value={values.sdgRating}
                  onChange={handleChange('sdgRating')}
                />
              </FormControl>
            </Box>
          </Grid>
          {/* sdgRating END*/}

          {/* isTemplate START*/}
          <Grid item xs={12} className={Style.gridItem}>
            <Box sx={{ pt: '0px' }}>
              <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox id="isTemplate-input" checked={values.isTemplate} onChange={handleCheckboxChange} />
                <Typography>Save proposal as template</Typography>
              </FormControl>
            </Box>
          </Grid>
          {/* isTemplate END*/}

          {/* SUBMIT AND DRAFT BUTTON */}
          <Grid item xs={12} className={Style.gridItem}>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button variant="contained" sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }} onClick={handleDraftSubmit}>
                Save As Draft
              </Button>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Grid container spacing={2} mt={2}>
          <Box
            sx={{
              backgroundColor: 'var(--bgGray)',
              boxShadow: 24,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              borderRadius: '7px',
              width: { xs: '80%', md: '50%' },
              zIndex: 100,
            }}
          >
            <Box className="name" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', ml: 3, mt: 3 }}>New Proposal</Typography>
              <IconButton sx={{ m: 1 }} onClick={() => closeModal()}>
                <CloseIcon sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%' }} />
              </IconButton>
            </Box>
            <Grid item xs={12} sm={4} md={3}>
              <Button
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                <Paper
                  elevation={2}
                  sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ textAlign: 'center' }}>START FROM A SCRATCH</Typography>
                  </Box>
                </Paper>
              </Button>
            </Grid>
            {proposalListing?.length > 0 && (
              <Grid container sx={{ display: 'flex', width: '100%', flexDirection: 'row' }}>
                <Typography sx={{ width: '100%', fontWeight: 'bold', fontSize: '18px', m: 3 }}>Use Template</Typography>
                {proposalListing?.map((prop: any) => (
                  <Grid item xs={3} key={prop?.id} sx={{ width: '25%' }}>
                    <Button
                      sx={{ width: '100%' }}
                      onClick={() => {
                        handleChangeValues(prop);
                      }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          width: '100%',
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '120px',
                        }}
                      >
                        <Typography sx={{ textAlign: 'center', width: '100%' }}>{prop?.title}</Typography>
                      </Paper>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Modal>
    </>
  );
}

export default AddProposalForm;

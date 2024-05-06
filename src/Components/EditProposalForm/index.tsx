import {
  Autocomplete,
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Box } from '@mui/system';
import Style from './AddProposalForm.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import {
  GET_CHALLENGES,
  GET_USER_ID,
  GET_PROPOSAL_BY_ID,
  EDIT_PROPOSAL,
  GET_FUNDING_STATUS_LIST,
  GET_USER_INTERESTS,
  UPDATE_PROPOSAL_FUNDING_STATUS,
  UPDATE_PROPOSAL_CHALLENGE,
  UPDATE_PROPOSAL_INTERESTS,
} from 'Queries';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { FundingStatus, Proposal, User } from 'Types';
import Swal from 'sweetalert2';
import { usePrompt } from 'Hooks/blockingHooks';

interface State {
  id: string;
  fundingStatus: string;
  challengeId: string;
  userId: string;
  title: string;
  solution: string;
  relevantExperience: string;
  repo: string;
  detailedPlan: string;
  requestedFunds: string;
  tags: string[];
  coProposers: string[];
  attachments: string[];
  statusDate: string;
  problemStatement: string;
  describedSolution: string;
  howAddressesChallenge: string;
  projectRisks: string;
  budgetBreakdown: string;
  requiredTeamMembers: string;
  isProjectNew: string;
  sdgRating: string;
}

function EditProposalForm() {
  const { username } = useNetworkAuth();
  const actualDate = new Date().toISOString();
  const navigate = useNavigate();
  const { id } = useParams();

  // VALUES FOR INTERESTS
  const { data: interestsData } = useQuery(GET_USER_INTERESTS);
  const [tagValues, setTagValues] = React.useState<any>([]);

  const {
    data: proposalData,
    loading: proposalLoading,
    error: proposalError,
  } = useQuery(GET_PROPOSAL_BY_ID, {
    variables: { id },
  });

  const { data: fundingStatusesData } = useQuery(GET_FUNDING_STATUS_LIST);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_ID, {
    variables: { username },
  });

  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);

  useEffect(() => {
    setTagValues(proposalData?.Proposal[0]?.describedByInterests);
    if (proposalData?.Proposal?.length && userData?.User?.length) {
      const proposal = proposalData.Proposal[0] as Proposal;
      const user = userData.User[0] as User;
      setValues({
        id: id || '',
        userId: user?.id || '',
        challengeId: proposal?.inChallenge?.id,
        title: proposal?.title,
        solution: proposal?.solution,
        relevantExperience: proposal?.relevantExperience,
        repo: proposal?.repo,
        detailedPlan: proposal?.detailedPlan,
        requestedFunds: `${proposal?.requestedFunds}`,
        fundingStatus: proposal?.fundingStatus?.id,
        tags: [],
        coProposers: [],
        attachments: [],
        statusDate: actualDate,
        problemStatement: proposal?.problem,
        describedSolution: proposal?.descriptionOfSolution,
        howAddressesChallenge: proposal?.howAddressesChallenge,
        projectRisks: proposal?.mainChallengesOrRisks,
        budgetBreakdown: proposal?.detailedBudget,
        requiredTeamMembers: proposal?.teamRequired,
        isProjectNew: proposal?.continuationOrNew,
        sdgRating: proposal?.sDGRating,
      });
      setTagValues(proposal.describedByInterests);
    }
  }, [proposalData, userData, id]);

  const [values, setValues] = React.useState<State>({
    id: id || '',
    userId: '',
    challengeId: '',
    title: '',
    solution: '',
    relevantExperience: '',
    repo: '',
    detailedPlan: '',
    requestedFunds: '',
    tags: [],
    coProposers: [],
    attachments: [],
    statusDate: actualDate,
    fundingStatus: '',
    problemStatement: '',
    describedSolution: '',
    howAddressesChallenge: '',
    projectRisks: '',
    budgetBreakdown: '',
    requiredTeamMembers: '',
    isProjectNew: '',
    sdgRating: '',
  });

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
    setDataChanged(true);
  };

  const handleSelectChange = (name: keyof State) => (event: SelectChangeEvent) => {
    setValues({ ...values, [name]: event.target.value as string });
    setDataChanged(true);
  };

  const handleTagsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValues({ ...values, tags: event.target.value as string[] });
  };

  const {
    data: challengeData,
    loading: challengeLoading,
    error: challengeError,
  } = useQuery(GET_CHALLENGES, {
    variables: { username },
  });

  const [editProposal, { data, loading, error }] = useMutation(EDIT_PROPOSAL);

  const [updateFundingStatus, { data: updateFundingStatusData }] = useMutation(UPDATE_PROPOSAL_FUNDING_STATUS);

  const [updateChallenge, { data: addChallengeData }] = useMutation(UPDATE_PROPOSAL_CHALLENGE);
  const [updateInterests, { data: removeInterestData }] = useMutation(UPDATE_PROPOSAL_INTERESTS);
  /* 
  id: $id
      title: $title
      solution: $solution
      relevantExperience: $relevantExperience
      repo: $repo
      detailedPlan: $detailedPlan
      requestedFunds: $requestedFunds
      userId: $userId
  */

  useEffect(() => {
    if (userData) {
      setValues({
        ...values,
        userId: userData?.User[0].id,
      });
    }
  }, [userData]);

  // const [updateProposal] = useMutation(UPDATE_PROPOSALS);
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setDataChanged(false);
      if (!values.title || !values.solution || !values.relevantExperience || !values.fundingStatus || !values.challengeId || !id) {
        alert('Please fill all the fields');
      } else {
        const {
          title,
          problemStatement,
          solution,
          relevantExperience,
          repo,
          detailedPlan,
          requestedFunds,
          describedSolution,
          howAddressesChallenge,
          projectRisks,
          budgetBreakdown,
          requiredTeamMembers,
          isProjectNew,
          sdgRating,
        } = values;
        const { data } = await editProposal({
          variables: {
            id: id,
            title,
            solution,
            relevantExperience,
            repo,
            detailedPlan,
            requestedFunds: Number(requestedFunds || '0'),
            problem: problemStatement,
            descriptionOfSolution: describedSolution,
            howAddressesChallenge,
            mainChallengesOrRisks: projectRisks,
            detailedBudget: budgetBreakdown,
            teamRequired: requiredTeamMembers,
            continuationOrNew: isProjectNew,
            sDGRating: sdgRating,
          },
        });

        await updateChallenge({
          variables: {
            proposalId: values.id,
            challengeId: values.challengeId,
          },
        });

        await updateFundingStatus({
          variables: {
            proposalId: values.id,
            fundingStatusId: values.fundingStatus,
          },
        });
        await updateInterests({
          variables: {
            proposalId: values.id,
            interestsIds: tagValues.map((tag: any) => tag.id),
          },
        });
        Swal.fire({
          title: 'Successfully Edited Proposal!',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Ok',
          didDestroy: () => {
            return navigate('/marketplace');
          },
        });
      }
    },
    [values, id, tagValues],
  );

  if (!proposalData) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ position: 'relative', width: '80%', margin: 'auto', p: { xs: 1, md: 10 }, pt: { xs: 5, md: 10 } }}>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          sx={{
            color: 'var(--primaryBlue)',
            position: { md: 'absolute' },
            top: { md: '10px' },
            left: { md: '10px' },
            textTransform: 'none',
          }}
          startIcon={<ArrowBackIosNewIcon />}
        >
          <Typography variant="h6">Return</Typography>
        </Button>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px' }}>Edit Proposal</Typography>
        {/* TITLE START*/}
        <Grid item xs={12} md={8} className={Style.gridItem}>
          <FormControl fullWidth sx={{ maxWidth: { md: '300px' } }}>
            <Typography>Proposal Title(35 characters) *</Typography>
            <FilledInput required fullWidth id="title-input" type="text" value={values.title} onChange={handleChange('title')} />
          </FormControl>
        </Grid>
        {/* TITLE END*/}

        {/* CAMPAIGN START*/}
        <Grid item xs={12} md={4} className={Style.gridItem}>
          <FormControl fullWidth>
            <Typography>Challenge *</Typography>
            <Select
              required
              fullWidth
              inputProps={{ 'aria-label': 'Without label' }}
              id="campaign-select"
              type="text"
              value={values?.challengeId}
              onChange={handleSelectChange('challengeId')}
              defaultValue={proposalData?.Proposal[0]?.inChallenge?.id}
            >
              {challengeData?.Challenge.map((challenge: any) => (
                <MenuItem key={challenge?.id} value={challenge?.id}>
                  {challenge?.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* CAMPAIGN END*/}
        {/* MOVE FUNDING STATUS */}
        {/* <Grid item xs={12} md={4} className={Style.gridItem}>
          <FormControl fullWidth>
            <Typography>Funding Status *</Typography>
            <Select
              required
              fullWidth
              inputProps={{ 'aria-label': 'Without label' }}
              id="campaign-select"
              type="text"
              value={values.fundingStatus}
              onChange={handleSelectChange('fundingStatus')}
              defaultValue={proposalData.Proposal[0].fundingStatus.id}
            >
              {fundingStatusesData?.FundingStatus?.map((status: FundingStatus) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        {/* MOVE FUNDING STATUS END */}
        {/* Problem Statement START*/}
        <Grid item xs={12} className={Style.gridItem}>
          <FormControl fullWidth>
            <Typography>Problem Statement (140 characters) *</Typography>
            <FilledInput
              required
              fullWidth
              id="problem-statement-input"
              type="text"
              placeholder=""
              value={values.problemStatement}
              onChange={handleChange('problemStatement')}
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
            <Typography>Relevant experience *</Typography>
            <FilledInput
              required
              fullWidth
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
            <FilledInput fullWidth id="funds-input" type="number" value={values.requestedFunds} onChange={handleChange('requestedFunds')} />
          </FormControl>
        </Grid>
        {/* Requested funds in USD END*/}

        {/* TAGS START*/}
        <Grid item xs={12} className={Style.gridItem}>
          <FormControl fullWidth>
            <Typography>Tags: reach what you need by tagging topics related to your proposal *</Typography>
            {/* ADD REQUIRED WHEN IMPLEMENTED */}
            {/* <FilledInput fullWidth id="funds-input" type="text" value={values.tags} onChange={handleTagsChange} /> */}
            <Autocomplete
              multiple
              limitTags={2}
              defaultValue={proposalData?.Proposal[0]?.describedByInterests}
              value={tagValues}
              onChange={(event: any, newValue: any) => setTagValues(newValue)}
              id="tags-outlined"
              getOptionLabel={(interest: any) => interest.name}
              options={interestsData?.Interest}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} variant="filled" placeholder="Social impact, Development..." />}
            />
          </FormControl>
        </Grid>
        {/* TAGS END*/}

        {/* CO-PROPOSERS START*/}
        {/* <Grid item xs={12} className={Style.gridItem} sx={{ display: 'none' }}>
          <FormControl fullWidth>
            <Typography>Co Proposers: add their names or tag them by using @</Typography>
            <FilledInput fullWidth id="coproposers-input" type="text" value={values.coProposers} onChange={handleChange('coProposers')} />
          </FormControl>
        </Grid> */}
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

        {/* SUBMIT AND DRAFT BUTTON */}
        <Grid item xs={12} className={Style.gridItem}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {/* <Button variant="contained" sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}>
              Save As Draft
            </Button> */}
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
            >
              Update
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default EditProposalForm;

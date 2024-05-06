import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FilledInput,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Swal from 'sweetalert2';
import {
  CREATE_TASK,
  GET_TASK_STATUSES,
  ADD_NEEDED_SKILLS_TO_TASK,
  LINK_PROPOSAL_TO_TASK,
  ADD_STATUS_TO_TASK,
} from '../../Queries/tasksQueries';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SKILLS } from 'Queries/collaboratorQueries';
import { GET_USER_ID, GET_FUNDED_USER_PROPOSALS, CONNECT_NOTIFICATION_TO_USER, CREATE_LATEST_ACTIVITIES } from 'Queries';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { v4 as uuidv4 } from 'uuid';
import ModalTaskTemplates from './ModalTaskTemplates';
import { usePrompt } from 'Hooks/blockingHooks';
import { useNavigate } from 'react-router-dom';

const AddTaskForm = ({ setComponentToShow }: { setComponentToShow: (component: string) => void }) => {
  const [uuid, setUniqueId] = React.useState(uuidv4());
  const { username } = useNetworkAuth();
  const [tagValues, setTagValues] = React.useState<any>([]);
  const [createTask, { loading: loadingCreateTask, error: errorCreateTask }] = useMutation(CREATE_TASK);
  const [addSkillsToTask, { loading: loadingAddSkillsToTask, error: errorAddSkillsToTask }] = useMutation(ADD_NEEDED_SKILLS_TO_TASK);
  const [linkProposalToTask, { loading: loadingLinkProposalToTask, error: errorLinkProposalToTask }] = useMutation(LINK_PROPOSAL_TO_TASK);
  const [addStatusToTask, { loading: loadingAddStatusToTask, error: errorAddStatusToTask }] = useMutation(ADD_STATUS_TO_TASK);
  const [createLatestAct] = useMutation(CREATE_LATEST_ACTIVITIES);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const { data: userProposals, loading: userProposalsLoading } = useQuery(GET_FUNDED_USER_PROPOSALS, {
    variables: { username: username },
    pollInterval: 2000,
  });
  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);
  const { data: skillsData, loading: skillsLoading } = useQuery(GET_SKILLS);
  const { data: userId, loading: userIdLoading } = useQuery(GET_USER_ID, {
    variables: { username: username },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [taskEffort, setTaskEffort] = useState('');
  const [easyTask, setEasyTask] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);
  const [values, setValues] = useState({
    id: uuid,
    title: '',
    description: '',
    effort: '',
    proposal: '',
    easytask: false,
    fees: null,
    isTemplate: false,
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueId(uuidv4());
    setValues({ ...values, [event.target.name]: event.target.value, id: uuid });
    setDataChanged(true);
  };
  useEffect(() => {
    setValues({ ...values, effort: taskEffort, easytask: easyTask, title: taskText });
  }, [taskEffort, easyTask, showTemplates]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.checked });
    setDataChanged(true);
  };
  const actualDate = new Date().toISOString();

  const [saveAs, setSaveAs] = useState('published');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setDataChanged(false);
    window.scrollTo(0, 0);
    await createTask({
      variables: {
        id: values.id,
        title: values.title,
        description: values.description,
        effort: values.effort,
        proposal: values.proposal,
        easytask: values.easytask,
        fees: Number(values.fees),
        isTemplate: values.isTemplate,
      },
    });
    setDataChanged(false);
    await addSkillsToTask({
      variables: {
        taskId: values.id,
        skills: tagValues.map((tag: any) => tag.id),
      },
    });
    await linkProposalToTask({
      variables: {
        taskId: values.id,
        proposalId: values.proposal,
      },
    });
    await addStatusToTask({
      variables: {
        taskId: values.id,
        taskStatus: `task-${saveAs}`,
      },
    });

    await createLatestAct({
      variables: {
        id: `${uuid}-${actualDate} latact-proposal`,
        message: '#LAT-ACT - You created a task',
        date: { formatted: actualDate },
        link: '#',
      },
    }).then(() => {
      connectNotification({
        variables: {
          userID: userId?.User[0].id,
          notificationID: `${uuid}-${actualDate} latact-proposal`,
        },
      });
    });
    setDataChanged(false);
    setLoading(false);

    if (errorCreateTask || errorAddSkillsToTask || errorLinkProposalToTask || errorAddStatusToTask) {
      Swal.fire({
        title: 'Something went wrong, please try again',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          setComponentToShow('Tasks');
        },
      });
    } else {
      Swal.fire({
        title: 'Task created successfully',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          setComponentToShow('Tasks');
        },
      });
      setDataChanged(false);
    }
  };

  const handleClose = () => {
    setShowTemplates(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#55555542',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
        </Box>
      )}
      <Grid container spacing={3} sx={{ position: 'relative', width: '80%', margin: 'auto', p: { xs: 1, md: 10 }, pt: { xs: 5, md: 10 } }}>
        <Button
          onClick={() => setComponentToShow('Proposals')}
          sx={{ color: 'var(--primaryBlue)', position: { md: 'absolute' }, top: { md: '10px' }, left: { md: '10px' } }}
          startIcon={<ArrowBackIosNewIcon />}
        >
          <Typography variant="h6">Return</Typography>
        </Button>
        {/* TITLE START*/}
        <Grid item xs={12}>
          {easyTask ? (
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px', pb: 2 }}>
              Easy Task - {values?.title}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px', pb: 2 }}>Fulltime Task</Typography>
          )}
          <FormControl fullWidth>
            <Typography>Title(35 characters) *</Typography>
            <FilledInput
              required
              fullWidth
              id="title-input"
              type="text"
              inputProps={{ maxLength: 35 }}
              value={values.title}
              name="title"
              onChange={handleChange}
              placeholder="Ux Designer..."
            />
          </FormControl>
        </Grid>
        {/* TITLE END*/}

        {/* PROPOSAL START*/}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography>Proposal *</Typography>
            {userProposals?.Proposal.length > 0 ? (
              <Select
                required
                fullWidth
                id="proposal-input"
                value={values.proposal}
                name="proposal"
                onChange={(e) => setValues({ ...values, proposal: e.target.value })}
              >
                {!userProposalsLoading && userProposals && userProposals?.Proposal.length > 0 ? (
                  userProposals.Proposal.map((proposal: any) => {
                    return (
                      <MenuItem key={proposal.id} value={proposal.id}>
                        {proposal.title}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value={'no-proposal'}>No proposals funded</MenuItem>
                )}
              </Select>
            ) : (
              <Typography>No proposals funded</Typography>
            )}
          </FormControl>
        </Grid>
        {easyTask ? (
          <Grid item xs={12}>
            <Typography>Effort</Typography>
            <TextField disabled fullWidth id="outlined-disabled" placeholder={values.effort || taskEffort} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography>Effort</Typography>
              <FilledInput
                placeholder="7.."
                required
                fullWidth
                id="effort-input"
                type="text"
                value={values.effort}
                name="effort"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        )}
        {/* EFFORT END*/}

        {/* Fees START*/}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography>Fees</Typography>
            <FilledInput
              placeholder="200"
              required
              fullWidth
              id="fees-input"
              type="number"
              value={values.fees}
              name="fees"
              onChange={handleChange}
            />
          </FormControl>
        </Grid>
        {/* Fees END*/}

        {/* Describe START*/}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography>Describe your project and bring task details</Typography>
            <FilledInput
              required
              fullWidth
              id="description-input"
              type="text"
              sx={{ height: 'auto' }}
              value={values.description}
              name="description"
              onChange={handleChange}
              placeholder="We are looking for a UX Designer to..."
            />
          </FormControl>
        </Grid>
        {/* Describe END*/}

        {/* Describe START*/}
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ borderRadius: '4px', mb: 5 }}>
            <Typography>Tags</Typography>
            <Autocomplete
              multiple
              limitTags={2}
              value={tagValues}
              onChange={(event: any, newValue: any | null) => setTagValues(newValue)}
              id="tags-outlined"
              getOptionLabel={(interest: any) => interest?.name}
              options={skillsLoading ? [] : skillsData?.Skill}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} variant="filled" placeholder={tagValues.length === 0 ? 'Javascript, Management, Design...' : ''} />
              )}
            />
          </FormControl>
        </Grid>
        {/* Describe END*/}

        {/* SUBMIT AND DRAFT BUTTON */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              onClick={() => setSaveAs('draft')}
              type="submit"
              variant="contained"
              sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
            >
              Save as draft
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              onClick={() => setSaveAs('published')}
              type="submit"
              variant="contained"
              sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
      {showTemplates && (
        <ModalTaskTemplates
          setTaskText={setTaskText}
          setTaskEffort={setTaskEffort}
          setShowTemplates={setShowTemplates}
          handleClose={handleClose}
          setEasyTask={setEasyTask}
        />
      )}
    </form>
  );
};

export default AddTaskForm;

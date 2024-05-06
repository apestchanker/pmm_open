import React, { useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, CircularProgress, IconButton, Modal, Tooltip, Typography, Alert, Snackbar } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OutlinedFlagTwoToneIcon from '@mui/icons-material/OutlinedFlagTwoTone';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ContactInfo from './ContactInfo';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GET_MY_ACC_MENTORING_CONTRACTS,
  GET_MY_ACC_PROPOSALS_CONTRACTS,
  GET_MY_REJ_MENTORING_CONTRACTS,
  GET_MY_REJ_PROPOSALS_CONTRACTS,
  GET_MY_PENDING_MENTORING_CONTRACTS,
  GET_MY_PENDING_PROPOSALS_CONTRACTS,
  GET_MY_PENDING_PROPOSER_CONTRACTS,
  GET_MY_PENDING_SENT_MENTORING_CONTRACTS,
  GET_MY_PENDING_SENT_PROPOSALS_CONTRACTS,
  GET_USER_ROLES,
} from 'Queries';
import FeedbackModal from './FeedbackModal';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useNavigate } from 'react-router-dom';
import SendMessageModal from 'Components/SendMessageModal';
import Swal from 'sweetalert2';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
  GET_COLLABORATOR_PENDING_SENT_CONTRACT,
  GET_COLLABORATOR_ACC_SENT_CONTRACT,
  GET_COLLABORATOR_REJ_SENT_CONTRACT,
  GET_PROPOSER_PENDING_RECEIVED_COLLABORATOR_CONTRACT,
  GET_PROPOSER_ACC_RECEIVED_COLLABORATOR_CONTRACT,
  GET_PROPOSER_REJ_RECEIVED_COLLABORATOR_CONTRACT,
  GET_PROPOSER_PENDING_SENT_COLLABORATOR_CONTRACT,
  GET_PROPOSER_ACC_SENT_COLLABORATOR_CONTRACT,
  GET_PROPOSER_REJ_SENT_COLLABORATOR_CONTRACT,
} from 'Queries/collaboratorQueries';

const DELETE_CONTRACT = gql`
  mutation ($id: ID, $status: String) {
    UpdateContract(where: { id: $id }, data: { status: $status }) {
      id
      status
    }
  }
`;

export const UPDATE_CONTRACT = gql`
  mutation ($id: ID, $status: String) {
    UpdateContract(where: { id: $id }, data: { status: $status }) {
      id
      status
    }
  }
`;

interface Props {
  toUser: string;
  toUserId: string;
  contractId: string;
  userRole: string;
}

interface PropsPending {
  toUser: string;
  toUserId: string;
  contractId: string;
}

function ActionBtns({ toUser, toUserId, userRole, contractId }: Props) {
  const navigate = useNavigate();
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isProposer, setIsProposer] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;
  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Proposer') {
          setIsProposer(true);
        }
      });
    }
  }, [userLabelsData]);
  const [deleteContractMutation] = useMutation(DELETE_CONTRACT);
  const [open, setOpen] = React.useState(false);
  function handleClose() {
    setOpen(false);
  }
  const deleteContract = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await deleteContractMutation({
        variables: {
          id: contractId,
          status: 'REMOVED',
        },
      });
      deleteCloseModal();
      Swal.fire({
        title: 'Contact Deleted',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [deleteContractMutation]);
  const [deleteModalOpen, setDeleteModal] = React.useState<any>(false);
  const deleteCloseModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    deleteContract;
    deleteContractMutation;
    setDeleteModal;
    deleteOpenModal;
  }, [deleteContract, deleteContractMutation, setDeleteModal]);
  const deleteOpenModal = () => {
    setDeleteModal(true);
  };
  const deleteModalStyle = {
    position: 'relative',
    top: '50%',
    left: '50%',
    width: 500,
    transform: 'translate(100%, 100%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const sendFeedback = () => {
    setOpen(true);
  };

  return (
    <Box>
      <Modal
        open={deleteModalOpen}
        onClose={deleteCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: '200px', height: '200px' }}
      >
        <Box sx={deleteModalStyle}>
          {/* <ReturnButton /> */}
          <IconButton onClick={deleteCloseModal}>X</IconButton>
          <Typography id="modal-modal-description" sx={{ p: 4 }}>
            Are you sure you want to delete this contact from your list?
          </Typography>
          <Button
            sx={{
              border: '1px solid var(--primaryBlue)',
              borderRadius: '5px',
              width: '100%',
              padding: '5px',
              textTransform: 'none',
              bgcolor: '#263560',
            }}
            onClick={deleteContract}
            variant="contained"
          >
            DELETE
          </Button>
        </Box>
      </Modal>
      <FeedbackModal open={open} handleClose={handleClose} userRole={userRole} userName={toUser} />
      <Tooltip title="Rate">
        <IconButton onClick={sendFeedback}>
          <StarBorderIcon />
        </IconButton>
      </Tooltip>
      <SendMessageModal toUser={toUser} />
      <Tooltip title="Report">
        <IconButton onClick={() => navigate(`/flag/${toUserId}`)}>
          <OutlinedFlagTwoToneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton>
          <DeleteForeverOutlinedIcon onClick={deleteOpenModal} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ActionBtnsAccepted({ toUser, toUserId, userRole, contractId }: Props) {
  const navigate = useNavigate();
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isProposer, setIsProposer] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;
  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Proposer') {
          setIsProposer(true);
        }
      });
    }
  }, [userLabelsData]);
  const [deleteContractMutation] = useMutation(DELETE_CONTRACT);
  const [open, setOpen] = React.useState(false);
  function handleClose() {
    setOpen(false);
  }
  const deleteContract = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await deleteContractMutation({
        variables: {
          id: contractId,
          status: 'REMOVED',
        },
      });
      deleteCloseModal();
      Swal.fire({
        title: 'Contact Deleted',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [deleteContractMutation]);
  const [deleteModalOpen, setDeleteModal] = React.useState<any>(false);
  const deleteCloseModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    deleteContract;
    deleteContractMutation;
    setDeleteModal;
    deleteOpenModal;
  }, [deleteContract, deleteContractMutation, setDeleteModal]);
  const deleteOpenModal = () => {
    setDeleteModal(true);
  };
  const deleteModalStyle = {
    position: 'relative',
    top: '50%',
    left: '50%',
    width: 500,
    transform: 'translate(100%, 100%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const sendFeedback = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Modal
        open={deleteModalOpen}
        onClose={deleteCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: '200px', height: '200px' }}
      >
        <Box sx={deleteModalStyle}>
          {/* <ReturnButton /> */}

          <IconButton onClick={deleteCloseModal}>X</IconButton>
          <Typography id="modal-modal-description" sx={{ p: 4 }}>
            Are you sure you want to delete this contact from your list?
          </Typography>
          <Button
            sx={{
              border: '1px solid var(--primaryBlue)',
              borderRadius: '5px',
              width: '100%',
              padding: '5px',
              textTransform: 'none',
              bgcolor: '#263560',
            }}
            onClick={deleteContract}
            variant="contained"
          >
            DELETE
          </Button>
        </Box>
      </Modal>
      <FeedbackModal open={open} handleClose={handleClose} userRole={userRole} userName={toUser} />
      <Tooltip title="Rate">
        <IconButton onClick={sendFeedback}>
          <StarBorderIcon />
        </IconButton>
      </Tooltip>
      <SendMessageModal toUser={toUser} />
      <Tooltip title="Report">
        <IconButton onClick={() => navigate(`/flag/${toUserId}`)}>
          <OutlinedFlagTwoToneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={deleteOpenModal}>
          <DeleteForeverOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ActionBtnsPending({ toUser, contractId }: PropsPending) {
  const [acceptContractMutation] = useMutation(UPDATE_CONTRACT);
  const [rejectContractMutation] = useMutation(UPDATE_CONTRACT);
  const acceptContract = useCallback(async (): Promise<boolean> => {
    try {
      await acceptContractMutation({
        variables: {
          id: contractId,
          status: 'ACCEPTED',
        },
      });
      Swal.fire({
        title: 'Request Accepted!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        // didDestroy: () => {
        //   return window.location.reload();
        // },
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [acceptContractMutation]);

  const rejectContract = useCallback(async (): Promise<boolean> => {
    try {
      await rejectContractMutation({
        variables: {
          id: contractId,
          status: 'REJECTED',
        },
      });
      Swal.fire({
        title: 'Request Rejected!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        // didDestroy: () => {
        //   return window.location.reload();
        // },
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [rejectContractMutation]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tooltip title="Accept Request">
        <IconButton onClick={acceptContract}>
          <CheckCircleOutlineIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Cancel Request">
        <IconButton onClick={rejectContract}>
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ActionBtnsPendingSent({ contractId }: PropsPending) {
  const [deleteContractMutation] = useMutation(UPDATE_CONTRACT);
  const deleteContract = useCallback(async (): Promise<boolean> => {
    try {
      await deleteContractMutation({
        variables: {
          id: contractId,
          status: 'REMOVED',
        },
      });
      Swal.fire({
        title: 'Request Canceled',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        // didDestroy: () => {
        //   return window.location.reload();
        // },
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [deleteContractMutation]);
  return (
    <Box sx={{ width: '100%' }}>
      <Tooltip title="Cancel Request">
        <IconButton onClick={deleteContract}>
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function InteractionsTable() {
  /* const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false); */
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const { username } = useNetworkAuth();
  const [modalOpen, setModal] = React.useState<any>(false);
  const [proposalsContracts, setProposalsContracts] = React.useState<any>([]);
  const [mentoringContracts, setMentoringContracts] = React.useState<any>([]);
  const [rejProposalsContracts, setRejProposalsContracts] = React.useState<any>([]);
  const [rejMentoringContracts, setRejMentoringContracts] = React.useState<any>([]);
  const [proposalsPendingContracts, setProposalsPendingContracts] = React.useState<any>([]);
  const [sentProposalsPendingContracts, setSentProposalsPendingContracts] = React.useState<any>([]);
  const [mentoringPendingContracts, setMentoringPendingContracts] = React.useState<any>([]);
  const [sentMentoringPendingContracts, setSentMentoringPendingContracts] = React.useState<any>([]);

  const [fetchContracts, { data, loading }] = useLazyQuery(GET_MY_ACC_PROPOSALS_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchMentoringContracts, { data: mentoringContractsData, loading: mentoringLoading }] = useLazyQuery(
    GET_MY_ACC_MENTORING_CONTRACTS,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );
  const [fetchRejContracts, { data: rejContracts }] = useLazyQuery(GET_MY_REJ_PROPOSALS_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchRejMentoringContracts, { data: rejMentoringContractsData }] = useLazyQuery(GET_MY_REJ_MENTORING_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  const fetchAllContracts = useCallback(() => {
    fetchContracts({ variables: { username } });
    fetchMentoringContracts({ variables: { username } });
    fetchRejContracts({ variables: { username } });
    fetchRejMentoringContracts({ variables: { username } });
  }, [fetchContracts, fetchMentoringContracts, fetchRejContracts, fetchRejMentoringContracts, username]);

  useEffect(() => {
    fetchAllContracts();
    fetchMentoringContracts;
  }, [username, fetchAllContracts, fetchMentoringContracts]);

  useEffect(() => {
    setProposalsContracts(data);
    setMentoringContracts(mentoringContractsData);
    setRejProposalsContracts(rejContracts);
    setRejMentoringContracts(rejMentoringContractsData);
    mentoringContracts;
    proposalsContracts;
  }, [data, mentoringContractsData, rejContracts, rejMentoringContractsData, mentoringContracts, proposalsContracts]);

  const [fetchPendingContracts, { data: pendingContracts }] = useLazyQuery(GET_MY_PENDING_MENTORING_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchSentPendingContracts, { data: sentContracts }] = useLazyQuery(GET_MY_PENDING_SENT_MENTORING_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchMentoringPendingContracts, { data: mentoringPendingContractsData }] = useLazyQuery(GET_MY_PENDING_PROPOSALS_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchPendingProposerContracts, { data: pendingProposerContractsData }] = useLazyQuery(GET_MY_PENDING_PROPOSER_CONTRACTS, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
  const [fetchSentMentoringPendingContracts, { data: sentMentoringPendingContractsData }] = useLazyQuery(
    GET_MY_PENDING_SENT_PROPOSALS_CONTRACTS,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );
  const [fetchPendingCollaboratorSentContracts, { data: pendingCollaboratorSentContracts }] = useLazyQuery(
    GET_COLLABORATOR_PENDING_SENT_CONTRACT,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );

  const [fetchAccCollaboratorSentContracts, { data: accCollaboratorSentContracts }] = useLazyQuery(GET_COLLABORATOR_ACC_SENT_CONTRACT, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  const [fetchRejCollaboratorSentContracts, { data: rejCollaboratorSentContracts }] = useLazyQuery(GET_COLLABORATOR_REJ_SENT_CONTRACT, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  const [fetchPendingProposerReceivedContracts, { data: pendingProposerReceivedContracts }] = useLazyQuery(
    GET_PROPOSER_PENDING_RECEIVED_COLLABORATOR_CONTRACT,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );

  const [fetchAccProposerReceivedContracts, { data: accProposerReceivedContracts }] = useLazyQuery(
    GET_PROPOSER_ACC_RECEIVED_COLLABORATOR_CONTRACT,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );

  const [fetchRejProposerReceivedContracts, { data: rejProposerReceivedContracts }] = useLazyQuery(
    GET_PROPOSER_REJ_RECEIVED_COLLABORATOR_CONTRACT,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );
  const [fetchPendingProposerSentContracts, { data: pendingProposerSentContracts }] = useLazyQuery(
    GET_PROPOSER_PENDING_SENT_COLLABORATOR_CONTRACT,
    {
      pollInterval: 3000,
      fetchPolicy: 'network-only',
    },
  );

  const [fetchAccProposerSentContracts, { data: accProposerSentContracts }] = useLazyQuery(GET_PROPOSER_ACC_SENT_COLLABORATOR_CONTRACT, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  const [fetchRejProposerSentContracts, { data: rejProposerSentContracts }] = useLazyQuery(GET_PROPOSER_REJ_SENT_COLLABORATOR_CONTRACT, {
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  const fetchAllPendingContracts = useCallback(() => {
    fetchPendingContracts({ variables: { username } });
    fetchSentPendingContracts({ variables: { username } });
    fetchMentoringPendingContracts({ variables: { username } });
    fetchSentMentoringPendingContracts({ variables: { username } });
    fetchPendingProposerContracts({ variables: { username } });
    fetchPendingCollaboratorSentContracts({ variables: { collaborator: username } });
    fetchAccCollaboratorSentContracts({ variables: { collaborator: username } });
    fetchRejCollaboratorSentContracts({ variables: { collaborator: username } });
    fetchPendingProposerReceivedContracts({ variables: { proposer: username } });
    fetchAccProposerReceivedContracts({ variables: { proposer: username } });
    fetchRejProposerReceivedContracts({ variables: { proposer: username } });
    fetchPendingProposerSentContracts({ variables: { proposer: username } });
    fetchAccProposerSentContracts({ variables: { proposer: username } });
    fetchRejProposerSentContracts({ variables: { proposer: username } });
  }, [fetchPendingContracts, fetchSentPendingContracts, fetchMentoringPendingContracts, fetchSentMentoringPendingContracts, username]);

  useEffect(() => {
    fetchAllPendingContracts();
  }, [username]);

  useEffect(() => {
    setProposalsPendingContracts(pendingContracts);
    setSentProposalsPendingContracts(sentContracts);
    setMentoringPendingContracts(mentoringPendingContractsData);
    setSentMentoringPendingContracts(sentMentoringPendingContractsData);
  }, [pendingContracts, mentoringPendingContractsData, sentContracts, sentMentoringPendingContractsData]);

  const closeModal = () => {
    setModal('');
  };

  if (loading || mentoringLoading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }
  return (
    <>
      <TableContainer
        sx={{ border: '2px solid grey', borderRadius: '7px', maxHeight: '80vh', overflowY: 'auto', marginBottom: '100px' }}
        component={Paper}
      >
        <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
          <Alert severity="success" variant="filled" onClose={() => setShowSnackbar(false)}>
            Feedback Sent!
          </Alert>
        </Snackbar>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Relationship</TableCell>
              <TableCell align="center">Proposal/Task</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Request</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row: any, i: number) => { */}
            {mentoringPendingContracts?.Contract?.map((row: any, i: number) => {
              if (mentoringPendingContracts?.Contract[i]?.relatedProposal?.proposedBy.username !== username) {
                return (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                      <Modal
                        open={modalOpen === `modal mentor ${i}`}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <ContactInfo
                          name={row?.mentor?.username}
                          proposalName={row?.relatedProposal?.title}
                          status={row?.status}
                          contractID={row?.id}
                          agreementText={row?.terms}
                          relationship={'Mentor'}
                          handleClose={closeModal}
                        />
                      </Modal>
                      <Typography>{row?.mentor?.username}</Typography>
                    </TableCell>
                    <TableCell align="center">{'Proposer'}</TableCell>
                    <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          height: '25px',
                          borderRadius: '12.5px',
                          backgroundColor: 'rgba(228, 149, 66, 0.3)',
                          width: 'auto',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                        }}
                      >
                        {row?.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {<ActionBtnsPendingSent toUser={row?.mentor?.username} toUserId={row?.mentor?.id} contractId={row?.id} />}
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      {<ActionBtns toUser={row?.mentor?.username} toUserId={row?.mentor?.id} userRole={'Proposer'} contractId={row?.id} />}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
            {/*SENT MENTOR APPLY IN PROPOSAL */}
            {sentMentoringPendingContractsData?.Contract?.map((row: any, i: number) => {
              if (sentMentoringPendingContractsData?.Contract[i]?.relatedProposal?.proposedBy?.username !== username) {
                return (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                      <Modal
                        open={modalOpen === `modal mentor ${i}`}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <ContactInfo
                          name={row?.mentor?.username}
                          proposalName={row?.relatedProposal?.title || ''}
                          status={row?.status}
                          agreementText={row?.terms}
                          contractID={row?.id}
                          relationship={'Mentoree'}
                          handleClose={closeModal}
                        />
                      </Modal>
                      <Typography>{row?.mentor?.username}</Typography>
                    </TableCell>
                    <TableCell align="center">{'Mentoree'}</TableCell>
                    <TableCell align="center">{row?.relatedProposal?.title || 'None'}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          height: '25px',
                          borderRadius: '12.5px',
                          backgroundColor: 'rgba(228, 149, 66, 0.3)',
                          width: 'auto',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                        }}
                      >
                        {row?.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {<ActionBtnsPendingSent toUser={row?.mentor?.username} toUserId={row?.mentor?.id} contractId={row?.id} />}
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      {<ActionBtns toUser={row?.mentor?.username} toUserId={row?.mentor?.id} userRole={'Mentor'} contractId={row?.id} />}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
            {/* proposer sent request to mentor! */}
            {proposalsPendingContracts?.Contract?.map((row: any, i: number) => {
              if (proposalsPendingContracts?.Contract[i]?.relatedProposal?.proposedBy?.username !== username) {
                return (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                      <Modal
                        open={modalOpen === `modal mentor ${i}`}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <ContactInfo
                          name={row?.mentor?.username}
                          proposalName={row?.relatedProposal?.title || ''}
                          status={row?.status}
                          agreementText={row?.terms}
                          contractID={row?.id}
                          relationship={'Mentoree'}
                          handleClose={closeModal}
                        />
                      </Modal>
                      <Typography>{row?.mentor?.username}</Typography>
                    </TableCell>
                    <TableCell align="center">{'Mentoree'}</TableCell>
                    <TableCell align="center">{row?.relatedProposal?.title || 'None'}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          height: '25px',
                          borderRadius: '12.5px',
                          backgroundColor: 'rgba(228, 149, 66, 0.3)',
                          width: 'auto',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                        }}
                      >
                        {row?.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {<ActionBtnsPending toUser={row?.mentor?.username} toUserId={row?.mentor?.id} contractId={row?.id} />}
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      {<ActionBtns toUser={row?.mentor?.username} toUserId={row?.mentor?.id} userRole={'Mentor'} contractId={row?.id} />}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
            {/* end PROPOSER send REQ a MENTOR */}
            {/* {pendingProposerContractsData?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal mentor ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row.collaborator?.username}
                        proposalName={row.relatedProposal?.title || 'None'}
                        status={row?.status}
                        contractID={row.id}
                        agreementText={row.terms}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentor'}</TableCell>
                  <TableCell align="center">{row.relatedProposal?.title || 'None'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(228, 149, 66, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {<ActionBtnsPending toUser={row?.collaborator?.username} toUserId={row?.collaborator?.id} contractId={row?.id} />}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })} */}
            {mentoringContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal mentor ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.mentor?.username}
                        proposalName={row?.relatedProposal?.title || ''}
                        status={row?.status}
                        contractID={row?.id}
                        agreementText={row?.terms}
                        relationship={'Mentor'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.mentor?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentor'}</TableCell>
                  <TableCell align="center">{row?.relatedProposal?.title || 'None'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(56, 208, 89, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Agreement">
                      <IconButton>
                        <PostAddIcon onClick={() => setModal(`modal proposer ${i}`)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsAccepted
                        toUser={row.proposer.username || ''}
                        toUserId={row.proposer.id || ''}
                        userRole={'Proposer'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {rejMentoringContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal mentor ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.proposer?.username}
                        proposalName={row?.relatedProposal?.title}
                        status={row?.status}
                        contractID={row?.id}
                        agreementText={row?.terms}
                        relationship={'Mentor'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.proposer?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentor'}</TableCell>
                  <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(196, 196, 196, 0.5)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {<ActionBtns toUser={row?.proposer?.username} toUserId={row?.proposer?.id} userRole={'Mentor'} contractId={row?.id} />}
                  </TableCell>
                </TableRow>
              );
            })}
            {/* {rows.map((row: any, i: number) => { */}
            {proposalsContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.mentor?.username}
                        proposalName={row?.relatedProposal?.title}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Mentoree'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.mentor?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentoree'}</TableCell>
                  <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(56, 208, 89, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Agreement">
                      <IconButton>
                        <PostAddIcon onClick={() => setModal(`modal proposer ${i}`)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsAccepted
                        toUser={row.mentor?.username}
                        toUserId={row.mentor?.id}
                        userRole={'Mentor'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}

            {rejProposalsContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.mentor?.username}
                        proposalName={row?.relatedProposal?.title}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Mentoree'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.mentor?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentoree'}</TableCell>
                  <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(196, 196, 196, 0.5)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {<ActionBtns toUser={row.mentor?.username} toUserId={row.mentor?.id} userRole={'Proposer'} contractId={row?.id} />}
                  </TableCell>
                </TableRow>
              );
            })}

            {sentMentoringPendingContracts?.Contract?.map((row: any, i: number) => {
              if (sentMentoringPendingContracts?.Contract[i]?.relatedProposal?.proposedBy?.username !== username) {
                return (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                      <Modal
                        open={modalOpen === `modal mentor ${i}`}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <ContactInfo
                          name={row?.mentor?.username}
                          proposalName={row?.relatedProposal?.title}
                          status={row?.status}
                          contractID={row?.id}
                          agreementText={row?.terms}
                          relationship={'Mentor'}
                          handleClose={closeModal}
                        />
                      </Modal>
                      <Typography>{row?.mentor?.username}</Typography>
                    </TableCell>
                    <TableCell align="center">{'Mentor'}</TableCell>
                    <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                    <TableCell align="center">
                      {' '}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          height: '25px',
                          borderRadius: '12.5px',
                          backgroundColor: 'rgba(228, 149, 66, 0.3)',
                          width: 'auto',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '5px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                        }}
                      >
                        {row?.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {<ActionBtnsPendingSent toUser={row?.mentor?.username} toUserId={row?.mentor?.id} contractId={row?.id} />}
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      {<ActionBtns toUser={row?.mentor?.username} toUserId={row?.mentor?.id} userRole={'Proposer'} contractId={row?.id} />}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
            {sentProposalsPendingContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.proposer?.username}
                        proposalName={row?.relatedProposal?.title || null}
                        status={row?.status || null}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Mentoree'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.proposer?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Mentoree'}</TableCell>
                  <TableCell align="center">{row?.relatedProposal?.title}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(228, 149, 66, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {<ActionBtnsPendingSent toUser={row?.proposer?.username} toUserId={row?.proposer?.id} contractId={row?.id} />}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row?.proposer?.username}
                        toUserId={row?.proposer?.id}
                        userRole={'Proposer'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {/* COLLABORATORS INIT */}
            {pendingCollaboratorSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.relatedTask?.forProposal?.proposedBy?.username || ''}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Proposer'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.relatedTask?.forProposal?.proposedBy?.username || ''}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(228, 149, 66, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsPending
                        toUser={row.relatedTask?.forProposal?.proposedBy?.username || ''}
                        toUserId={row.relatedTask?.forProposal?.proposedBy?.id}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row.relatedTask?.forProposal?.proposedBy?.username || ''}
                        toUserId={row.relatedTask?.forProposal?.proposedBy?.id}
                        userRole={'Proposer'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {accCollaboratorSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.relatedTask?.forProposal?.proposedBy?.username || ''}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Proposer'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.relatedTask?.forProposal?.proposedBy?.username || ''}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(56, 208, 89, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Agreement">
                      <IconButton>
                        <PostAddIcon onClick={() => setModal(`modal proposer ${i}`)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsAccepted
                        toUser={row.relatedTask?.forProposal?.proposedBy?.username || ''}
                        toUserId={row.relatedTask?.forProposal?.proposedBy?.id || ''}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {rejCollaboratorSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.relatedTask?.forProposal?.proposedBy?.username || ''}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Proposer'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.relatedTask?.forProposal?.proposedBy?.username || ''}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(196, 196, 196, 0.5)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row.relatedTask?.forProposal?.proposedBy?.username || ''}
                        toUserId={row.relatedTask?.forProposal?.proposedBy?.id || ''}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {/* COLLABORATORS END */}
            {pendingProposerReceivedContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(228, 149, 66, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {<ActionBtnsPendingSent toUser={row?.collaborator?.username} toUserId={row?.collaborator?.id} contractId={row?.id} />}
                  </TableCell>
                  <TableCell align="center">
                    {/* {<ActionBtnsPendingSent toUser={row?.collaborator?.username} toUserId={row?.collaborator?.id} contractId={row?.id} />} */}
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {accProposerReceivedContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(56, 208, 89, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Agreement">
                      <IconButton>
                        <PostAddIcon onClick={() => setModal(`modal proposer ${i}`)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsAccepted
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {rejProposerReceivedContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(196, 196, 196, 0.5)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}

            {pendingProposerSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row.terms}
                        contractID={row.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(228, 149, 66, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {<ActionBtnsPendingSent toUser={row?.collaborator?.username} toUserId={row?.collaborator?.id} contractId={row?.id} />}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {accProposerSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(56, 208, 89, 0.3)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Agreement">
                      <IconButton>
                        <PostAddIcon onClick={() => setModal(`modal proposer ${i}`)} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtnsAccepted
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
            {rejProposerSentContracts?.Contract?.map((row: any, i: number) => {
              return (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row" sx={{ justifyContent: 'center' }}>
                    <Modal
                      open={modalOpen === `modal proposer ${i}`}
                      onClose={closeModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <ContactInfo
                        name={row?.collaborator?.username}
                        proposalName={row?.relatedTask?.title || 'No Task'}
                        status={row?.status}
                        agreementText={row?.terms}
                        contractID={row?.id}
                        relationship={'Collaborator'}
                        handleClose={closeModal}
                      />
                    </Modal>
                    <Typography>{row?.collaborator?.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{'Collaborator'}</TableCell>
                  <TableCell align="center">{row?.relatedTask?.title || 'No Task'}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '25px',
                        borderRadius: '12.5px',
                        backgroundColor: 'rgba(196, 196, 196, 0.5)',
                        width: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '5px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {row?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {
                      <ActionBtns
                        toUser={row?.collaborator?.username}
                        toUserId={row?.collaborator?.id}
                        userRole={'Collaborator'}
                        contractId={row?.id}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(229, 229, 229, 1)',
  borderRadius: '10px',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
  width: '20%',
  maxWidth: '700px',
  maxHeight: '100%',
  marginRight: '25px',
};

interface State {
  id: string;
  //   fund: number;
  //   title: string;
  isActive: boolean;
}

const ModalAddSmartTip = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    // fund: Number(0),
    // title: '',
    isActive: true,
  });

  const navigate = useNavigate();
  return (
    <>
      <AddCircleIcon
        sx={{
          cursor: 'pointer',
          width: '50px',
          height: '50px',
          color: 'var(--primaryBlue)',
          mb: 3,
        }}
        onClick={() => {
          navigate('/admin/smart-tips/proposal');
        }}
      />
    </>
  );
};

export default ModalAddSmartTip;

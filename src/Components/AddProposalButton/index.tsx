import { default as MuiFab } from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function AddProposalButton({ setComponentToShow }: { setComponentToShow: (component: string) => void }) {
  return (
    <MuiFab
      sx={{ backgroundColor: 'var(--primaryBlue)', position: 'relative' }}
      size="large"
      aria-label="Add proposal"
      onClick={() => {
        setComponentToShow('AddProposalForm');
      }}
    >
      <AddIcon sx={{ color: 'white' }} />
    </MuiFab>
  );
}

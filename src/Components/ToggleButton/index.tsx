import { default as MuiButton } from '@mui/material/Button';
import styled from '@mui/system/styled';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useMediaQuery } from '@mui/material';
// import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface Choice {
  label: string;
  value: string;
}

export interface ToggleButtonProps {
  onToggle: (choice: Choice) => void;
  choices: Choice[];
  selected: number;
}

const Button = styled(MuiButton)`
  border-radius: 16px;
  min-width: 125px;
  height: 32px;
  text-align: center;
`;
// const AddCircleIcon = styled(MuiButton)`
//   border-radius: 20px;
// `;
export default function ToggleButton({ onToggle, choices, selected = 0 }: ToggleButtonProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <Stack
      sx={{
        flexWrap: 'wrap',
        minHeight: '80px',
      }}
      spacing={4}
      direction={isMobile ? 'column' : 'row'}
      alignItems="left"
      justifyContent="flex-start"
    >
      {choices.map((choice, i) => {
        return (
          <Button
            key={choice.value}
            variant="contained"
            onClick={() => {
              onToggle(choice);
            }}
            sx={{
              bgcolor: i === selected ? 'var(--primaryBlue)' : 'var(--inactiveGray)',
              '&:hover': { color: i === selected ? 'var(--textField-bg: #d9d9d9)' : '#ffffff !important' },
              color: i === selected ? '#ffffff' : '#000000',
              fontWeight: 400,
              textTransform: 'none',
            }}
          >
            {choice.label}
          </Button>
        );
      })}
    </Stack>
  );
}

import Box from '@mui/material/Box';

interface MyProjectContainerProps {
  children: React.ReactNode;
}

const MyProjectContainer = ({ children }: MyProjectContainerProps) => {
  return (
    <Box sx={{ bgcolor: '#FFFFFF' }}>
      {/* We don't know what children is, it could be a Card or a div or something */}
      {children}
    </Box>
  );
};

export default MyProjectContainer;

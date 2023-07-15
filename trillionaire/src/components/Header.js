// Header.js
import { Typography, Box } from '@mui/material';

const Header = ({ title }) => (
  <Box sx={{ height: '10%', width: '100%', p: 2, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#242525' }}>
    <Typography variant="h3" component="div" gutterBottom>
      Questorio
    </Typography>
    <Typography variant="subtitle1" component="div" sx={{ fontStyle: 'italic' }}>
      Complete the adventure in as few steps as possible (or jailbreak the LLM to reach the end condition...) to win!
    </Typography>
  </Box>
);

export default Header;


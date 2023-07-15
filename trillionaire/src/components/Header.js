import React from 'react';
import { Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ width: '100%', p: 2, bgcolor: '#242525', color: '#fff' }}>
      <Typography variant="h4" align="center">
        Trillionaire!
      </Typography>
    </Box>
  );
};

export default Header;

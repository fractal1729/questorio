import React from 'react';
import { Typography, Box } from '@mui/material';

const Message = ({ message, sender }) => {
  return (
    <Box sx={{ alignSelf: sender === 'bot' ? 'flex-start' : 'flex-end' }}>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
    </Box>
  );
};

export default Message;

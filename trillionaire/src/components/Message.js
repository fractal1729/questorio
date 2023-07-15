import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const Message = ({ message, sender }) => {
  const isBot = sender === 'assistant';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: isBot ? 'flex-start' : 'flex-start' }}>
      <Avatar>{isBot ? 'B' : 'U'}</Avatar>
      <Typography variant="body1" sx={{ color: '#fff' }}>{message}</Typography>
    </Box>
  );
};

export default Message;

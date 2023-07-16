import React from 'react';
import botImage from '../assets/bot.png';
import { Box, Typography, Avatar } from '@mui/material';

const Message = ({ message, sender }) => {
  const isBot = sender === 'assistant';

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'flex-start', // This aligns the items to the start of the container (top for column direction)
        justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
        alignSelf: isBot ? 'flex-start' : 'flex-start',
        gap: '10px',
        mb: 1,
      }}
    >
      <Avatar sx={{ bgcolor: sender === 'user' ? 'primary.main' : 'secondary.main' }}>
        {sender === 'user' ? 'U' : <img src={botImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bot" />}
      </Avatar>
      <Typography variant="body1" component="p" sx={{ color: '#fff' }}>
        {message.split('\n').map((line, i) => 
          <span key={i}>
            {line}
            <br />
          </span>
        )}
      </Typography>
    </Box>
  );
};

export default Message;

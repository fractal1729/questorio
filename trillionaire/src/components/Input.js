import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const Input = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = (event) => {
    // Prevent the form from refreshing the page on submit
    event.preventDefault();

    // Do nothing if the message is empty
    if (!message.trim()) {
      return;
    }

    onSend(message);
    setMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', justifyContent: 'center', gap: '10px', p: 1 }}>
      <TextField value={message} onChange={e => setMessage(e.target.value)} label="Type your message..." variant="outlined" />
      <Button type="submit" variant="contained">Send</Button>
    </Box>
  );
};

export default Input;

// Input.js
import React, { useState } from 'react';
import { Box, TextField, IconButton, Grid } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Input = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(false);

  const handleSend = async (event) => {
    // Prevent the form from refreshing the page on submit
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setFetching(true);
    setMessage('');
    await onSend(message);
    setFetching(false);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSend} 
      sx={{  
        bottom: 0, 
        width: '50%', 
        display: 'flex',
        justifyContent: 'center', 
        gap: '10px', 
        p: 1, 
        bgcolor: '#242525'
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <TextField 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            multiline 
            maxRows={4}
            variant="outlined" 
            fullWidth 
            sx={{ 
              color: '#fff', 
              '& .MuiOutlinedInput-input': {
                color: '#fff'
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
              },
            }}
            inputProps={{
              maxLength: 50,
            }}
            helperText={`${message.length}/50`}
            FormHelperTextProps={{ style: { color: message.length > 50 ? '#ff0000' : '#ffffff' } }}
            focused
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton type="submit" color="primary" disabled={fetching}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Input;

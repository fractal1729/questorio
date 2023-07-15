import React, { useState } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Chatbox from './components/Chatbox';
import Input from './components/Input';

function App() {
  const [chat, setChat] = useState([]);

  const handleSend = (message) => {
    setChat([...chat, { message, sender: 'user' }]);
    setTimeout(() => {
      setChat((prevChat) => [...prevChat, { message: 'I am a bot', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <Container>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Chatbox chat={chat} />
        <Input onSend={handleSend} />
      </Box>
    </Container>
  );
}

export default App;

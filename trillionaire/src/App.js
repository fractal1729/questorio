import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';
import Header from './components/Header';
import Chatbox from './components/Chatbox';
import Input from './components/Input';

const App = () => {
  const [chat, setChat] = useState([]);

  const handleSend = (message) => {
    setChat([...chat, { message, sender: 'user' }, { message: 'This is an automated message', sender: 'bot' }]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#242525', height: '100%', width: '100%', position: 'absolute' }}>
      <Header />
      <Chatbox chat={chat} />
      <Divider sx={{ height: '2px', bgcolor: 'primary.main' }} />
      <Input onSend={handleSend} />
    </Box>
  );
};

export default App;

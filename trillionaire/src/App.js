import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import Chatbox from './components/Chatbox';
import Input from './components/Input';

const App = () => {
  const [chat, setChat] = useState([]);

  const handleSend = (message) => {
    setChat([...chat, { message, sender: 'user' }, { message: 'This is an automated message', sender: 'bot' }]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', bgcolor: '#242525' }}>
      <Header />
      <Chatbox chat={chat} />
      <Input onSend={handleSend} />
    </Box>
  );
};

export default App;

import React, { useState } from 'react';
import Confetti from 'react-confetti';

import { Box, Divider } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Header from './components/Header';
import Chatbox from './components/Chatbox';
import Input from './components/Input';

const App = () => {
  const [chat, setChat] = useState([]);
  const [numMessages, setNumMessages] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);


  const handleSend = (message) => {
    setChat([...chat, { message, sender: 'user' }, { message: 'This is an automated message', sender: 'bot' }]);

    // Check if the user won
    if (botMessage.includes('you won')) {
      setWon(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000); // Confetti for 2 seconds
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#242525', height: '100%', width: '100%', position: 'absolute' }}>
      <Header />
      <Chatbox chat={chat} />
      <Divider sx={{ height: '2px', bgcolor: 'primary.main' }} />
      <Input onSend={handleSend} />
      {showConfetti && <Confetti />}
      <Dialog open={won}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>You won after {numMessages} messages!</DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;

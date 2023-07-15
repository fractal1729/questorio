import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

import { Box, Divider } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Header from './components/Header';
import Chatbox from './components/Chatbox';
import Input from './components/Input';
import { Configuration, OpenAIApi } from "openai";

let configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);
console.log(process.env.REACT_APP_OPENAI_API_KEY);

const App = () => {
  const [chat, setChat] = useState([]);
  const [numMessages, setNumMessages] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const init = async () => {
      const initialMessage = await getCompletion([]);
      setChat([
        { message: initialMessage, sender: 'assistant' },
      ]);
    };
    init();
  }, []);

  const handleSend = async (userMessage) => {
    const updatedChat = [...chat, { message: userMessage, sender: 'user' }];
    setChat(updatedChat);
    try {
      const gptMessage = await getCompletion(updatedChat);
      setChat([...updatedChat, { message: gptMessage, sender: 'assistant' }]);
      setNumMessages(numMessages + 1);
      
      // Check if the user won
      if (gptMessage.includes('you won')) {
        setWon(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000); // Confetti for 2 seconds
      }
    }
    catch (e) {
      console.error(e);
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

async function getCompletion(chat) {
  console.log(chat);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Your task is to run a text adventure for the user. The user will be able to type in commands to interact with the world. The user wins if they get to the end of the game. The user loses if they die. The user can also type in 'help' to get a list of commands."},
      ...chat.map((message) => ({ role: message.sender, content: message.message })),
    ],
    temperature: 0.8,
  });
  console.log(response);
  const { choices } = response.data;
  return choices[0].message.content;
}

export default App;

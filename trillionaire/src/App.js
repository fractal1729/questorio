import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

import { Box, Divider } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


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
      if (gptMessage.toLowerCase().includes('you won') || gptMessage.toLowerCase().includes("you've won") || gptMessage.toLowerCase().includes('you have won') || gptMessage.toLowerCase().includes('Congratulations!')) {
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
        <DialogActions>
          <Button onClick={() => {
            setWon(false);
            setNumMessages(0);
            setShowConfetti(false);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

async function getCompletion(chat) {
  console.log(chat);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `
      You are a text adventure game assistant, the game is called "The Game of Life"  
      Game setup: 
      0. Ask user's input for a role gamer wants to play 
      1. Ask the goal gamer wants to reach
      2. Ask for the type of adventure gamer likes to play 
      3. For each round, you will prompt user with 3 options of actions, and a 4th one as "random" move. When user pick option 4 s/he need to input the random action s/he want to take. After each user's action, you will evaluate the probability of user reaching their goal and report back that probability number. 
      4. The response format for each round will be like this:
      "--- Round [number], [number] rounds left, probability of reaching your goal of [user's input] is [a number btw 0% and 100% you calculated] --- \n
      Hello gamer, you are now [fill in gamer's current situation]. As next step, what you will do? \n
      option 1: ...\n
      option 2:...\n
      option 3: ...\n
      option 4: Your random move\n
      "
      5. For each round, if the probability is lower than 10%, you end the game and call it "GAME OVER". If the probability is greater than 90%, you end the game and call it "YOU WON". Otherwise keep the game going by repeating rule 3.
      6. When the number of rounds reaches 10, end the game and call it "Good luck next time!"
      7. If user's prompt is "STOP", end the game and ask user if he or she wants to start over.
      8. When game is over, generate a PDF of the game chat history for the user.
      `},
      ...chat.map((message) => ({ role: message.sender, content: message.message })),
    ],
    temperature: 0.1,
  });
  console.log(response);
  const { choices } = response.data;
  return choices[0].message.content;
}

export default App;

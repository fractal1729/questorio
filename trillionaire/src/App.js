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
const DIFFICULTY = 1.3;

const App = () => {
  const [chat, setChat] = useState([]);
  const [validChat, setValidChat] = useState([]);
  const [numMessages, setNumMessages] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const init = async () => {
      const initialMessage = await getCompletion([]);
      setChat([
        { message: initialMessage, sender: 'assistant' },
      ]);
      setValidChat([
        { message: initialMessage, sender: 'assistant' },
      ]);
    };
    init();
  }, []);

  const handleSend = async (userMessage) => {
    let updatedChat = [...chat, { message: userMessage, sender: 'user' }];
    setChat(updatedChat);
    if (userMessage.length > 50) {
      setChat([...updatedChat, { message: 'Sorry, that action is too long. Please keep your action to 50 characters or less.', sender: 'assistant' }]);
      return;
    }
    try {
      const likelihoodString = await getLikelihood([...validChat, { message: userMessage, sender: 'user' }]);
      const percentProbability = Number(likelihoodString.match(/\d/g)?.join(''));
      if (likelihoodString.startsWith('Sorry, that action is invalid')) {
        setChat([...updatedChat, { message: likelihoodString, sender: 'assistant' }]);
        return;
      }
      const probability = percentProbability ? (percentProbability / 100) ** DIFFICULTY : 0;
      const actionRoll = Math.round(20.5 - (20 * Math.random()));
      const threshold = Math.round(20.5 - (probability * 20));
      const actionSuccess = actionRoll >= threshold;
      updatedChat = [...updatedChat, { message: 'Roll ' + actionRoll + ' ' + (actionSuccess ? 'passed' : 'failed') + ' threshold of ' + threshold + '/20.', sender: 'assistant' }];
      setChat(updatedChat);
      console.log('With difficulty mod of ' + DIFFICULTY + ', the required threshold is ' + threshold + '/20.');
      console.log('Player rolled ' + actionRoll + '/20. ' + (actionSuccess ? 'Action succeeds!' : 'Action fails.'));
      const gptMessage = await getCompletion(updatedChat, actionSuccess);
      setChat([...updatedChat, { message: gptMessage, sender: 'assistant' }]);
      setValidChat([...validChat, { message: userMessage, sender: 'user' }, { message: gptMessage, sender: 'assistant' }]);
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

async function getCompletion(chat, actionSuccess) {
  const successMessage = actionSuccess ? '\n\nGame Master: This action SUCCEEDS.' : '\n\nGame Master: This action FAILS due to unforseen circumstances.';
  const doctoredChat = chat.map((message, index) => ({ role: message.sender, content: getMessagePrefix(message.sender) + message.message + (index === chat.length - 1 ? successMessage : '') }))
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Your task is to run a text adventure for the player. The player will be able to type in any action that their character can take to interact with the world. The player wins if they get to the end of the game. The player loses if they die. Don't prescribe any possible moves; let the player figure it out on their own."},
      ...doctoredChat,
    ],
    temperature: 0.8,
  });
  const { choices } = response.data;
  return choices[0].message.content.replace(/Game Master:/g, '');
}

async function getLikelihood(chat) {
  const messageHistory = chat.map((message) => getMessagePrefix(message.sender) + message.message ).join('\n\n') + '\n\nWhat is the likelihood of this action being successful? Refer to the player as "you". Do not refer to the player in the third person.';
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      // { role: "system", content: "A player is playing a text adventure game in which they can type in short commands to interact with the world. You are given the full transcript of the game so far. Your task is to determine whether the player's most recent action is valid or not based on the current state of the world. If the action is valid, output how likely you think the action is to work, as a percentage probability from `0` to `100`. If the action is absurd or unrealistic, say `Sorry, that action is invalid`, and then explain why it is invalid. For example, an action that is valid but unsafe, such as jumping into an unknown body of water, could get a low success probability. An action that is very uncertain, e.g. if there is not information to determine the success probability, would get a low success probability but would still be valid. However only if an action is completely ridiculous and unrealistic, like magically obtaining superpowers out of nowhere, it should be invalid."},
      { role: "system", content: "A player is playing a text adventure game in which they can type in short commands to interact with the world. You are given the full transcript of the game so far. Your task is to determine the likelihood of success of the player's action, outputting how likely you think the action is to work, as a percentage probability from `0` to `100`."},
      { role: "user", content: messageHistory }
    ],
    temperature: 0.9,
  });
  const { choices } = response.data;
  const likelihoodString = choices[0].message.content;
  console.log(likelihoodString);
  return likelihoodString;
}

function getMessagePrefix(sender) {
  if (sender === 'user') {
    return 'Player action: ';
  }
  else {
    return 'Game Master: '
  }
}

export default App;
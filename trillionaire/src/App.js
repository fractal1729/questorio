import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';
import Header from './components/Header';
import Chatbox from './components/Chatbox';
import Input from './components/Input';
import { Configuration, OpenAIApi } from "openai";

let configuration = new Configuration({
  apiKey: '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',//process.env.OPENAI_API_KEY_SCALE_HACKDAY,
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);
console.log(openai);

const App = () => {
  const [chat, setChat] = useState([]);

  const handleSend = async (message) => {
    setChat([...chat, { message, sender: 'user' }]);
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are a helpful assistant."},
          ...chat.map((message) => ({ role: message.sender, content: message.message })),
        ],
        temperature: 0.8,
      });
      const { choices } = response.data;
      setChat((prevChat) => [...prevChat, { message: choices[0].message.content, sender: 'assistant' }]);
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
    </Box>
  );
};

export default App;

import React, { useState } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Chatbox from './components/Chatbox';
import Input from './components/Input';
import { Configuration, OpenAIApi } from "openai";

let configuration = new Configuration({
  apiKey: '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',//process.env.OPENAI_API_KEY_SCALE_HACKDAY,
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);
console.log(openai);

function App() {
  const [chat, setChat] = useState([]);

  const handleSend = async (message) => {
    setChat([...chat, { message, sender: 'user' }]);
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": message},
        ],
        temperature: 0.8,
      });
      const { choices } = response.data;
      setChat((prevChat) => [...prevChat, { message: choices[0].message.content, sender: 'bot' }]);
    }
    catch (e) {
      console.error(e);
    }
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

import React, { useState } from 'react';
import Chatbox from './components/Chatbox';
import Input from './components/Input';

function App() {
  const [chat, setChat] = useState([]);

  const handleSend = (message) => {
    setChat([...chat, { message, sender: 'user' }]);
    // API call to OpenAI should be made here, replacing the setTimeout function
    setTimeout(() => {
      setChat((prevChat) => [...prevChat, { message: 'I am a bot', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="App">
      <Chatbox chat={chat} />
      <Input onSend={handleSend} />
    </div>
  );
}

export default App;

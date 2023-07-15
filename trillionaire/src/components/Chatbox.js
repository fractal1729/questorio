import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Message from './Message';

const Chatbox = ({ chat }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <Box sx={{ width: '50%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', p: 1, bgcolor: '#242525', marginTop: 'auto'}}>
      {chat.map((message, index) => (
        <Message key={index} message={message.message} sender={message.sender} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default Chatbox;

import React from 'react';
import Message from './Message';

const Chatbox = ({ chat }) => (
  <div>
    {chat.map((message, index) => <Message key={index} message={message.message} sender={message.sender} />)}
  </div>
);

export default Chatbox;

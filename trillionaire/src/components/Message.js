import React from 'react';

const Message = ({ message, sender }) => {
  return (
    <div className={sender}>
      <p>{message}</p>
    </div>
  );
};

export default Message;

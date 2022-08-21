import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';

import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const [messages, setMessages] = useState(null);
  const { chatId } = useParams();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  useEffect(() => {
    
    // Get a database reference to our posts
    const ref = database.ref('/messages').orderByChild('roomId').equalTo(chatId);

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on(
      'value',
      snapshot => {
        const data = transformToArrayWithId(snapshot.val());
        setMessages(data);
      }
    );

    return () =>{
      ref.off();
    }
  },[chatId]);


  

  return <ul className='msg-list custom-scroll'>
    {isChatEmpty && <li>No messages yet</li>}
    
    {canShowMessage && messages.map(message => <MessageItem key={message.id} message={message} />)}
  </ul>;
};

export default Messages;

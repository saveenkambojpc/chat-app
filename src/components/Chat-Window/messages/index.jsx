import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
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
    const ref = database
      .ref('/messages')
      .orderByChild('roomId')
      .equalTo(chatId);

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on('value', snapshot => {
      const data = transformToArrayWithId(snapshot.val());
      setMessages(data);
    });

    return () => {
      ref.off();
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = "Admin Permission Removed"
          } else {
            admins[uid] = true;
            alertMsg = "Admin Permission Granted"
          }
        }
        return admins;
      });

      Alert.info(alertMsg,4000)
    },
    [chatId]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}

      {canShowMessage &&
        messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            handleAdmin={handleAdmin}
          />
        ))}
    </ul>
  );
};

export default Messages;

import React, { useCallback, useState } from 'react';
import { Alert, Button, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';

const assembledMessage = (profile, chatId) => {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
};

const ChatBottom = () => {
  const [input, setInput] = useState('');
  const { profile } = useProfile();
  const { chatId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = useCallback(val => {
    setInput(val);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }

    const msgData = assembledMessage(profile, chatId);
    msgData.text = input;

    const messageId = database.ref(`message`).push().key;

    const updates = {};

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);
    // Update into database
    try {
      await database.ref().update(updates);

      setInput('');
      setIsLoading(false);
    } catch (err) {
      Alert.error(err.message, 4000);
      setIsLoading(false);
    }
  };

  const onPressEnter = ev => {
    onSendClick();
  };
  return (
    <div>
      <InputGroup>
        <Input
          placeholder="Write a new message here ..."
          value={input}
          onChange={onInputChange}
          onPressEnter={onPressEnter}
        />

        <InputGroup.Button
          color="blue"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;

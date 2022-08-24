import React, { useCallback, useState } from 'react';
import { Alert, Button, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

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

    const updates = {};
    const messageId = database.ref(`message`).push().key;

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

  const afterUpload = useCallback(async files => {
    setIsLoading(true);

    const updates = {};

    files.forEach(file => {
      const msgData = assembledMessage(profile, chatId);
      msgData.file = file;
  
      const messageId = database.ref(`message`).push().key;
      updates[`/messages/${messageId}`] = msgData;
    });

    const lastMsgId = Object.keys(updates).pop();

    updates[`/rooms/${chatId}/lastMessage`] = {
      ...updates[lastMsgId],
      msgId: lastMsgId,
    };

    // Update into database
    try {
      await database.ref().update(updates);
      setIsLoading(false);
    } catch (err) {
      Alert.error(err.message, 4000);
      setIsLoading(false);
    }

  }, [chatId,profile]);

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload}/>
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

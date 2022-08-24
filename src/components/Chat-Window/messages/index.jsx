import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';

import { groupBy, transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 5;
const ref = database.ref('/messages');

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      ref.off(); //unsubscibe from the previous request

      // Get a database reference to our posts
      ref
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snapshot => {
          const data = transformToArrayWithId(snapshot.val());
          setMessages(data);

          if(shouldScrollToBottom(node)){
            node.scrollTop = node.scrollHeight
          }
        });

      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 1000);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;
    console.log('Before load msg');
    loadMessages();
    console.log('After Load Message');

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 1000);

    return () => {
      ref.off('value');
    };
  }, [loadMessages]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin Permission Removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin Permission Granted';
          }
        }
        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const messageRef = database.ref(`/messages/${msgId}`);
    const { uid } = auth.currentUser;

    let alertMsg;

    await messageRef.transaction(msg => {
      console.log(msg);
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          console.log('Inside inner if');
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          console.log('We are inside else', msg.likeCount);
          msg.likeCount += 1;

          if (!msg.likes) {
            console.log('inside else -> if');
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }
      Alert.info(alertMsg);
      return msg;
    });
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Delete this message ?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      // Case: only message left
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      // Update our db
      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (err) {
        return Alert.error(err.message);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(message => {
        return (
          <MessageItem
            key={message.id}
            message={message}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        );
      });

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button color="blue" onClick={onLoadMore}>
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessage && renderMessages()}
    </ul>
  );
};

export default Messages;

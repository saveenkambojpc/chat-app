import React from 'react';
import TimeAgo from 'timeago-react';
import ProfileAvatar from '../../Dashboard/ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;
  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder justify-content-between  mb-1">
        <div className="d-flex align-items-center">
          <ProfileAvatar
            src={author.avatar}
            name={author.name}
            classname="ml-2"
            size="xs"
          />
          {/* <span className="ml-2">{author.name}</span> */}
          <ProfileInfoBtnModal profile={author} appearance="link" className="p-0 ml-1 text-black" />
        </div>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>

      <div>
        <span className="word-break-all ">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;

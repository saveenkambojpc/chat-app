import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../Dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ImageBtnModel from './ImageBtnModel';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImageBtnModel src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return <audio controls>
      <source src={file.url} type="audio/mp3" />
      <track ></track>
      Your browser does not support the audio element;
    </audio>
  }
  return <a href={file.url}>Download {file.name}</a>;
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  console.log(message);
  const { author, createdAt, text, file, likes, likeCount } = message;

  const [selfRef, isHovered] = useHover();

  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom(v => v.isAdmin); //add memo at export
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;

  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered;
  // Check whether the message is liked by a particular user
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      ref={selfRef}
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-05' : ''}`}
    >
      <div className="d-flex align-items-center font-bolder justify-content-between  mb-1">
        <div className="d-flex align-items-center">
          <PresenceDot uid={author.uid} />
          <ProfileAvatar
            src={author.avatar}
            name={author.name}
            className="ml-2"
            size="xs"
          />
          <ProfileInfoBtnModal
            profile={author}
            appearance="link"
            className="p-0 ml-1 text-black"
          >
            {canGrantAdmin && (
              <Button
                block
                onClick={() => handleAdmin(author.uid)}
                color="blue"
              >
                {isMsgAuthorAdmin
                  ? 'Remove admin permission'
                  : 'Give admin in this room'}
              </Button>
            )}
          </ProfileInfoBtnModal>

          <IconBtnControl
            {...(isLiked ? { color: 'red' } : {})}
            isVisible={canShowIcons}
            iconName="heart"
            tooltip="Like this message"
            onClick={() => handleLike(message.id)}
            badgeContent={likeCount}
          />
          {isAuthor && (
            <IconBtnControl
              isVisible={canShowIcons}
              iconName="close"
              tooltip="Delete this message"
              onClick={() => handleDelete(message.id,file)}
            />
          )}
        </div>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>

      {/* Message and Images Container */}
      <div>
        {text && <span className="word-break-all ">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);

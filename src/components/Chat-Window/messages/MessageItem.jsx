import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../Dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message, handleAdmin, handleLike }) => {
  console.log(message);
  const { author, createdAt, text, likes, likeCount } = message;

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

  console.log("value of likeCount is ", likeCount);


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
            {...(isLiked ? {color:'red'}: {})}
            isVisible={canShowIcons}
            iconName='heart'
            tooltip="Like this message"
            onClick={()=>handleLike(message.id)}
            badgeContent={34}
          />
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

export default memo(MessageItem);

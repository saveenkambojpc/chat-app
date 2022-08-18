import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitial } from '../../misc/helpers';

const ProfileAvatar = ({ name = 'RC', ...avatarProps }) => {
  return (
    <Avatar circle {...avatarProps} size="lg" >
      {getNameInitial(name)}
    </Avatar>
  );
};

export default ProfileAvatar;

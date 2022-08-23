import React from 'react';
import { Modal, Button } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../Dashboard/ProfileAvatar';

const ProfileInfoBtnModal = ({ profile,children, ...btnProps }) => {
  const { isOpen, open, close } = useModalState();
  const { name, avatar, createdAt } = profile;

  const shortName = profile.name.split(' ')[0];

  const memberSince = new Date(createdAt).toLocaleDateString();
  return (
    <div>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200  img-fullsize "
            style={{ height: '200px', width: '200px' }}
          />

          <h4 className="mt-2">{name}</h4>

          <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileInfoBtnModal;

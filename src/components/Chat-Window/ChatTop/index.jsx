import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const ChatTop = () => {
  const name = useCurrentRoom(k => k.name);

  const isMobile = useMediaQuery('(max-width:992px)');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pt-2">
        <h3 className="text-disappear d-flex align-items-center ">
          <Icon
            componentClass={Link}
            to="/"
            size="2x"
            icon="arrow-circle-left"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h3>

        <ButtonToolbar className="ws-nowrap">
          <EditRoomBtnDrawer />{' '}
        </ButtonToolbar>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);

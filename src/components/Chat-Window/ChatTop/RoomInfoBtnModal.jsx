import React,{memo} from 'react'
import { Button, Icon, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context'
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
    const name = useCurrentRoom(e => e.name);
    const description = useCurrentRoom(e => e.description);
    const {isOpen,open,close} = useModalState();
  return (
    <div>

    <Button onClick={open}>
        Room Information
    </Button>

    <Modal show={isOpen} onHide={close}>
        <Modal.Header>
            <Modal.Title>
                About : {name}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <h6 className='mb-1'>Description </h6>
            <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button color='red' block onClick={close}>
                <Icon icon="close"></Icon> Close
            </Button>
        </Modal.Footer>
    </Modal>
    </div>
  )
}

export default memo(RoomInfoBtnModal)
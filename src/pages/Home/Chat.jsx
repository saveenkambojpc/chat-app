import React from 'react'
import { useParams } from 'react-router'
import { Loader } from 'rsuite'
import ChatBottom from '../../components/Chat-Window/ChatBottom'
import ChatTop from '../../components/Chat-Window/ChatTop'
import Messages from '../../components/Chat-Window/messages'
import { CurrentRoomProvider } from '../../context/current-room.context'
import { useRooms } from '../../context/rooms.context'
import { auth } from '../../misc/firebase'
import { transformToArrayWithId, transfornToArr } from '../../misc/helpers'

const Chat = () => {
    const {chatId} = useParams();
    const rooms = useRooms();
    

    if(!rooms){
        return <Loader center vertical content="Loading" size="md" speed="slow" />
    }


    const currentRoom = rooms.find(room => room.id === chatId);

    if(!currentRoom){
        return <h6 className='text-center mt-page'>{chatId} not found</h6>
    }

    const {name,description} = currentRoom;

    const admins = transfornToArr(currentRoom.admins)
    const isAdmin = admins.includes(auth.currentUser.uid);
    
    const currentRoomData = {
        name,
        description,
        admins,
        isAdmin,
    }
  return (
    <CurrentRoomProvider data={currentRoomData}>

        <div className='chat-top'>
            <ChatTop />
        </div>
        <div className='chat-middle'>
            <Messages />
        </div>
        <div className='chat-bottom'>
            <ChatBottom />
        </div>
    </CurrentRoomProvider>
  )
}

export default Chat
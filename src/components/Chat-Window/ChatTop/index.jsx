import React,{memo} from 'react'
import { useCurrentRoom } from '../../../context/current-room.context'

const ChatTop = () => {

  const name = useCurrentRoom(k=>k.name);
  return (
    <div>{name}</div>
  )
}

export default memo(ChatTop)
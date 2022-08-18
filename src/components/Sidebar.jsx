import React from 'react'
import CreateRoomBtnModal from './CreateRoomBtnModal'
import DashboardToggle from './Dashboard/DashboardToggle'

const Sidebar = () => {
  return (
    <div className='h-100 pt-2'>
        <DashboardToggle />
        <CreateRoomBtnModal />
    </div>
  )
}

export default Sidebar
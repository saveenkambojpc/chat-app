import React from 'react'
import { Button,Drawer,Icon } from 'rsuite'
import { useMediaQuery, useModelState } from '../../misc/custom-hooks'
import Dashboard from ".";

const DashboardToggle = () => {

    const {isOpen, open, close} = useModelState();
    const isMobile = useMediaQuery('(max-width:992px');

  return (
    <div>
        <Button block color="green" onClick={open}>
            <Icon icon="dashboard">Dashboard</Icon>
        </Button>

        <Drawer full show={isMobile} onHide={close} placement="left">
            <Dashboard />
        </Drawer>
    </div>
  )
}

export default DashboardToggle
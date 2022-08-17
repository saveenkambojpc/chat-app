import React from 'react'
import { Button,Drawer,Icon } from 'rsuite'
import { useModelState } from '../../misc/custom-hooks'
import Dashboard from ".";

const DashboardToggle = () => {

    const {isOpen, open, close} = useModelState();

  return (
    <div>
        <Button block color="green" onClick={open}>
            <Icon icon="dashboard">Dashboard</Icon>
        </Button>

        <Drawer show={isOpen} onHide={close} placement="left">
            <Dashboard />
        </Drawer>
    </div>
  )
}

export default DashboardToggle
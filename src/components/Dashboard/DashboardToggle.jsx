import React, { useCallback } from 'react'
import { Alert, Button,Drawer,Icon } from 'rsuite'
import { useMediaQuery, useModalState } from '../../misc/custom-hooks'
import Dashboard from ".";
import { auth } from '../../misc/firebase';

const DashboardToggle = () => {

    const {isOpen, open, close} = useModalState();
    const isMobile = useMediaQuery('(max-width:992px');
    
    const onSignOut = useCallback(()=>{
        console.log("On Signout is called");
        auth.signOut(); //everything is managed by firebase

        Alert.success("Signout Successfully",4000);
        close();
    },[close])

  return (
    <div>
        <Button block color="green" onClick={open}>
            <Icon icon="dashboard">Dashboard</Icon>
        </Button>

        <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
            <Dashboard onSignOut={onSignOut} />
        </Drawer>
    </div>
  )
}

export default DashboardToggle
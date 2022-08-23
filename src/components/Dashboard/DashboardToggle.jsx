import React, { useCallback, useState } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { Redirect } from 'react-router';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';
import { auth, database } from '../../misc/firebase';
import { isOfflineForDatabase } from '../../context/profile.context';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width:992px');
  const [isSignOut, setIsSignOut] = useState(false);

  const onSignOut = useCallback(() => {
    console.log("On signout called !!!")
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut(); //everything is managed by firebase
        Alert.success('Signout Successfully', 4000);
        close();
        setIsSignOut(true);
      })
      .catch(err => Alert.error(err.message, 4000));
  }, [close]);

  if(isSignOut){
    return <Redirect to="signin" />
  }

  return (
    <div>
      <Button block color="green" onClick={open}>
        <Icon icon="dashboard">Dashboard</Icon>
      </Button>

      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </div>
  );
};

export default DashboardToggle;
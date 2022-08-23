import React from 'react';
import { Alert, Button, Divider, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { auth, database } from '../../misc/firebase';
import { getUserUpdates } from '../../misc/helpers';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  // Update the Nickname
  const onSave = async newName => {                                                                                        
    try {
      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newName,
        database
      );
      database.ref().update(updates);
      Alert.success('Successfully name changed', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey,{profile.name} </h3>
        
        <ProviderBlock />

        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          <span className="mr-1">Signout</span>
          <Icon icon="sign-out" />
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;

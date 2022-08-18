import React from 'react'
import { Alert, Button, Divider, Drawer, Icon } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import { auth, database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
    const { profile } = useProfile();

    const onSave = newName => {
        try {


            database.ref(`/profiles/${profile.uid}`).update({ "name": newName });
            Alert.success("Successfully name changed", 4000);


        }
        catch (err) {
            Alert.error(err.message, 4000);
        }



    }

    return (
        <>
            <Drawer.Header>
                <Drawer.Title>
                    Dashboard
                </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                <h3>Hey,{profile.name} </h3>
                <h3>Hey,{profile.email} </h3>
                <ProviderBlock />
                <Divider />
                <EditableInput name="nickname" initialValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>Nickname</h6>} />
                <AvatarUploadBtn />

                
            </Drawer.Body>

            <Drawer.Footer>
                <Button block color='red' onClick={onSignOut}>
                    <span className='mr-1'>Signout</span>
                    <Icon icon="sign-out" />
                </Button>
            </Drawer.Footer>
        </>
    )
}

export default Dashboard
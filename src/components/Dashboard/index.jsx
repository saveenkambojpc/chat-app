import React from 'react'
import { Button, Divider, Drawer, Icon } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import EditableInput from '../EditableInput';

const Dashboard = ({onSignOut}) => {
    const { profile } = useProfile();

    const onSave = newData =>{
        console.log("inside onSave",newData);
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
                <Divider />
                <EditableInput name="nickname" initialValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>Nickname</h6>}/>
            </Drawer.Body>

            <Drawer.Footer>
                <Button block color='red' onClick={onSignOut}>
                    <span className='mr-1'>Signout</span>
                    <Icon icon="sign-out"/>
                </Button>
            </Drawer.Footer>
        </>
    )
}

export default Dashboard
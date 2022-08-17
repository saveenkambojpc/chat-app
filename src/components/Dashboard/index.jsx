import React from 'react'
import { Button, Drawer, Icon } from 'rsuite'
import { useProfile } from '../../context/profile.context'

const Dashboard = ({onSignOut}) => {
    const { profile } = useProfile();
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
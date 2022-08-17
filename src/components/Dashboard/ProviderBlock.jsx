import firebase from 'firebase/app';
import React, { useState } from 'react'
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth, database } from '../../misc/firebase'

const ProviderBlock = () => {

    const [isConnected, setIsConnected] = useState({
        'google.com': auth.currentUser.providerData.some(p => p.providerId === 'google.com'),
        'facebook.com': auth.currentUser.providerData.some(p => p.providerId === 'facebook.com'),
    })

    const updateIsConnected = (providerId, value) => {
        setIsConnected(p => {
            return {
                ...p,
                [providerId]: value
            }
        })

    }

    const unlink = async providerId => {
        try {
            if (auth.currentUser.providerData.length === 1) {
                throw new Error(`You have only one signin into ${providerId} so you didn't disconnect `);
            }
            await auth.currentUser.unlink(providerId);
            updateIsConnected(providerId, false);
            Alert.info(`Disconnected from ${providerId}`, 4000);
        }
        catch (err) {
            Alert.error(err.message, 4000);
        }
    }

    const link = async provider => {
        try {
            await auth.currentUser.linkWithPopup(provider);
            Alert.success(`Linked to ${provider.providerId}`, 4000)

            updateIsConnected(provider.providerId, true);
        }
        catch (err) {
            Alert.error(err.message, 4000)
        }
    }


    const unlinkFacebook = () => {
        unlink('facebook.com');
    }

    const unlinkGoogle = () => {
        unlink('google.com');
    }

    const linkFacebook = () => {
        link(new firebase.auth.FacebookAuthProvider());
    }

    const linkGoogle = () => {
        link(new firebase.auth.GoogleAuthProvider());
    }

    return (
        <div>
            {isConnected['google.com'] &&
                <Tag color='green' closable onClose={unlinkGoogle} >
                    <Icon icon='google' /><span className="ml-2">Google</span>
                </Tag>
            }
            {isConnected['facebook.com'] &&
                <Tag color='blue' closable onClose={unlinkFacebook} >
                    <Icon icon='facebook' /><span className="ml-2">Facebook</span>
                </Tag>
            }

            <div className="mt-2">
                {isConnected['facebook.com'] &&
                    <Button block color='green' onClick={linkGoogle}>
                        <Icon icon='google' /><span className="ml-2"> Link to Google</span>
                    </Button>
                }
                {isConnected['google.com'] &&
                    <Button block color='blue' onClick={linkFacebook}>
                        <Icon icon='facebook' /><span className="ml-2"> Link to Facebook</span>
                    </Button>
                }
            </div>

        </div >
    )
}

export default ProviderBlock
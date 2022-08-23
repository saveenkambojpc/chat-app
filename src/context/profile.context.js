// import { getSuggestedQuery } from "@testing-library/react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import firebase from "firebase/app";
import { Alert } from 'rsuite';
import { auth, database } from "../misc/firebase";

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const profileContext = createContext();

export function ProfileProvider({ children }) {

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    let userRef;
    let userStatusRef;

    useEffect(() => {
        const authUnsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                userStatusRef = database.ref(`/status/${authObj.uid}`);
                userRef = database.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', (snap) => {
                    const { name, createdAt, avatar } = snap.val();
                    const data = {
                        name,
                        createdAt,
                        avatar,
                        uid: authObj.uid,
                        email: authObj.email,
                    }
                    setProfile(data)
                    setIsLoading(false);

                })



                database.ref('.info/connected').on('value', (snapshot) => {
                    if (!!snapshot.val() === false) {
                        return;
                    };
                    userStatusRef.onDisconnect().set(isOfflineForDatabase).then(() => {
                        userStatusRef.set(isOnlineForDatabase);
                    });
                });
            } else {
                if (userRef) {
                    userRef.off();
                }

                if (userStatusRef) {
                    userStatusRef.off();
                }

                database.ref('/info/connected').off();

                // user doesn't signin
                setProfile(null);
                setIsLoading(false);
            }
        })

        // Cleanup function
        return () => {
            authUnsub();
            if (userRef) {
                userRef.off();
            }

            if (userStatusRef) {
                userStatusRef.off();
            }

            database.ref('/info/connected').off();

        }
    }, [])
    return <profileContext.Provider value={{ isLoading, profile }}>
        {children}
    </profileContext.Provider>
}
export const useProfile = () => useContext(profileContext);
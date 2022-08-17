import { getSuggestedQuery } from "@testing-library/react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, database } from "../misc/firebase";

export const profileContext = createContext();

export function ProfileProvider({ children }) {

    const [profile, setProfile] = useState(null);
    const [isLoading,setIsLoading] = useState(true);

    let userRef;

    useEffect(() => {
        const authUnsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                userRef = database.ref(`/profiles/${authObj.uid}`); 
                userRef.on('value', (snap) => {
                    const { name, createdAt } = snap.val();
                    const data = {
                        name,
                        createdAt,
                        uid: authObj.uid,
                        email: authObj.email,
                    }
                    setProfile(data)
                    setIsLoading(false);
                })
            } else {
                if(userRef){
                    userRef.off();
                }
                // user doesn't signin
                setProfile(null);
                setIsLoading(false);
            }
        })
        return ()=>{
            authUnsub();
            if(userRef){
                userRef.off();
            }
        }
    }, [])
    return <profileContext.Provider value={{isLoading,profile}}>
        {children}
    </profileContext.Provider>
}
export const useProfile = () => useContext(profileContext);
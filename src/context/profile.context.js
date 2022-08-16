import React, { createContext, useContext, useState } from "react";

export const profileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile] = useState(false);
    console.log(children)
    return <profileContext.Provider value={profile}>
        {children}
    </profileContext.Provider>
}

export const useProfile = () => useContext(profileContext);
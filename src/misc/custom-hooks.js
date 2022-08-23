import { useCallback, useEffect, useState } from "react";
import { database } from './firebase';

export function useModalState(defaultValue = false) {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close }
}
// ---------------------------------------------------
export const useMediaQuery = query => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = evt => setMatches(evt.matches);

    queryList.addEventListener('change', listener);
    return () => queryList.removeEventListener('change', listener);
  }, [query]);

  return matches;

}


export function usePresence(uid) {
  const [presence, setPresence] = useState([]);

  useEffect(() => {
    const userStatusRef = database.ref(`/status/${uid}`);

    // userStatusRef.on('value', snap => {
    //   console.log(snap.val())
    //   if (snap.exists()) {
    //     const data = snap.val();
    //     setPresence(data);
    //   }
    // });

    // get support data from firebase
    userStatusRef.on('value', function (snapshot) {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPresence(data);
      }
    }, function (error) {
      console.error(error);
    });

    return () => {
      userStatusRef.off();
    };
  }, [uid]);

  return presence;
}
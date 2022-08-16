import React  from 'react'
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';

export default function PrivateRoute({children,...routeProps}) {

    // const profile = false;
    // const profile = useContext(profileContext);
    const {profile, isLoading} = useProfile();

    if(isLoading && !profile){
      return <Container>
        <Loader center vertical size="md" content="Loading" speed='slow' />
      </Container>
    }

    if(!profile && !isLoading){
      return <Redirect to="/signin" />
    }

    if(!profile){
        return <Redirect to="/signin" />
    }
  return (
    <Route {...routeProps}>
        {children}
    </Route>
  )
}

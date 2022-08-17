import React from 'react'
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';

export default function PublicRoute({ children, ...routeProps }) {
  const { profile, isLoading } = useProfile();

  if (isLoading && !profile) {
    return <Container>
      <Loader center vertical size="md" content="Loading" speed='slow' />
    </Container>
  }

  // Profile found and isLoading is false then we redirect to home  page
  if (profile && !isLoading) {
    return <Redirect to="/" />
  }

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  )
}

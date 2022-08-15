import React from 'react'
import { Redirect, Route } from 'react-router';

export default function PublicRoute({children,...routeProps}) {
    const profile = false;
    if(profile){
        return <Redirect to="/" />
    }
  return (
    <Route {...routeProps}>
        {children}
    </Route>
  )
}

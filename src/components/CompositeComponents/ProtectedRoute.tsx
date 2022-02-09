import React from "react"
import { Redirect, Route } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { IsLoggedInWithBetaPassword } from "state/ApplicationStatus"

// @ts-ignore
function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = useRecoilValue(IsLoggedInWithBetaPassword)

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/landing" />
      }
    />
  )
}

export default ProtectedRoute

import React             from "react";
import {Redirect, Route} from "react-router-dom";
import {useRecoilValue}  from "recoil";
import {IsLoggedIn}      from "state/ApplicationStatus";

// @ts-ignore
function ProtectedRoute({component: Component, ...restOfProps}) {
	const isAuthenticated = useRecoilValue(IsLoggedIn);

	return (
		<Route
			{...restOfProps}
			render={(props) =>
				isAuthenticated ? <Component {...props} /> : <Redirect to="/login"/>
			}
		/>
	);
}

export default ProtectedRoute;

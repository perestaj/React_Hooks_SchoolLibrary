import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { selectCurrentUser } from "../../../authorization/authorizationSlice";
import { Role } from "../../../common/role";

type Props = {
    component: React.ComponentType<any>;
    roles: Role[];
    exact?: boolean;
    path: string;
}

export const PrivateRoute: FunctionComponent<Props> = ({ component: Component, ...rest }) => {
    const currentUser = useSelector(selectCurrentUser);
    
    const {isLoggedIn, role } = currentUser || {};
    const {roles} = rest;
    

    if (isLoggedIn && roles.find(r => r === role)) {
        return (
            <Route {...rest} render={props =>
                <Component {...props} />
            } />
        );
    }

    return (
        <Route {...rest} render={props => <Redirect to={{ pathname: '/login' + props.location.pathname }} />} />
    );
}
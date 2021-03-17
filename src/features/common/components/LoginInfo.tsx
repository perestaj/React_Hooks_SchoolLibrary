import React, {  FunctionComponent } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOff, selectCurrentUser } from '../../../authorization/authorizationSlice';


export const LoginInfo: FunctionComponent = () => {
    const currentUser = useSelector(selectCurrentUser);
    const history = useHistory();
    const dispatch = useDispatch();

    function logoff(e: React.MouseEvent): void {
        e.preventDefault();
        
        dispatch(logOff({history: history, redirectUrl: '/home'}));        
    }
            
    if (currentUser && currentUser.isLoggedIn) {
        return (
            <div>
                Welcome <strong>{currentUser.username}</strong>, click <a href="/" style={{cursor: 'pointer'}} onClick={e => logoff(e)}>here</a> to log off
            </div>
        )
    }

    return ( <div><NavLink to='/login/home'>Log In</NavLink></div> );    
}

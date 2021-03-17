import './LoginPage.css';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { logInAsync, selectLoginError } from "../../../authorization/authorizationSlice";

export const LoginPage = ()=> {
    const history = useHistory();
    const { redirectUrl } = useParams<{ redirectUrl: string }>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const loginError = useSelector(selectLoginError);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(logInAsync({ username, password, history, redirectUrl }));
    };    

    return (
        <div>            
            <form className="form-signin" onSubmit={(e) => handleSubmit(e)}>
                <h1 className="h3 mb-3 font-weight-normal text-center">Please sign in</h1>

                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text" name="username" placeholder="Enter Username" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" name="password"  placeholder="Enter Password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                {loginError && <div className="alert alert-danger" role="alert" style={{marginTop: '20px'}}>{loginError}</div>}                
            </form>            
        </div>
    )
}

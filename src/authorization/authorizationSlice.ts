import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { History } from "history";
import * as AuthorizationApi from "../api/authorizationApi";
import { AppThunk, RootState } from "../app/store";
import { ajaxCallError } from "../common/commonSlice";
import { AuthorizationData } from "./authorizationData";
import { authenticate, logOut } from "./authorization";
import { CurrentUser } from "./currentUser";

interface AuthorizationState {
    currentUser?: CurrentUser;
    loginError: string | undefined;
};

const initialState: AuthorizationState = {
    currentUser: undefined,
    loginError: undefined
};


export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        logInSuccess: (state, action: PayloadAction<CurrentUser>) => {
            state.currentUser = action.payload;
        },
        logInError: (state, action: PayloadAction<string>) => {
            state.loginError = action.payload;
        },
        logOffSuccess: state => {
            state.currentUser = undefined;
        }
    }    
});

export const { logInSuccess, logInError, logOffSuccess } = authorizationSlice.actions;

export const logOff = ({history, redirectUrl}: {history: History; redirectUrl: string}): AppThunk => dispatch => {    
    logOut();

    dispatch(logOffSuccess());

    if (redirectUrl && redirectUrl.length > 0) {
        history.push(redirectUrl);
    }    
};

export const logInAsync = ({ username, password, history, redirectUrl}: { username: string; password: string; history: History; redirectUrl: string}): AppThunk => 
    async dispatch => {
    try {
        const response = await AuthorizationApi.login(username, password);
        const authorizationData: AuthorizationData = response.data;
        
        authenticate(authorizationData);
        dispatch(logInSuccess({username: authorizationData.userName, role: authorizationData.role, isLoggedIn: true}));

        if (redirectUrl && redirectUrl.length > 0) {
            history.push("/" + redirectUrl);
        }
    }
    catch(error) {
        if (error.response.status === 400) {
            dispatch(logInError('Invalid Username or Password!'));          
        } else {
          dispatch(ajaxCallError());
        }
    };
};

export default authorizationSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.authorization.currentUser;
export const selectLoginError = (state: RootState) => state.authorization.loginError;
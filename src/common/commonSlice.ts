import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Author } from "./author";
import { Publisher } from "./publisher";
import * as CommonApi from '../api/commonApi';

interface CommonState {
    ajaxSuccess?: boolean;
    authors?: Author[];
    publishers?: Publisher[];
}

const initialState: CommonState = {
    ajaxSuccess: undefined,
    authors: undefined,
    publishers: undefined
};

export const CommonSlice = createSlice({
    name: 'ajaxStatus',
    initialState,
    reducers: {
        ajaxCallSuccess: state => { 
            state.ajaxSuccess = true;
        },
        ajaxCallError: state => {
            state.ajaxSuccess = false;
        },
        loadAuthorsSuccess: (state, action: PayloadAction<Author[]>) => {
            state.authors = action.payload;
        },
        loadPublishersSuccess: (state, action: PayloadAction<Publisher[]>) => {
            state.publishers = action.payload;
        },
    }
});

export const { ajaxCallSuccess, ajaxCallError, loadAuthorsSuccess, loadPublishersSuccess } = CommonSlice.actions;

export const loadAuthorsAsync = (): AppThunk => async dispatch => {    
    const response = await CommonApi.getAuthors();      
    const authors = response.data;          
    dispatch(loadAuthorsSuccess(authors));
    dispatch(ajaxCallSuccess());    
};

export const loadPublishersAsync = (): AppThunk => async dispatch => {    
    const response = await CommonApi.getPublishers();      
    const Publishers = response.data;          
    dispatch(loadPublishersSuccess(Publishers));
    dispatch(ajaxCallSuccess());    
};

export default CommonSlice.reducer;

export const selectAjaxCallSuccess = (state: RootState) => state.common.ajaxSuccess;
export const selectAuthors = (state: RootState) => state.common.authors;
export const selectPublishers = (state: RootState) => state.common.publishers;
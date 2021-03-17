import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import commonReducer from '../common/commonSlice';
import authorizationReducer from '../authorization/authorizationSlice';
import bookReducer from '../features/books/bookSlice';
import loanReducer from '../features/loans/loanSlice';

export const store = configureStore({
  reducer: {    
    common: commonReducer,
    authorization: authorizationReducer,
    books: bookReducer,
    loans: loanReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

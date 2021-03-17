import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { ajaxCallSuccess } from "../../common/commonSlice";
import { SortCriteria } from "../../common/sortCriteria";
import { loadBooksAsync, loadBookStatusesSuccess } from "../books/bookSlice";
import { Loan } from "./models/loan";
import { LoanSearchFilter } from "./models/loanSearchFilter";
import { LoanSortColumn } from "./models/loanSortColumn";
import * as LoanApi from '../../api/loanApi';
import * as BookApi from '../../api/bookApi';
import { LoanStatus } from "../../common/loanStatus";

function filter(loans: Loan[], loansSearchFilter: LoanSearchFilter | null): Loan[] {
    if (!loansSearchFilter) {
        return loans;
    }

    return loans.filter((loan) => {
        const title = loansSearchFilter.title || '';
        const titleQuery = title.length === 0 || !loan.book.title || loan.book.title.toUpperCase().includes(title.toUpperCase());

        const user = loansSearchFilter.user || '';
        const userQuery = user.length === 0 || loan.user.fullName.toUpperCase().includes(user.toUpperCase());

        const statusQuery = !loan.book.status || (loansSearchFilter.bookStatuses || [])
            .filter(status => status.isSelected)
            .map(status => status.id)
            .includes(loan.book.status);

      return titleQuery && userQuery && statusQuery;
    });
}

function sort(loans: Loan[], column: string, loansSortDesc: boolean): void {
    loans.sort((first: Loan, second: Loan) => {
        let firstField: string | Date | undefined;
        let secondField: string | Date | undefined;

        if (column === LoanSortColumn.Title) {
            firstField = first.book.title?.toUpperCase();
            secondField = second.book.title?.toUpperCase();
        } else if (column === LoanSortColumn.Authors) {
            firstField = first.book.authorsList?.toUpperCase();
            secondField = second.book.authorsList?.toUpperCase();
        } else if (column === LoanSortColumn.User) {
            firstField = first.user.fullName.toUpperCase();
            secondField = second.user.fullName.toUpperCase();
        } else if (column === LoanSortColumn.RequestDate) {
            firstField = first.requestDate;
            secondField = second.requestDate;
        } else if (column === LoanSortColumn.BorrowDate) {
            firstField = first.borrowDate;
            secondField = second.borrowDate;
        } else if (column === LoanSortColumn.Status) {
            firstField = first.book.statusName?.toUpperCase();
            secondField = second.book.statusName?.toUpperCase();
        } else {
            return 0;
        }

        let comparison = 0;
        if (firstField && secondField) {
            comparison = firstField > secondField ? 1 : (firstField < secondField ? -1 : 0);
        }
        
        if (loansSortDesc) {
            comparison = -comparison;
        }

      return comparison;
    });
}

interface LoansState {
    loans: Loan[];
    filteredLoans: Loan[],
    loansSearchFilter: LoanSearchFilter | null;
    sortCriteria: SortCriteria<LoanSortColumn>;
}

export const initialState: LoansState = {
    loans: [],
    filteredLoans: [],
    loansSearchFilter: {
        title: '',
        user: '',
        bookStatuses: [
            { id: LoanStatus.Available, isSelected: true },
            { id: LoanStatus.Borrowed, isSelected: true },
            { id: LoanStatus.Lost, isSelected: true },
            { id: LoanStatus.Requested, isSelected: true },
        ]
    },
    sortCriteria: {
        sortColumn: LoanSortColumn.Title,
        sortOrderDesc: false
    },   
};

export const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        filterLoans: (state, action: PayloadAction<LoanSearchFilter>) => {
            state.loansSearchFilter = action.payload;
        },
        loadLoansSuccess: (state, action: PayloadAction<Loan[]>) => {
            state.loans = action.payload;
        },
        loadFilteredLoans: (state, action: PayloadAction<Loan[]>) => {
            state.filteredLoans = action.payload;
        },
        sortLoans: (state, action: PayloadAction<SortCriteria<LoanSortColumn>>) => {
            state.sortCriteria = action.payload;
        },        
    }
});

export const { loadLoansSuccess, loadFilteredLoans } = loanSlice.actions;

export const requestBookAsync = (bookID: number): AppThunk => async (dispatch) => {
    await LoanApi.requestBook(bookID);
    dispatch(loadBooksAsync());    
};

export const returnBookAsync = (userID: number, bookID: number,): AppThunk => {
    return async dispatch => {        
        await LoanApi.returnBook(userID, bookID);
        dispatch(loadLoansAsync());
    }        
}

export const lendBookAsync = (userID: number, bookID: number): AppThunk => {
    return async dispatch => {        
        await LoanApi.lendBook(userID, bookID);
        dispatch(loadLoansAsync());              
    };
}

export const setBookStatusToLostAsync = (userID: number, bookID: number): AppThunk => {
    return async dispatch => {        
        await LoanApi.setBookStatusToLost(userID, bookID);
        dispatch(loadLoansAsync());        
    };
}

export const loadLoansAsync = (): AppThunk => async (dispatch, getState) => {   
    const response = await LoanApi.getLoans();      
    const loans = response.data;          
    dispatch(loadLoansSuccess(loans));

    const loansSearchFilter: LoanSearchFilter | null = getState().loans.loansSearchFilter;
    const sortCriteria = getState().loans.sortCriteria;
    let filteredLoans: Loan[] = [...filter(loans, loansSearchFilter)];
    sort(filteredLoans, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);

    dispatch(loadFilteredLoans(filteredLoans));
    dispatch(ajaxCallSuccess());    
};

export const filterLoans = (loansSearchFilter: LoanSearchFilter): AppThunk => (dispatch, getState) => {
    dispatch(loanSlice.actions.filterLoans(loansSearchFilter));

    const loans = getState().loans.loans;
    const sortCriteria = getState().loans.sortCriteria;

    if (loans) {
        const filteredLoans: Loan[] = filter(loans, loansSearchFilter);
        sort(filteredLoans, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);

        dispatch(loadFilteredLoans(filteredLoans));
    }
};

export const sortLoans = (sortCriteria: SortCriteria<LoanSortColumn>): AppThunk => (dispatch, getState) => {
    dispatch(loanSlice.actions.sortLoans(sortCriteria));

    const filteredLoans = [...getState().loans.filteredLoans];
    sort(filteredLoans, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);
    dispatch(loanSlice.actions.loadFilteredLoans(filteredLoans));
};

export const loadBookStatuses = (): AppThunk => async dispatch => {    
    const response = await BookApi.getBookStatuses();
    const statuses = response.data;
    dispatch(loadBookStatusesSuccess(statuses));
    dispatch(ajaxCallSuccess());
};
  

export default loanSlice.reducer;

export const selectLoansSearchFilter = (state: RootState) => state.loans.loansSearchFilter;
export const selectSortCriteria = (state: RootState) => state.loans.sortCriteria;
export const selectFilteredLoans = (state: RootState) => state.loans.filteredLoans;
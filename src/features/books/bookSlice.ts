import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { ajaxCallSuccess } from "../../common/commonSlice";
import { SortCriteria } from "../../common/sortCriteria";
import { Book } from "./models/book";
import { BookSortColumn } from "./models/bookSortColumn";
import { BooksSearchFilter } from "./models/booksSearchFilter";
import * as BookApi from '../../api/bookApi';
import { History } from "history";
import { BookStatus } from "../loans/models/bookStatus";
import { LoanStatus } from "../../common/loanStatus";

function filter(books: Book[], booksSearchFilter: BooksSearchFilter): Book[] {
    if (!books || !booksSearchFilter) {
      return books;
    }

    return books.filter((book: Book) => {
        const statusQuery = !booksSearchFilter.onlyAvailable || book.status === LoanStatus.Available;

        const titleQuery =
            !booksSearchFilter.title ||
            booksSearchFilter.title.length === 0 ||
            (book.title || '')
            .toUpperCase()
            .includes(booksSearchFilter.title.toUpperCase());

        
        const authorQuery =
            !booksSearchFilter.authorID ||
            +booksSearchFilter.authorID === 0 ||
            (book.authorIds || []).filter(author => author === +booksSearchFilter.authorID)
            .length > 0;

        return statusQuery && titleQuery && authorQuery;
    });
}

function sort(books: Book[], column: string, booksSortDesc: boolean): void {
    books.sort((first, second) => {
        let firstField: any;
        let secondField: any;

        if (column === BookSortColumn.Title) {
            firstField = (first.title || '').toUpperCase();
            secondField = (second.title || '').toUpperCase();
        } else if (column === BookSortColumn.Authors) {
            firstField = (first.authorsList || '').toUpperCase();
            secondField = (second.authorsList || '').toUpperCase();
        } else if (column === BookSortColumn.Publisher) {
            firstField = (first.publisherName || '').toUpperCase();
            secondField = (second.publisherName || '').toUpperCase();
        } else if (column === BookSortColumn.Status) {
            firstField = (first.statusName || '').toUpperCase();
            secondField = (second.statusName || '').toUpperCase();
        } else {
            return 0;
        }

        let comparison = firstField > secondField ? 1 : firstField < secondField ? -1 : 0;
        if (booksSortDesc) {
            comparison = -comparison;
        }

        return comparison;
    });
}

interface BookState {
    bookStatuses: BookStatus[];
    booksSearchFilter: BooksSearchFilter;
    books: Book[];
    filteredBooks: Book[];
    sortCriteria: SortCriteria<BookSortColumn>;
    book: Book | undefined;    
}

const initialState: BookState = {
    bookStatuses: [],
    booksSearchFilter: {
        authorID: 0,
        onlyAvailable: false,        
        title: ''
    },
    books: [],
    filteredBooks: [],
    sortCriteria: {
        sortColumn: BookSortColumn.Title,
        sortOrderDesc: false
    },
    book: undefined,
};

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        loadBookStatusesSuccess: (state, action: PayloadAction<BookStatus[]>) => {
            state.bookStatuses = action.payload;
        },
        filterBooks: (state, action: PayloadAction<BooksSearchFilter>) => {
            state.booksSearchFilter = action.payload;
        },
        loadBooksSuccess: (state, action: PayloadAction<Book[]>) => {
            state.books = action.payload;
        },
        loadBookSuccess: (state, action: PayloadAction<Book>) => {
            state.book = action.payload;
        },
        loadFilteredBooks: (state, action: PayloadAction<Book[]>) => {
            state.filteredBooks = action.payload;
        },
        sortBooks: (state, action: PayloadAction<SortCriteria<BookSortColumn>>) => {
            state.sortCriteria = action.payload;
        },
    }    
});

export const { loadBookStatusesSuccess, loadBooksSuccess, loadBookSuccess } = bookSlice.actions;

export const deleteBookAsync = (bookID: number): AppThunk => async dispatch => {    
    await BookApi.deleteBook(bookID);
    dispatch(loadBooksAsync());      
}

export const loadBookAsync = (bookID: number): AppThunk => async dispatch => {    
    const book = bookID > 0 
    ? (await BookApi.getBook(bookID)).data
    : {
        bookID: 0,
        title: '',
        additionalInformation: '',
        publisherID: 0,
        authorIds: []
    } as Book;
    
    dispatch(loadBookSuccess(book));
    dispatch(ajaxCallSuccess());
};

export const loadBooksAsync = (): AppThunk => async (dispatch, getState) => {    
    const response = await BookApi.getBooks();      
    const books = response.data;          
    dispatch(loadBooksSuccess(books));

    const booksSearchFilter: BooksSearchFilter = getState().books.booksSearchFilter;
    const sortCriteria = getState().books.sortCriteria;
    const filteredBooks: Book[] = filter(books, booksSearchFilter);
    sort(filteredBooks, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);

    dispatch(bookSlice.actions.loadFilteredBooks(filteredBooks));
    dispatch(ajaxCallSuccess());    
};

export const filterBooks = (booksSearchFilter: BooksSearchFilter): AppThunk => (dispatch, getState) => {
    dispatch(bookSlice.actions.filterBooks(booksSearchFilter));

    const books = getState().books.books;
    const sortCriteria = getState().books.sortCriteria;

    if (books) {
        const filteredBooks: Book[] = filter(books, booksSearchFilter);
        sort(filteredBooks, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);

        dispatch(bookSlice.actions.loadFilteredBooks(filteredBooks));
    }
};

export const sortBooks = (sortCriteria: SortCriteria<BookSortColumn>): AppThunk => (dispatch, getState) => {
    dispatch(bookSlice.actions.sortBooks(sortCriteria));

    const filteredBooks = [...getState().books.filteredBooks];
    sort(filteredBooks, sortCriteria.sortColumn, sortCriteria.sortOrderDesc);
    dispatch(bookSlice.actions.loadFilteredBooks(filteredBooks));
};

export const updateBookAsync = (book: Book, history: History): AppThunk => {
    return async () => {      
        await BookApi.updateBook(book);
        history.push("/books");      
    };
}

export default bookSlice.reducer;

export const selectBooksSearchFilter = (state: RootState) => state.books.booksSearchFilter;
export const selectSortCriteria = (state: RootState) => state.books.sortCriteria;
export const selectFilteredBooks = (state: RootState) => state.books.filteredBooks;
export const selectBook = (state: RootState) => state.books.book;
export const selectBookStatuses = (state: RootState) => state.books.bookStatuses;
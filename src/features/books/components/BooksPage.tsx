import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BooksSearch } from './BooksSearch';
import { BooksList } from './BooksList';
import { deleteBookAsync, filterBooks, loadBooksAsync, selectBooksSearchFilter, selectFilteredBooks, selectSortCriteria, sortBooks } from "../bookSlice";
import { selectCurrentUser } from "../../../authorization/authorizationSlice";
import { BookSortColumn } from "../models/bookSortColumn";
import { selectAjaxCallSuccess, selectAuthors } from "../../../common/commonSlice";
import { BooksSearchFilter } from "../models/booksSearchFilter";
import { requestBookAsync } from "../../loans/loanSlice";
import { canRequestBook, canAddBook, canDeleteBook } from "../../../authorization/authorization";

export const BooksPage: FunctionComponent = () => {   
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const booksSearchFilter = useSelector(selectBooksSearchFilter);
  const sortCriteria = useSelector(selectSortCriteria);
  const filteredBooks = useSelector(selectFilteredBooks);
  const authors = useSelector(selectAuthors);
  const ajaxCallSuccess = useSelector(selectAjaxCallSuccess);

  useEffect(() => {
    dispatch(loadBooksAsync());
  }, [dispatch]);
    

  function add(event: React.MouseEvent): void {
    event.preventDefault();
    history.push("/books/edit/0");
  }

  function deleteBook(event: React.MouseEvent, bookID?: number): void {
    event.preventDefault();

    if (bookID && window.confirm("Do you want to delete the book?")) {
      dispatch(deleteBookAsync(bookID));
    }
  }

  function requestBook(event: React.MouseEvent, bookID?: number): void {
    event.preventDefault();

    if (bookID && window.confirm('Are you sure you want to borrow this book?')) {
      dispatch(requestBookAsync(bookID));
    }    
  }

  function sort(field: BookSortColumn): void {
    const booksSortCriteria = { ...sortCriteria };

    booksSortCriteria.sortOrderDesc = field === booksSortCriteria.sortColumn ? !booksSortCriteria.sortOrderDesc : false;
    booksSortCriteria.sortColumn = field;

    dispatch(sortBooks(booksSortCriteria));
  }
      
  if (!ajaxCallSuccess) {
    return <div>Error while loading books</div>;
  } else {
    const showRequestBook = canRequestBook(currentUser);
    const showAddButton = canAddBook(currentUser);
    const showDeleteButton = canDeleteBook(currentUser);

    return (
      <div>
        <h1 className="h3 mb-3 font-weight-normal text-center">Books</h1>
        <BooksSearch showAddButton={showAddButton} filter={booksSearchFilter} authors={authors}  
          filterChanged={(filter: BooksSearchFilter) => dispatch(filterBooks(filter))} add={(event: React.MouseEvent) => add(event)} />

        <BooksList books={filteredBooks} showDeleteButton={showDeleteButton} showRequestBook={showRequestBook} sortField={sortCriteria.sortColumn || ''}
          requestBook={(event, bookID) => requestBook(event, bookID)}
          deleteBook={(event, bookID) => deleteBook(event, bookID)} sort={(field: BookSortColumn) => sort(field)} />
      </div>
    );
  }  
}

import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoanStatus } from "../../../common/loanStatus";
import { TableHeader } from "../../common/components/TableHeader";
import { lendBookAsync, returnBookAsync, selectFilteredLoans, selectSortCriteria, setBookStatusToLostAsync, sortLoans } from "../loanSlice";
import { LoanSortColumn } from "../models/loanSortColumn";

type Props = {
    status: LoanStatus;
    userID: number;
    bookID: number;
    lendBook: (event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number) => void;
    returnBook: (event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number) => void;
    setBookStatusToLost: (event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number) => void;
}

const BookStatusSelector: FunctionComponent<Props> = ({status, userID, bookID, lendBook, returnBook, setBookStatusToLost}) => {    
    return (
        <div className="btn-group" role="group">
            <button id="bookStatusSelector" type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Change status
            </button>
            <div className="dropdown-menu" aria-labelledby="bookStatusSelector">
                { status === LoanStatus.Requested && (
                    <a href="# " className="dropdown-item" style={{cursor: 'pointer'}} onClick={event => lendBook(event, userID, bookID)}>Borrowed</a>
                )}

                {(status === LoanStatus.Requested || status === LoanStatus.Borrowed) && (
                    <a href="# " className="dropdown-item" style={{cursor: 'pointer'}} onClick={(event) => returnBook(event, userID, bookID)}>Available</a>
                )}

                <a href="# " className="dropdown-item" style={{cursor: 'pointer'}} onClick={(event) => setBookStatusToLost(event, userID, bookID)}>Lost</a>
            </div>
        </div>
    );
};

export const LoansList: FunctionComponent = () => {
    const dispatch = useDispatch();    
    const loans = useSelector(selectFilteredLoans);
    const sortCriteria = useSelector(selectSortCriteria);

    function returnBook(event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number): void {
        event.preventDefault();
    
        dispatch(returnBookAsync(userID, bookID));
    }
    
    function lendBook(event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number): void {
        event.preventDefault();
    
        dispatch(lendBookAsync(userID, bookID));
    }
    
    function setBookStatusToLost(event: React.MouseEvent<HTMLAnchorElement>, userID: number, bookID: number): void {
        event.preventDefault();
        
        dispatch(setBookStatusToLostAsync(userID, bookID));
    }

    function sort(field: LoanSortColumn): void {
        const loansSortCriteria = { ...sortCriteria };

        loansSortCriteria.sortOrderDesc = field === loansSortCriteria.sortColumn ? !loansSortCriteria.sortOrderDesc : false;
        loansSortCriteria.sortColumn = field;
    
        dispatch(sortLoans(loansSortCriteria));
      }

    if (!loans || loans.length === 0){
        return (<div style={{ textAlign: 'center' }}>0 loans found</div>);
    }

    return (
        <div style={{width: '95%', margin: '0 auto'}}>
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-light">
                    <tr>
                        <th scope="col"><TableHeader title="Title" field={LoanSortColumn.Title} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.Title)} /></th>
                        <th scope="col"><TableHeader title="Author(s)" field={LoanSortColumn.Authors} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.Authors)} /></th>
                        <th scope="col"><TableHeader title="User" field={LoanSortColumn.User} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.User)} /></th>
                        <th scope="col"><TableHeader title="Request Date" field={LoanSortColumn.RequestDate} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.RequestDate)} /></th>
                        <th scope="col"><TableHeader title="Borrow Date" field={LoanSortColumn.BorrowDate} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.BorrowDate)} /></th>
                        <th scope="col"><TableHeader title="Status" field={LoanSortColumn.Status} sortField={sortCriteria.sortColumn || ''} sort={() => sort(LoanSortColumn.Status)} /></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(item => (
                        <tr key={item.bookID}>
                            <td>
                                {item.book.title}
                            </td>
                            <td>
                                {item.book.authorsList}
                            </td>
                            <td>
                                {item.user.fullName}
                            </td>
                            <td>
                                {item && item.requestDate ? new Date(item.requestDate).toLocaleDateString() : ''}
                            </td>
                            <td>
                                {item && item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : ''}
                            </td>
                            <td>
                                {item.book.statusName}
                            </td>
                            <td>
                                {item.book.status !== LoanStatus.Lost && 
                                    <BookStatusSelector userID={item.userID} bookID={item.bookID} status={item.book.status || 0} lendBook={lendBook} 
                                                        returnBook={returnBook} setBookStatusToLost={setBookStatusToLost} />
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

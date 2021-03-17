import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { Book } from "../models/book";
import { BookSortColumn } from "../models/bookSortColumn";
import { LoanStatus } from "../../../common/loanStatus";
import { TableHeader } from "../../common/components/TableHeader";

type Props = {
    books: Book[];
    showDeleteButton: boolean;
    showRequestBook: boolean;
    sortField: BookSortColumn;

    requestBook: (event: React.MouseEvent, bookID?: number) => void;
    deleteBook: (event: React.MouseEvent, bookID?: number) => void;
    sort: (field: BookSortColumn) => void;
}

export const BooksList: FunctionComponent<Props> = ({books, showDeleteButton, showRequestBook, sortField, requestBook, deleteBook, sort}) => {   
    
    if (!books || books.length === 0) {
        return ( <div style={{ textAlign: "center" }}>0 books found</div> );
    }
    
    return (
    <div style={{width: '95%', margin: '0 auto'}}>
        <table className="table table-striped table-bordered table-hover">
            <thead className="thead-light">
                <tr>
                    <th scope="col"><TableHeader title="Title" field={BookSortColumn.Title} sortField={sortField} sort={() => sort(BookSortColumn.Title)} /></th>
                    <th scope="col"><TableHeader title="Author(s)" field={BookSortColumn.Authors} sortField={sortField} sort={() => sort(BookSortColumn.Authors)} /></th>
                    <th scope="col"><TableHeader title="Publisher" field={BookSortColumn.Publisher} sortField={sortField} sort={() => sort(BookSortColumn.Publisher)} /></th>                    
                    <th scope="col"><TableHeader title="Status" field={BookSortColumn.Status} sortField={sortField} sort={() => sort(BookSortColumn.Status)} /></th>
                    <th scope="col" />                
                </tr>
            </thead>
            <tbody>
                {books.map(item => (
                <tr key={item.bookID}>
                    <td>
                        <NavLink to={"/books/details/" + item.bookID}>{item.title}</NavLink>
                    </td>
                    <td>{item.authorsList}</td>
                    <td>{item.publisherName}</td>                    
                    <td>{item.statusName}</td>
                    <td>                    
                        <button className="btn btn-primary" style={{visibility: item.status === LoanStatus.Available && showRequestBook ? 'visible': 'hidden'}}
                            onClick={event => item.status === LoanStatus.Available && showRequestBook && requestBook(event, item.bookID)}>Request the Book</button>
                                    
                    {showDeleteButton &&
                        (
                        <button className="btn btn-danger" style={{marginLeft: '10px'}} onClick={event => deleteBook(event, item.bookID)}>Delete</button>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    );    
}

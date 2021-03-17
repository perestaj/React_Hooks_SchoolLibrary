import { User } from "../../administration/users/models/user";
import { Book } from "../../books/models/book";

export interface Loan {
    loanID: number;
    bookID: number;
    book: Book;
    userID: number;
    user: User;
    requestDate: Date;
    borrowDate: Date;
    returnDate: Date;
}
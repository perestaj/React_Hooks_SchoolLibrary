import axios, { AxiosResponse } from "axios";
import { Book } from "../features/books/models/book";
import { BookStatus } from "../features/loans/models/bookStatus";

export const getBookStatuses = (): Promise<AxiosResponse<BookStatus[]>> => {
    return axios.get<BookStatus[]>(`${process.env.REACT_APP_BASE_URL}/books/statuses`);
}

export const getBooks = (): Promise<AxiosResponse<Book[]>> => {
    return axios.get<Book[]>(`${process.env.REACT_APP_BASE_URL}/books`);
}

export const getBook = (bookID: number): Promise<AxiosResponse<Book>> => {
    return axios.get<Book>(`${process.env.REACT_APP_BASE_URL}/books/${bookID}`);
}

export const updateBook = (book: Book): Promise<AxiosResponse<any>> => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/books`, book);
}

export const deleteBook = (bookID: number): Promise<AxiosResponse<any>> => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/books/${bookID}`);
}

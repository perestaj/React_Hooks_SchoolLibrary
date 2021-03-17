import axios, { AxiosResponse } from "axios";
import { LoanStatus } from "../common/loanStatus";
import { Loan } from "../features/loans/models/loan";

export const getLoans = (): Promise<AxiosResponse<Loan[]>> => {
    return axios.get<Loan[]>(`${process.env.REACT_APP_BASE_URL}/loans`);
}

export const returnBook = (userID: number, bookID: number): Promise<AxiosResponse<any>> => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/loans/update/${userID}/${bookID}/${LoanStatus.Available}`);
}

export const requestBook = (bookID: number): Promise<AxiosResponse<any>> => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/loans/request?bookID=${bookID}`);
}

export const lendBook = (userID: number, bookID: number): Promise<AxiosResponse<any>> => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/loans/update/${userID}/${bookID}/${LoanStatus.Borrowed}`);
}

export const setBookStatusToLost = (userID: number, bookID: number): Promise<AxiosResponse<any>> => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/loans/update/${userID}/${bookID}/${LoanStatus.Lost}`);
}
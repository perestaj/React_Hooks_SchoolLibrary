import axios, { AxiosResponse } from "axios";
import { Author } from "../common/author";
import { Publisher } from "../common/publisher";

export const getAuthors = (): Promise<AxiosResponse<Author[]>> => {
    return axios.get(`${process.env.REACT_APP_BASE_URL}/authors`);
}

export const getPublishers = (): Promise<AxiosResponse<Publisher[]>> => {
    return axios.get(`${process.env.REACT_APP_BASE_URL}/publishers`);
}
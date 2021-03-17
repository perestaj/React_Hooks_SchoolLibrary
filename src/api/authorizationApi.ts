import axios, { AxiosResponse } from "axios";
import { AuthorizationData } from "../authorization/authorizationData";

export const login = (username: string, password: string): Promise<AxiosResponse<AuthorizationData>> => {
    return axios.post<AuthorizationData>(`${process.env.REACT_APP_BASE_URL}/users/token?userName=${username}&password=${password}`);
}

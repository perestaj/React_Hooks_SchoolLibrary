
import axios, { AxiosRequestConfig } from "axios";
import { store } from '../app/store';
import { ajaxCallError } from "../common/commonSlice";
import { History } from "history";
import { getAuthorizationData } from "../authorization/authorization";

export function registerInterceptors(history: History): void {
  axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
      let authorizationData = getAuthorizationData();
      if (authorizationData) {
          config.headers.common.Accept = "application/json";
          config.headers.common["Content-Type"] = "application/json";
          config.headers.common.Authorization = "Bearer " + authorizationData.token;
      }

      return config;
    }, function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(value => value, error => {
    if (error.response.status === 401) {
      history.push("/login" + (history.location.pathname || ""));
    } else if (error.response.status !== 400) {
      store.dispatch(ajaxCallError());
    }

    return Promise.reject(error);
  });
}
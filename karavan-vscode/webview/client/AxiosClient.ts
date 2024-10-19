/**
 * @author Tanmay <tanmay.pawar@314ecorp.com>
 * @description axios client at extension side
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import log from "loglevel";
import _ from "lodash";

import {
  InterfaceControllerApi,
  MessageControllerApi,
  RepositoryControllerApi,
  SchemaControllerApi,
  KeycloakControllerApi,
} from "./api";

class AxiosClient {
  client!: AxiosInstance;

  InterfaceControllerApi!: InterfaceControllerApi;
  MessageControllerApi!: MessageControllerApi;
  RepositoryControllerApi!: RepositoryControllerApi;
  SchemaControllerApi!: SchemaControllerApi;
  KeycloakControllerApi!: KeycloakControllerApi;

  init = (baseURL: string, authToken: string): void => {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    });
    this.client.interceptors.response.use(
      this.responseInterceptor,
      this.rejectInterceptor
    );
    this.InterfaceControllerApi = new InterfaceControllerApi(
      undefined,
      baseURL,
      this.client
    );
    this.KeycloakControllerApi = new KeycloakControllerApi(
      undefined,
      baseURL,
      this.client
    );
    this.MessageControllerApi = new MessageControllerApi(
      undefined,
      baseURL,
      this.client
    );
    this.RepositoryControllerApi = new RepositoryControllerApi(
      undefined,
      baseURL,
      this.client
    );
    this.SchemaControllerApi = new SchemaControllerApi(
      undefined,
      baseURL,
      this.client
    );
  };

  responseInterceptor = (
    response: AxiosResponse<any, any>
  ): AxiosResponse<any, any> | Promise<AxiosResponse<any, any>> => {
    const { data, headers } = response;

    if (data && data.success) {
      if (data.pagination_info) {
        return {
          ...response,
          data: {
            paginatedData: data.result,
            pagination_info: data.pagination_info,
          },
        };
      }
      return {
        ...response,
        data: data.result,
      };
    }
    if (headers["content-type"] !== "application/json") {
      return response;
    }

    log.error("[AxiosInterceptor] Not following response standard", response);
    return Promise.reject({
      ...response,
      data: data.error,
    });
  };

  rejectInterceptor = (error: AxiosError): Promise<never> => {
    if (error.response) {
      log.error("[AxiosInterceptor]", error.response.status);
      switch (error.response.status) {
        case 400:
          log.error("[AxiosInterceptor] Bad Request");
          break;
        case 401:
          log.error("[AxiosInterceptor] UnAuthorized");
          break;
        case 403:
          log.error("[AxiosInterceptor] Forbidden");
          break;
        case 404:
          log.error("[AxiosInterceptor] Not Found");
          break;
      }
    }
    return Promise.reject(error);
  };
}

export default AxiosClient;

import axios,  { Axios, AxiosRequestConfig, AxiosError } from "axios";

export class HttpClient {
  private static get config(): AxiosRequestConfig {
    return {
      // On the browser we will have '/', on server side HOST value (HOST will be defined in Kubernetes configs)
      baseURL: process.env.HOST || "/",
    };
  }

  constructor(private request = new Axios(HttpClient.config)) {}

  get = this.request.get;
  put = this.request.put;
  post = this.request.post;
  delete = this.request.delete;
  patch = this.request.patch;

  static isHttpError = axios.isAxiosError;
}

export type HttpHeaders = Record<string, string | number | boolean>;

export interface HttpError extends AxiosError{}
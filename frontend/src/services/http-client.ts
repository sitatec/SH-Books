import axios, { AxiosRequestConfig } from "axios";

// The purpose of this class is to completely hide the axios API and make all
// our components and services that require http calls to depend on our own API.
// This will improve our app's maintainability by making it almost seamless
// to upgrade axios even if the new version contain breaking changes.

// This way, only this class will be affected by any breaking changes or
// an eventual replacement of axios by another client.

export class HttpClient {
  private static get config(): AxiosRequestConfig {
    return {
      // On the browser we will have '/', on server side HOST value (HOST will be defined in Kubernetes configs)
      baseURL: process.env.HOST || "/",
    };
  }

  constructor(private request = axios.create(HttpClient.config)) {}

  get: HttpCall = (url, options) => {
    return this.request.get(url, options);
  };

  put: HttpCall = (url, options) => {
    return this.request.put(url, options?.data, { headers: options?.headers });
  };

  post: HttpCall = (url, options) => {
    return this.request.post(url, options?.data, { headers: options?.headers });
  };

  delete: HttpCall = (url, options) => {
    return this.request.delete(url, options);
  };

  patch: HttpCall = (url, options) => {
    return this.request.patch(url, options?.data, {
      headers: options?.headers,
    });
  };

  static isHttpError(object: any): object is HttpError {
    return axios.isAxiosError(object);
  }
}

export type HttpHeaders = Record<string, string | number | boolean>;

export interface HttpError extends Error {
  response: HttpResponse;
}

export interface HttpRequestOptions {
  headers?: HttpHeaders;
  data?: any;
}

interface HttpResponse {
  data?: any;
  statusCode: number;
  headers: HttpHeaders;
}

type HttpCall = (
  url: string,
  options?: HttpRequestOptions
) => Promise<HttpResponse>;

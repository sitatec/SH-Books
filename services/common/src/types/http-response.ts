import { JsonObject } from ".";

export type HttpResponse = HttpErrorResponse | HttpSuccessResponse;

export interface HttpSuccessResponse {
  data: JsonObject;
}

export interface HttpErrorResponse {
  errors: { message: string; input?: Input }[];
}

interface Input {
  key: string;
  value: string;
}

export default HttpResponse;

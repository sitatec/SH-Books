import { JsonObject } from ".";

export type HttpResponse = HttpErrorResponse | HttpSuccessResponse;

export interface HttpSuccessResponse {
  status: "success";
  data: JsonObject;
}

export interface HttpErrorResponse {
  status: ResponseStatusMessage;
  errors: { message: string; input?: Input }[];
}

export type ResponseStatusMessage =
  | "invalid-input-format"
  | "invalid-input"
  | "server-error"
  | "bad-request"
  | "not-found"
  | "unknown";

interface Input {
  key: string;
  value: string;
}

export default HttpResponse;

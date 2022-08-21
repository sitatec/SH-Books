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
  | "invalid-input"
  | "server-error"
  | "not-found"
  | "unknown"
  | "invalid-input-format";

interface Input {
  key: string;
  value: string;
}

export default HttpResponse;

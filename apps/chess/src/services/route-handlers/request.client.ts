import {toast} from "sonner";
import {ROUTE_HANDLER_ERROR, RouteHandlerSuccess} from "./models";
import {parseError} from "@/lib/error";

const api = {
  get: <T = unknown>({
    url,
    options,
  }: {
    url: string;
    options?: Omit<RequestInit, "body" | "method">;
  }) => request<T>({url, options: {...(options ?? {}), method: "GET"}}),
  post: <T = unknown>({
    url,
    data,
    options,
  }: {
    url: string;
    data?: unknown;
    options?: Omit<RequestInit, "body" | "method">;
  }) => request<T>({url, data, options: {...(options ?? {}), method: "POST"}}),
  delete: <T = unknown>({
    url,
    data,
    options,
  }: {
    url: string;
    data?: unknown;
    options?: Omit<RequestInit, "body" | "method">;
  }) => request<T>({url, data, options: {...(options ?? {}), method: "DELETE"}}),
};

export {api};

async function request<T>({
  url,
  data,
  options,
}: {
  url: string;
  data?: unknown;
  options: Omit<RequestInit, "body">;
}) {
  try {
    const res = await fetch(url, {
      ...(data ? {body: JSON.stringify(data)} : {}),
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    return await handleResponse<T>(res);
  } catch (error) {
    if (error instanceof RouteHandlerError) {
      toast.error(`${error.status}: ${error.message}`);
      return;
    }

    const message = parseError(error);
    toast.error(message);
  }
}

async function handleResponse<T>(res: Response) {
  const resData = await res.json();

  if (!res.ok) {
    throw RouteHandlerError.fromResponse(res, resData);
  }

  // maybe zod in future
  return resData as RouteHandlerSuccess<T>;
}

class RouteHandlerError extends Error {
  public status: number;
  public statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }

  static fromResponse(res: Response, resData: unknown) {
    const parsedError = ROUTE_HANDLER_ERROR.safeParse(resData);

    const message = parsedError.success
      ? parsedError.data.error
      : "An error occurred while fetching the data.";

    return new RouteHandlerError(message, res.status, res.statusText);
  }
}

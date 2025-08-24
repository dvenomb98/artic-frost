import {toast} from "sonner";
import {ROUTE_HANDLER_ERROR, RouteHandlerSuccess} from "./models";

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

    return handleResponse<T>(res);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An error occurred while fetching the data.");
    }
  }
}

async function handleResponse<T>(res: Response) {
  const resData = await res.json();

  if (!res.ok) {
    handleResponseError(resData);
    return;
  }

  // maybe zod in future
  return resData as RouteHandlerSuccess<T>;
}

function handleResponseError(error: unknown) {
  const parsedError = ROUTE_HANDLER_ERROR.safeParse(error);
  if (!parsedError.success) {
    toast.error("An error occurred while fetching the data.");
    return;
  }

  toast.error(parsedError.data.error);
}

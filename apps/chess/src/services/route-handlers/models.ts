import {z} from "zod/v4";

/**
 * Error model for internal API
 */
const ROUTE_HANDLER_ERROR = z.object({
  error: z.string(),
});

type RouteHandlerError = z.infer<typeof ROUTE_HANDLER_ERROR>;

type RouteHandlerSuccess<T> = {
  data: T;
};

export {type RouteHandlerError, type RouteHandlerSuccess, ROUTE_HANDLER_ERROR};

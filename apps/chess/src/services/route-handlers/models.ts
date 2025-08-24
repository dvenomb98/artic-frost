import {z} from "zod/v4";

/**
 * Error model for internal API
 */
const ROUTE_HANDLER_ERROR = z.object({
  error: z.string()
});

type RouteHandlerError = z.infer<typeof ROUTE_HANDLER_ERROR>;

/**
 * Response model for internal API
 */
const ROUTE_HANDLER_SUCCESS = z.object({
  data: z.unknown(),
});

type RouteHandlerSuccess = z.infer<typeof ROUTE_HANDLER_SUCCESS>;

export {
  type RouteHandlerError,
  ROUTE_HANDLER_ERROR,
  type RouteHandlerSuccess,
  ROUTE_HANDLER_SUCCESS,
};
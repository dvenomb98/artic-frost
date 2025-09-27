import {z} from "zod/v4";

/**
 * Success codes for internal API
 */
const SUCCESS_CODES = {
  OK: 200,
} as const;

/**
 * Error codes for internal API
 */
const ERROR_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error model for internal API
 */
const ROUTE_HANDLER_ERROR = z.object({
  error: z.string(),
  ok: z.literal(false),
});

type RouteHandlerError = z.infer<typeof ROUTE_HANDLER_ERROR>;

/**
 * Success model for internal API
 */
type RouteHandlerSuccess<T = unknown> =
  | {
      data: T;
      ok: true;
    }
  | {
      data: null;
      ok: false;
    };

export {
  type RouteHandlerError,
  type RouteHandlerSuccess,
  ROUTE_HANDLER_ERROR,
  ERROR_CODES,
  SUCCESS_CODES,
};

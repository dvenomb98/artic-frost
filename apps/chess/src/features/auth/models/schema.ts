import {z} from "zod";

const SIGN_IN_SCHEMA = z.object({
  email: z.string().email("Email format is invalid!"),
  password: z.string().min(6, "Minimum password length is 6!"),
});

const SIGN_UP_SCHEMA = z.object({
  email: z.string().email("Email format is invalid!"),
  password: z.string().min(6, "Minimum password length is 6!"),
});

const RESET_PASSWORD_SCHEMA = z.object({
  email: z.string().email("Email format is invalid!"),
});

const UPDATE_PASSWORD_SCHEMA = z.object({
  password: z.string().min(6, "Minimum password length is 6!"),
  confirmPassword: z
    .string()
    .min(6, "Confirmation password does not have min 6 characters."),
});

export {
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  UPDATE_PASSWORD_SCHEMA,
};

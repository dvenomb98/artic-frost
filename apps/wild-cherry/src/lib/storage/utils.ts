import {z} from "zod";

import {LocalStorageKeysType} from "./const";

/**
 * Retrieves and safely parses data from local storage using a Zod schema.
 * @param key - Key of the data in local storage
 * @param schema - Zod schema to parse the data with
 * @returns Data parsed according to the schema or null if the data is not present or parsing fails
 */
const getSafeStorageData = <T extends z.ZodType>(
  key: LocalStorageKeysType,
  schema: T
) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  const result = schema.parse(JSON.parse(data));

  return result as z.infer<T>;
};

/**
 * Sets data in local storage after parsing it with a Zod schema.
 * @param key - Key of the data in local storage
 * @param data - Data to set in local storage
 * @param schema - Zod schema to parse the data with
 */
const setSafeStorageData = <T extends z.ZodType>(
  key: LocalStorageKeysType,
  data: z.infer<T>,
  schema: T
) => {
  if (!data) {
    return;
  }

  const result = schema.parse(data);

  localStorage.setItem(key, JSON.stringify(result));
};

/**
 * Deletes data from local storage.
 * @param key - Key of the data in local storage
 * @returns void
 */
const deleteStorageData = (key: LocalStorageKeysType) => {
  localStorage.removeItem(key);
};

export {getSafeStorageData, setSafeStorageData, deleteStorageData};

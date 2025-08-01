const LOCAL_STORAGE_KEYS = {
  CHERRY_STATE: "cherry_state",
} as const;

type LocalStorageKeysType =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];

export {LOCAL_STORAGE_KEYS, type LocalStorageKeysType};

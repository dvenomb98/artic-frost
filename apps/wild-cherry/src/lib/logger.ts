const LOGGER = {
  log: (message: string, ...args: unknown[]) => {
    console.log(message, ...args);
  },
  error: (message: string, error?: Error) => {
    console.error(message, error);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
  },
};

export {LOGGER};

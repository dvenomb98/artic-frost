const log = {
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
  },
  log: (message: string, ...args: unknown[]) => {
    console.log(message, ...args);
  },
};

export {log};

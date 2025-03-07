function groupBy<T>(
  arr: T[],
  key: string
): Record<string | number | symbol, T[]> {
  return arr.reduce((acc: Record<string | number | symbol, T[]>, item) => {
    const keyValue = key.split(".").reduce((obj: any, k) => obj?.[k], item);
    acc[String(keyValue)] = [...(acc[String(keyValue)] || []), item];
    return acc;
  }, {});
}

export {groupBy};

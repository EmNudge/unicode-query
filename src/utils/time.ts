export const time = async <T>(
  title: string,
  func: () => T | Promise<T>,
  onFinish?: (val: T) => void,
) => {
  console.time(title);
  const val = await func();
  console.timeEnd(title);
  onFinish?.(val);
  return val;
};
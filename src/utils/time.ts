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

const BENCH_ITERATIONS = 500;
export const bench = async <T>(
  title: string,
  func: () => T | Promise<T>,
  iterations = BENCH_ITERATIONS,
) => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await func();
  }
  const end = performance.now();
  const avgTime = (end - start) / iterations
  
  console.log(title, ':', avgTime);
};
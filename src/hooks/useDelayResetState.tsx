import { useEffect, useState } from 'react';

export default function useDelayResetState<T>(theValue: T, delay: number) {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    setValue(theValue);
    const handler = setTimeout(() => {
      setValue(null);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [setValue, theValue, delay]);

  return value;
}

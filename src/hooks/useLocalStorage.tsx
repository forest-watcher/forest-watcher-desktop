export const useLocalStorage = () => {
  const get = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  const set = (key: string, value: string): void => {
    return localStorage.setItem(key, value);
  };

  return { get, set };
};

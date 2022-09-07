import { useEffect } from "react";

export const useSetBodyBackground = (color: string) => {
  useEffect(() => {
    document.body.style.background = color;

    return () => {
      //@ts-ignore
      document.body.style.background = null;
    };
  }, [color]);
};

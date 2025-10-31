import { useEffect } from "react";

export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (locked) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = previousOverflow;
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [locked]);
};

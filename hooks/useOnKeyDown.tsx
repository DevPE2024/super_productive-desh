import { RefObject, useEffect } from "react";

export const useOnKeyDown = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: KeyboardEvent) => void
) => {
  useEffect(() => {
    // Verificar se estamos no cliente antes de acessar document
    if (typeof window === 'undefined') return;
    
    const listener = (event: KeyboardEvent) => {
      if (ref.current && ref.current.contains(document.activeElement))
        handler(event);
    };
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [ref, handler]);
};


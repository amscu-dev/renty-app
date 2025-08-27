import { useEffect } from "react";

export function useModality() {
  useEffect(() => {
    const setPointer = () =>
      (document.documentElement.dataset.modality = "pointer");
    const setKeyboard = (e: KeyboardEvent) => {
      // consideră taste de navigare/focus

      if (e.key) {
        if (
          e.key === "Tab" ||
          e.key.startsWith("Arrow") ||
          e.key === "Enter" ||
          e.key === " "
        ) {
          document.documentElement.dataset.modality = "keyboard";
        }
      }
    };
    window.addEventListener("mousedown", setPointer, true);
    window.addEventListener("touchstart", setPointer, true);
    window.addEventListener("keydown", setKeyboard, true);
    return () => {
      window.removeEventListener("mousedown", setPointer, true);
      window.removeEventListener("touchstart", setPointer, true);
      window.removeEventListener("keydown", setKeyboard, true);
    };
  }, []);
}

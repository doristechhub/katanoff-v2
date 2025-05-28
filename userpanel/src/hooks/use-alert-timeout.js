import { messageType } from "@/_helper/constants";
import { useEffect } from "react";

// ----------------------------------------------------------------------

export function useAlertTimeout({ message, type }, action, delay = 3000) {
  useEffect(() => {
    if (type === messageType.SUCCESS || type === messageType.INFO) {
      const timeoutId = setTimeout(() => {
        action();
      }, delay);

      return () => clearTimeout(timeoutId); // Cleanup on component unmount
    }
  }, [message, action, delay, type]);

  return null;
}

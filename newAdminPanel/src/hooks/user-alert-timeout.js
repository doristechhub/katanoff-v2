import { useEffect } from 'react';
import { messageType } from 'src/_helpers/constants';

// ----------------------------------------------------------------------

export function useAlertTimeout({ message, type }, action, delay = 3000) {
  useEffect(() => {
    if (type === messageType.SUCCESS || type === messageType.INFO) {
      const timeoutId = setTimeout(() => {
        action();
      }, delay);

      return () => clearTimeout(timeoutId); // Cleanup on component unmount
    }
  }, [message, action, delay]);

  return null;
}

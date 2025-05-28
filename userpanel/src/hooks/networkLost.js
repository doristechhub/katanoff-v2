import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNetworkErrMessage } from "../store/actions/commonActions";

export const useNetworkLost = (ref, handler) => {
  const dispatch = useDispatch();
  // On initization set the isOnline state.
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      dispatch(
        setNetworkErrMessage({
          networkErrMsg: navigator.onLine ? "" : "No internet connection",
        })
      );
    };
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handler]);
};

import { userService } from "@/_services";
import {
  setLoginMessage,
  setSendOtpLoading,
  setUpdateProfileLoader,
  setUserProfile,
  setSendOtpMessage,
  setUserRegisterLoading,
  setUserRegisterMessage,
  setVerifyOtpLoading,
  setUserProfileMessage,
  setUserLoading,
} from "@/store/slices/userSlice";
import { messageType } from "@/_helper/constants";

export const SendOTPForEmailVerification = (payload) => async (dispatch) => {
  try {
    dispatch(setLoginMessage({ message: "", type: "" }));
    dispatch(setSendOtpMessage({ message: "", type: "" }));
    dispatch(setSendOtpLoading(true));
    const respData = await userService.sendOTPForVerificationEmail(
      payload,
      dispatch
    );
    return respData;
  } catch (e) {
    dispatch(
      setSendOtpMessage({
        message: e.message || "something went wrong",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setSendOtpLoading(false));
  }
};

export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    const userProfile = await userService.getUserProfile(userId);
    dispatch(setUserProfile(userProfile || {}));
    dispatch(setUserLoading(false));
  } catch (e) {
    dispatch(
      setUserProfileMessage({
        message: e?.message || "something went wrong",
        type: messageType.ERROR,
      })
    );
    dispatch(setUserProfile({}));
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const updateUserProfile = (payload, userData) => async (dispatch) => {
  try {
    dispatch(setUpdateProfileLoader(true));
    const updatedUserProfile = await userService.updateUserProfile(payload);
    dispatch(setUpdateProfileLoader(false));

    if (updatedUserProfile) {
      dispatch(setUserProfile(updatedUserProfile));
      return true;
    }
    return false;
  } catch (e) {
    dispatch(
      setUserProfileMessage({
        message: e?.message || "something went wrong",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setUpdateProfileLoader(false));
  }
};
export const createUser = (payload) => async (dispatch) => {
  try {
    dispatch(setUserRegisterMessage({ message: "", type: "" }));
    dispatch(setUserRegisterLoading(true));
    const userData = await userService.insertUser(payload);
    if (userData) {
      dispatch(
        setUserRegisterMessage({
          message: "Your account has been registered successfully.",
          type: messageType.SUCCESS,
        })
      );
    }
    return userData;
  } catch (e) {
    dispatch(
      setUserRegisterMessage({
        message: e?.message || "something went wrong",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setUserRegisterLoading(false));
  }
};

export const verifyOTP = (payload) => async (dispatch) => {
  try {
    dispatch(setLoginMessage({ message: "", type: "" }));
    dispatch(setVerifyOtpLoading(true));

    const response = await userService.verifyOtp(payload, dispatch);
    if (response) {
      return response;
    }
  } catch (e) {
    dispatch(
      setLoginMessage({
        message: e?.message || "something went wrong",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setVerifyOtpLoading(false));
  }
};

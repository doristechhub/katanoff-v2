import { uid } from "uid";
import {
  adminUrl,
  apiUrl,
  fetchWrapperService,
  sanitizeObject,
  sanitizeValue,
  userUrl,
} from "@/_helper";
import { messageType } from "@/_helper/constants";
import { setLoginMessage, setSendOtpMessage } from "@/store/slices/userSlice";
import axios from "axios";
const bcrypt = require("bcryptjs");

export const sendSignupDiscountMail = async (email) => {
  try {
    if (!email)
      throw new Error("Email is required to send the signup discount mail");

    const sanitized = sanitizeObject({ email });

    const response = await axios.post(
      `${apiUrl}/user/signup-with-discount`,
      sanitized
    );

    return response.data;
  } catch (error) {
    console.error("Error sending signup discount mail:", error);
    throw error;
  }
};

const insertUser = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!navigator.onLine) {
        reject(new Error("No internet connection"));
        return;
      }

      const uuid = uid();
      let {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        isSignUpOffer,
      } = sanitizeObject(params);
      firstName = firstName ? firstName.trim() : null;
      lastName = lastName ? lastName.trim() : null;
      email = email ? email.trim() : null;
      password = password ? password.trim() : null;
      confirmPassword = confirmPassword ? confirmPassword.trim() : null;
      if (
        firstName &&
        lastName &&
        email &&
        password &&
        confirmPassword &&
        uuid
      ) {
        const findPattern = { email: email };
        const userData = await fetchWrapperService.findOne(
          userUrl,
          findPattern
        );
        const adminData = await fetchWrapperService.findOne(
          adminUrl,
          findPattern
        );
        if (adminData) {
          reject(
            new Error(
              "Account Already Exists in Admin Panel. Use Another EmailID"
            )
          );
          return;
        }

        if (!userData) {
          if (password === confirmPassword) {
            const hash = bcrypt.hashSync(password, 12);
            const insertPattern = {
              id: uuid,
              firstName,
              lastName,
              email,
              password: hash,
              createdDate: Date.now(),
              updatedDate: Date.now(),
            };

            const createPattern = {
              url: `${userUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                if (isSignUpOffer) {
                  sendSignupDiscountMail(email);
                }
                // const mailPayload = {
                //   email
                // }
                // sendWelcomeMail(mailPayload)
                resolve(insertPattern);
              })
              .catch((e) => {
                reject(new Error("An error occurred during user creation."));
              });
          } else {
            reject(new Error("Password mismatch!...try again!"));
          }
        } else {
          reject(new Error("You already have an account please Login"));
        }
      } else {
        reject(new Error("invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getUserProfile = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      userId = sanitizeValue(userId) ? userId.trim() : null;

      if (userId) {
        const getUserData = await fetchWrapperService.findOne(userUrl, {
          id: userId,
        });
        if (getUserData) {
          resolve(getUserData);
        } else {
          reject(new Error("User does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserProfile = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { userId, firstName, lastName } = sanitizeObject(params);
      firstName = firstName ? firstName.trim() : null;
      lastName = lastName ? lastName.trim() : null;
      if (userId) {
        const userData = await fetchWrapperService.findOne(userUrl, {
          id: userId,
        });
        if (userData) {
          const payload = {
            firstName: firstName ? firstName : userData.firstName,
            lastName: lastName ? lastName : userData.lastName,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${userUrl}/${userId}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              resolve(payload);
            })
            .catch((e) => {
              reject(
                new Error("An error occurred during update user profile.")
              );
            });
        } else {
          reject(new Error("user not found!"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

// const verifyOtp = (payload, abortController) => async (dispatch) => {
//   try {
//     dispatch(handleVerifyOtpError({ setVerifyOtpError: "" }));
//     if (Object.keys(payload).length) {
//       const signal = abortController && abortController.signal;
//       const response = await axios.post(
//         "/user/verifyOtp",
//         sanitizeObject(payload),
//         { signal }
//       );
//       const { status, message } = response.data;

//       if (status === 200) {
//         // toasterService.success("Logged in successfully");
//         return response.data;
//       } else {
//         dispatch(handleVerifyOtpError({ setVerifyOtpError: message }));
//         return false;
//       }
//     } else {
//       dispatch(handleVerifyOtpError({ setVerifyOtpError: "Invalid Data" }));
//       return false;
//     }
//   } catch (error) {
//     if (error.code === "ERR_NETWORK")
//       dispatch(handleVerifyOtpError({ setVerifyOtpError: error?.message }));
//     console.log("verify otp error : ", error?.message);
//     return false;
//   }
// };

// const getUserProfile = (userId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       userId = sanitizeValue(userId) ? userId.trim() : null;

//       if (userId) {
//         const getUserData = await fetchWrapperService.findOne(userUrl, {
//           id: userId,
//         });
//         if (getUserData) {
//           resolve(getUserData);
//         } else {
//           reject(new Error("User does not exist"));
//         }
//       } else {
//         reject(new Error("Invalid data"));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// const updateUserProfile = (params) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let { userId, firstName, lastName } = sanitizeObject(params);
//       firstName = firstName ? firstName.trim() : null;
//       lastName = lastName ? lastName.trim() : null;
//       if (userId) {
//         const userData = await fetchWrapperService.findOne(userUrl, {
//           id: userId,
//         });
//         if (userData) {
//           const payload = {
//             firstName: firstName ? firstName : userData.firstName,
//             lastName: lastName ? lastName : userData.lastName,
//             updatedDate: Date.now(),
//           };
//           const updatePattern = {
//             url: `${userUrl}/${userId}`,
//             payload: payload,
//           };
//           fetchWrapperService
//             ._update(updatePattern)
//             .then((response) => {
//               resolve(payload);
//             })
//             .catch((e) => {
//               reject(
//                 new Error("An error occurred during update user profile.")
//               );
//             });
//         } else {
//           reject(new Error("user not found!"));
//         }
//       } else {
//         reject(new Error("Invalid Data"));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const sendOTPForVerificationEmail = async (payload, dispatch) => {
  try {
    if (Object.keys(payload).length) {
      const response = await axios.post(
        `${apiUrl}/user/sendOtpForEmailVerification`,
        sanitizeObject(payload)
      );
      let { status, message } = response.data;

      if (status === 200) {
        dispatch(
          setSendOtpMessage({
            message: "OTP sent to your email address.",
            type: messageType.SUCCESS,
          })
        );
        return true;
      }
      dispatch(
        setSendOtpMessage({
          message,
          type: messageType.ERROR,
        })
      );
      return false;
    } else {
      dispatch(
        setSendOtpMessage({ message: "Invalid Data", type: messageType.ERROR })
      );
      return false;
    }
  } catch (error) {
    dispatch(
      setSendOtpMessage({ message: error.message, type: messageType.ERROR })
    );
    return false;
  }
};

const verifyOtp = async (payload, dispatch) => {
  try {
    if (Object.keys(payload).length) {
      const response = await axios.post(
        `${apiUrl}/user/verifyOtp`,
        sanitizeObject(payload)
      );
      let { status, message, userData } = response.data;

      if (status === 200) {
        dispatch(
          setLoginMessage({
            message: "You have logged in successfully.",
            type: messageType.SUCCESS,
          })
        );
        return response.data;
      }
      dispatch(
        setLoginMessage({
          message,
          type: messageType.ERROR,
        })
      );
      return false;
    } else {
      dispatch(
        setLoginMessage({ message: "Invalid Data", type: messageType.ERROR })
      );
      return false;
    }
  } catch (error) {
    dispatch(
      setLoginMessage({ message: error.message, type: messageType.ERROR })
    );
    return false;
  }
};

export const userService = {
  insertUser,
  sendOTPForVerificationEmail,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
};

import axios from "axios";
import { helperFunctions } from "@/_helper";

// Header Methods
export const setAuthToken = async () => {
  try {
    const userData = helperFunctions.getCurrentUser();

    const access_Token = userData?.token;
    if (access_Token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ` + access_Token;
    }
  } catch (e) {
    console.log("Error while setup token", e);
  }
};

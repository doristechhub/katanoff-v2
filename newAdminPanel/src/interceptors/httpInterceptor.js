import axios from 'axios';
import { helperFunctions } from '../_helpers/helperFunctions';
import { getAppCheckToken } from '../firebase';

// Header Methods
export const setAuthToken = async () => {
  try {
    const adminData = helperFunctions.getCurrentUser();
    const access_Token = adminData?.token;
    // const appCheckTokenResponse = await getAppCheckToken();
    axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
    // axios.defaults.headers.common["X-Firebase-AppCheck"] =
    //   appCheckTokenResponse?.token;
  } catch (e) {
    console.log('Error while setup token', e);
  }
};

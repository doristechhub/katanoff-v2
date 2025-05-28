import axios from "axios";

const errorInterceptor = (navigate) => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { status } = error?.response || {};
      if (status === 401) {
         navigate('/');
        return error?.response
      }
      return Promise.reject(error);
    }
  );
};

export default errorInterceptor
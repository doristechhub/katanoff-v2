import axios from "axios";

const errorInterceptor = (router) => {
  if (typeof window !== "undefined") {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 401) {
          // router.push("/");
          return Promise.resolve(error?.response);
        }
        if (error.isAxiosError && error.response === undefined) {
          console.error("Network error occurred:", error.message);
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  }
};

export default errorInterceptor;

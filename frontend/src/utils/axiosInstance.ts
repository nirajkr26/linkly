import axios, { 
  type AxiosInstance, 
  type AxiosResponse, 
  type AxiosError, 
  type InternalAxiosRequestConfig 
} from "axios";

/**
 * Custom error structure returned by our interceptor
 */
export interface CustomAxiosError {
  message: string;
  status?: number;
  data?: any;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  timeout: 10000, // 10s
  withCredentials: true
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code within the range of 2xx
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Handle different types of errors
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data);
          break;
        case 401:
          console.error("Unauthorized: User not logged in", data);
          break;
        case 403:
          console.error("Forbidden: Insufficient permissions", data);
          break;
        case 404:
          console.error("Not Found:", data);
          break;
        case 500:
          console.error("Server Error:", data);
          break;
        default:
          console.error(`Error (${status}):`, data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error: No response received", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Setup Error:", error.message);
    }

    // Prepare a safe error object for the frontend
    const customError: CustomAxiosError = {
      message: error.response?.data?.message || error.message || "Unknown error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export default axiosInstance;
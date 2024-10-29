import axios from 'axios';
import toast from 'react-hot-toast';

async function apiCall(
  method: string,
  url: string,
  data: any,
  headers?: any
) {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Throw a server-side error with the message from the server response
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      // Handle network errors specifically
      toast.error("Network error occurred, please check your connection.");
      throw new Error("Network Error");
    } else {
      // Handle other unexpected errors
      throw new Error(error.message);
    }
  }
}

export default apiCall;

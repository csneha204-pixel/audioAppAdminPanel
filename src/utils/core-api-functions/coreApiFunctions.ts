/* eslint-disable no-useless-catch */
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return accessToken;
    }
  }
  return null;
};

// Common headers with token
const getHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// GET request method
export const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.get<T>(url, {
      ...config,
      withCredentials: true,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST request method
export const postRequest = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.post<T>(url, data, {
      ...config,
      withCredentials: true,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request method
export const deleteRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.delete<T>(url, {
      ...config,
      withCredentials: true,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT request method
export const putRequest = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.put<T>(url, data, {
      ...config,
      withCredentials: true,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

import axios from "axios";
import { env } from "../env";

const BASE_URL = env.VITE_API_URL;

export const get = async (url: string, params?: any) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${url}`,
      params ? { withCredentials: true, params } : { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    handleStatusCodes(error.response.status);
    throw error;
  }
};

export const create = async (url: string, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/${url}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    handleStatusCodes(error.response.status);
    throw error;
  }
};

export const update = async (url: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/${url}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    handleStatusCodes(error.response.status);
    throw error;
  }
};

export const remove = async (url: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${url}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    handleStatusCodes(error.response.status);
    throw error;
  }
};

export const upload = async (
  url: string,
  formData: FormData,
  onUploadProgress: (e: any) => void,
  method?: "post" | "put"
) => {
  try {
    const req = method && method === 'put' ? axios.put : axios.post 
    const response = await req(`${BASE_URL}/${url}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error: any) {
    handleStatusCodes(error.response.status);
    throw error;
  }
};

function handleStatusCodes(status: number) {
  switch (status) {
    case 401:
      window.location.replace("/auth");
  }
}

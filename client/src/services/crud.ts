import axios from "axios";
const env = import.meta.env;
const BASE_URL = env.VITE_API_URL;

export const create = async (url: string, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/${url}`, data);
    return response.data;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const get = async (url: string, params: any) => {
  // TODO: add query params if any
  try {
    const response = await axios.get(
      `${BASE_URL}/${url}`,
      params ? { params } : {}
    );
    return response.data;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const update = async (url: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/${url}`, data);
    return response.data;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const remove = async (url: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${url}/`);
    return response.data;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

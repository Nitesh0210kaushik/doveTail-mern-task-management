import axios from 'axios';
import { clientEnv } from './env';

export const axiosClient = axios.create({
  baseURL: clientEnv.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

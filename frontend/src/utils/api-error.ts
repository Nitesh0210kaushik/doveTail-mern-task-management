import axios from 'axios';

interface ApiErrorBody {
  message?: string;
  field?: string;
}

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return fallback;

  if (!error.response) return 'Unable to connect to the server. Please try again.';
  if (error.response.status === 429) return 'Too many attempts. Please wait a few minutes and try again.';

  const message = error.response.data?.message;
  return message || fallback;
};

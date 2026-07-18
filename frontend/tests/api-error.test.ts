import { describe, expect, it } from 'vitest';
import { AxiosError } from 'axios';
import { getApiErrorMessage } from '../src/utils/api-error';

describe('getApiErrorMessage', () => {
  it('returns the API message when a response is available', () => {
    const error = new AxiosError('Request failed');
    error.response = { data: { message: 'Invalid email or password' }, status: 401 } as never;

    expect(getApiErrorMessage(error)).toBe('Invalid email or password');
  });

  it('returns a connection message when the server is unreachable', () => {
    expect(getApiErrorMessage(new AxiosError('Network Error'))).toBe('Unable to connect to the server. Please try again.');
  });

  it('returns the fallback for unknown errors', () => {
    expect(getApiErrorMessage(new Error('Unexpected error'), 'Fallback message')).toBe('Fallback message');
  });
});

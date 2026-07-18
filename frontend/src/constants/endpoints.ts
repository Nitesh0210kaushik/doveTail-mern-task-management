export const ENDPOINTS = {
  auth: {
    csrf: '/auth/csrf',
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me'
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    byId: (id: string) => `/tasks/${id}`
  },
  health: '/health'
} as const;

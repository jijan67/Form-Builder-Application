import { api } from '../services/api';

const authMethods = ['login', 'register', 'getCurrentUser'] as const;
type AuthMethod = typeof authMethods[number];

export const fetchWrapper = async (url: string, options?: RequestInit) => {
  if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    const path = url.split('/api/')[1];
    const [resource, ...params] = path.split('/');

    switch (resource) {
      case 'templates':
        return params.length ? api.templates.getById(params[0]) : api.templates.getAll();
      case 'auth':
        if (params[0] && authMethods.includes(params[0] as AuthMethod)) {
          return api.auth[params[0] as AuthMethod]();
        }
        return null;
      default:
        return null;
    }
  }

  // Real API call
  const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, options);
  if (!response.ok) throw new Error('API call failed');
  return response.json();
}; 
import { mockTemplates, mockUser } from './mockData';

export const api = {
  auth: {
    login: async () => ({ user: mockUser, token: 'mock-token' }),
    register: async () => ({ user: mockUser, token: 'mock-token' }),
    getCurrentUser: async () => mockUser,
  },
  templates: {
    getAll: async () => mockTemplates,
    getById: async (id: string) => mockTemplates.find(t => t.id === id),
    create: async (data: any) => ({ ...data, id: Date.now().toString() }),
    update: async (id: string, data: any) => ({ ...data, id }),
    delete: async (id: string) => true,
  },
  // Add more mock endpoints...
}; 
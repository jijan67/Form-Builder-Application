import { Template, FormResponse, User, Topic, Tag } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jijan',
    email: 'jijan@gmail.com',
    password: 'Jijan076', // Now TypeScript won't complain
    isAdmin: true,
    isBlocked: false,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    isBlocked: false,
    createdAt: new Date()
  },
  // Add more users...
];

export const mockUser = mockUsers[0];

// Mock Topics
export const mockTopics: Topic[] = [
  { id: '1', name: 'Education', createdAt: new Date() },
  { id: '2', name: 'Quiz', createdAt: new Date() },
  { id: '3', name: 'Feedback', createdAt: new Date() },
  { id: '4', name: 'Employment', createdAt: new Date() },
  { id: '5', name: 'Other', createdAt: new Date() },
];

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'job', count: 5 },
  { id: '2', name: 'career', count: 3 },
  { id: '3', name: 'tech', count: 8 },
  { id: '4', name: 'education', count: 6 },
  { id: '5', name: 'feedback', count: 4 },
];

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Job Application Form',
    description: 'Application form for software developer position',
    topic: 'Employment',
    imageUrl: 'https://example.com/job.jpg',
    tags: ['job', 'career', 'tech'],
    author: mockUser,
    questions: [
      {
        id: '1',
        title: 'Position',
        description: 'What position are you applying for?',
        type: 'text',
        order: 0,
        showInResults: true,
      },
      {
        id: '2',
        title: 'Experience',
        description: 'Years of experience',
        type: 'integer',
        order: 1,
        showInResults: true,
      },
      {
        id: '3',
        title: 'Contact',
        description: 'Phone number or Skype',
        type: 'text',
        order: 2,
        showInResults: true,
      },
      {
        id: '4',
        title: 'Additional Information',
        description: 'Write anything in the field below',
        type: 'multi-line',
        order: 3,
        showInResults: false,
      }
    ],
    isPublic: true,
    allowedUsers: [],
    responses: [],
    comments: [
      {
        id: '1',
        content: 'Great template!',
        user: mockUsers[1],
        createdAt: new Date(),
      }
    ],
    likedBy: [mockUsers[1]],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Customer Feedback Survey',
    description: 'Help us improve our services with your valuable feedback',
    topic: 'Feedback',
    imageUrl: 'https://example.com/feedback.jpg',
    tags: ['feedback', 'customer', 'survey'],
    author: mockUsers[1],
    questions: [
      {
        id: '5',
        title: 'Overall Rating',
        description: 'How would you rate our service (1-5)?',
        type: 'integer',
        order: 0,
        showInResults: true,
      },
      {
        id: '6',
        title: 'Best Feature',
        description: 'What do you like most about our service?',
        type: 'text',
        order: 1,
        showInResults: true,
      },
      {
        id: '7',
        title: 'Improvements',
        description: 'What could we improve?',
        type: 'multi-line',
        order: 2,
        showInResults: true,
      },
      {
        id: '8',
        title: 'Subscribe',
        description: 'Would you like to receive updates?',
        type: 'checkbox',
        order: 3,
        showInResults: false,
      }
    ],
    isPublic: true,
    allowedUsers: [],
    responses: [],
    comments: [],
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Programming Quiz',
    description: 'Test your programming knowledge',
    topic: 'Quiz',
    imageUrl: 'https://example.com/quiz.jpg',
    tags: ['tech', 'education', 'quiz'],
    author: mockUser,
    questions: [
      {
        id: '9',
        title: 'Programming Experience',
        description: 'Years of programming experience',
        type: 'integer',
        order: 0,
        showInResults: true,
      },
      {
        id: '10',
        title: 'Favorite Language',
        description: 'What is your favorite programming language?',
        type: 'text',
        order: 1,
        showInResults: true,
      }
    ],
    isPublic: false,
    allowedUsers: [mockUsers[1]],
    responses: [],
    comments: [],
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock Responses
export const mockResponses: FormResponse[] = [
  {
    id: '1',
    template: mockTemplates[0],
    user: mockUsers[1],
    answers: [
      {
        questionId: '1',
        value: 'Frontend Developer'
      },
      {
        questionId: '2',
        value: 5
      },
      {
        questionId: '3',
        value: '+1234567890'
      },
      {
        questionId: '4',
        value: 'I am passionate about web development...'
      }
    ],
    createdAt: new Date(),
    emailCopySent: false
  },
  {
    id: '2',
    template: mockTemplates[1],
    user: mockUsers[0],
    answers: [
      {
        questionId: '5',
        value: 5
      },
      {
        questionId: '6',
        value: 'User interface is great'
      },
      {
        questionId: '7',
        value: 'Could improve loading speed'
      },
      {
        questionId: '8',
        value: true
      }
    ],
    createdAt: new Date(),
    emailCopySent: true
  },
  {
    id: '3',
    template: mockTemplates[2],
    user: mockUsers[1],
    answers: [
      {
        questionId: '9',
        value: 3
      },
      {
        questionId: '10',
        value: 'TypeScript'
      }
    ],
    createdAt: new Date(),
    emailCopySent: false
  }
];

// Mock API functions
export const mockApi = {
  templates: {
    getAll: () => Promise.resolve(mockTemplates),
    getById: (id: string) => Promise.resolve(mockTemplates.find(t => t.id === id)),
    getPopular: () => Promise.resolve(mockTemplates.slice(0, 5)),
    search: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return Promise.resolve(
        mockTemplates.filter(t => 
          t.title.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery) ||
          t.questions.some(q => 
            q.title.toLowerCase().includes(lowerQuery) ||
            q.description.toLowerCase().includes(lowerQuery)
          ) ||
          t.comments.some(c => 
            c.content.toLowerCase().includes(lowerQuery)
          )
        )
      );
    },
    searchByTag: (tag: string) => {
      return Promise.resolve(
        mockTemplates.filter(t => 
          t.tags.some(tTag => tTag.toLowerCase() === tag.toLowerCase())
        )
      );
    },
    create: (template: Partial<Template>) => {
      const newTemplate: Template = {
        id: String(mockTemplates.length + 1),
        ...template,
        createdAt: new Date(),
        updatedAt: new Date(),
        responses: [],
        comments: [],
        likedBy: [],
      } as Template;
      mockTemplates.push(newTemplate);
      return Promise.resolve(newTemplate);
    },
    update: (id: string, template: Partial<Template>) => {
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTemplates[index] = {
          ...mockTemplates[index],
          ...template,
          updatedAt: new Date(),
        };
        return Promise.resolve(mockTemplates[index]);
      }
      return Promise.reject(new Error('Template not found'));
    },
    delete: (id: string) => {
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTemplates.splice(index, 1);
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('Template not found'));
    },
    toggleLike: (templateId: string, userId: string) => {
      const template = mockTemplates.find(t => t.id === templateId);
      if (template) {
        const likedIndex = template.likedBy.findIndex(u => u.id === userId);
        if (likedIndex === -1) {
          template.likedBy.push(mockUsers.find(u => u.id === userId)!);
        } else {
          template.likedBy.splice(likedIndex, 1);
        }
        return Promise.resolve(template);
      }
      return Promise.reject(new Error('Template not found'));
    }
  },
  responses: {
    getByTemplateId: (templateId: string) => Promise.resolve(
      mockResponses.filter(r => r.template.id === templateId)
    ),
    create: (response: Partial<FormResponse>) => {
      const newResponse: FormResponse = {
        id: String(mockResponses.length + 1),
        ...response,
        createdAt: new Date(),
      } as FormResponse;
      mockResponses.push(newResponse);
      return Promise.resolve(newResponse);
    },
    update: (id: string, response: Partial<FormResponse>) => {
      const index = mockResponses.findIndex(r => r.id === id);
      if (index !== -1) {
        mockResponses[index] = {
          ...mockResponses[index],
          ...response,
        };
        return Promise.resolve(mockResponses[index]);
      }
      return Promise.reject(new Error('Response not found'));
    },
    delete: (id: string) => {
      const index = mockResponses.findIndex(r => r.id === id);
      if (index !== -1) {
        mockResponses.splice(index, 1);
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('Response not found'));
    }
  },
  users: {
    getAll: () => Promise.resolve(mockUsers),
    toggleBlock: (userId: string) => {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        user.isBlocked = !user.isBlocked;
        return Promise.resolve(user);
      }
      return Promise.reject(new Error('User not found'));
    },
    toggleAdmin: (userId: string) => {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        user.isAdmin = !user.isAdmin;
        return Promise.resolve(user);
      }
      return Promise.reject(new Error('User not found'));
    },
    delete: (userId: string) => {
      const index = mockUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('User not found'));
    },
  },
  topics: {
    getAll: () => Promise.resolve(mockTopics),
  },
  tags: {
    getAll: () => Promise.resolve(mockTags),
    search: (query: string) => Promise.resolve(
      mockTags.filter(t => t.name.toLowerCase().startsWith(query.toLowerCase()))
    ),
  },
  auth: {
    login: (email: string, password: string) => {
      // Check specifically for Jijan's credentials
      if (email === 'jijan@gmail.com' && password === 'Jijan076') {
        const { password: _, ...userWithoutPassword } = mockUsers[0];
        return Promise.resolve({ user: userWithoutPassword, token: 'mock-token' });
      }
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return Promise.resolve({ user: userWithoutPassword, token: 'mock-token' });
      }
      return Promise.reject(new Error('Invalid credentials'));
    },
    register: (name: string, email: string, password: string) => {
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        email,
        isAdmin: false,
        isBlocked: false,
        createdAt: new Date(),
      };
      mockUsers.push(newUser);
      return Promise.resolve({ user: newUser, token: 'mock-token' });
    },
    getCurrentUser: () => {
      return Promise.resolve(mockUsers[0]); // Returns Jijan as the current user
    },
  },
}; 
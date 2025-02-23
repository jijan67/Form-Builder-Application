export const mockTemplates = [
  {
    id: '1',
    title: 'Job Application Form',
    description: 'Application form for software developer position',
    topic: { id: '1', name: 'Employment' },
    imageUrl: 'https://example.com/image.jpg',
    tags: ['job', 'tech', 'developer'],
    isPublic: true,
    author: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
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
    ],
    responses: [],
    comments: [],
    likedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more mock templates...
];

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  isAdmin: true,
}; 
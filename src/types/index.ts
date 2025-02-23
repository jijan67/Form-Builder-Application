export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    isAdmin: boolean;
    isBlocked: boolean;
    createdAt: Date;
}

export type QuestionType = 'text' | 'multi-line' | 'integer' | 'checkbox' | 'select';

export interface Question {
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    order: number;
    showInResults: boolean;
    options?: string[];
    templateId?: string;
}

export interface Template {
    id: string;
    title: string;
    description: string;
    topic?: string;
    imageUrl?: string;
    tags: string[];
    author: User;
    questions: Question[];
    isPublic: boolean;
    allowedUsers: User[];
    responses: FormResponse[];
    comments: Comment[];
    likedBy: User[];
    createdAt: Date;
    updatedAt: Date;
}

export interface FormResponse {
    id: string;
    template: Template;
    user: User;
    answers: Answer[];
    createdAt: Date;
    emailCopySent: boolean;
}

export interface Answer {
    questionId: string;
    value: any;
}

export interface Comment {
    id: string;
    content: string;
    user: User;
    createdAt: Date;
}

export type Topic = {
    id: string;
    name: string;
    createdAt: Date;
}

export interface TemplateStats {
    totalResponses: number;
    questionStats: {
        [questionId: string]: {
            average?: number;
            mostCommon?: string | number;
            count?: number;
            distribution?: { [value: string]: number };
        };
    };
}

export interface Tag {
    id: string;
    name: string;
    count: number;
} 
// types.ts

export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    // Add other fields as necessary
}

export type QuestionKey = string;

export interface QuestionOption {
    label: string;
    description: string;
    value: string;
    next: QuestionKey;
}

export interface QuestionNode {
    question: string;
    options: QuestionOption[];
    previous?: QuestionKey;
}

export interface QuestionTree {
    [key: QuestionKey]: QuestionNode;
}

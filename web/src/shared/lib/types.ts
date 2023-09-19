export type Nullable<T> = T | null;

export interface Term {
    id: string;
    name: string;
    actual: boolean;
}

export interface Quarter {
    id: string;
}

export interface Subject {
    id: string;
    name: string;
    score: number;
    mark: number;
    journalId: string;
    evaluationId: {
        forSection: string | undefined;
        forQuarter: string | undefined;
    };
}

export interface Assessment {
    id: string;
    name: string;
    score: number;
    maxScore: number;
}

export interface Credentials {
    login: string;
    password: string;
}

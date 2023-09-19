export interface Subject {
    Id: string;
    JournalId: string;
    Mark: number;
    MarkComment: string;
    Name: string;
    Score: number;
    Evaluations: {
        Id: string;
        EvalType: number;
        Formula: number;
        IsCanDontConsider: boolean;
        MaxScores: Record<string, number>;
        Name: string;
        Percent: number;
        ShortName: string;
        Type: number;
    }[];
}

export interface Quarter {
    Id: string;
    Data: null;
    Name: string;
}

export interface SchoolYear {
    Id: string;
    Data: {
        IsActual: boolean;
    };
    Name: string;
}

export interface Assessment {
    Id: string;
    Comment: null;
    Description: string;
    Disabled: boolean;
    MaxScore: number;
    Name: string;
    RubricId: string;
    Score: number;
}

export interface Parallel {
    Id: string;
    Data: null;
    Name: string;
}

export interface Class {
    Id: string;
    LanguageName: string;
    LetterName: string;
    Name: string;
    OrganizationName: string;
    ParallelName: string;
    SchoolYearName: string;
}

export interface Student {
    Id: string;
    Data: null;
    Name: string;
}

export type GetSubjectsResponse = Subject[];
export type GetQuartersResponse = Quarter[];
export type GetYearsResponse = SchoolYear[];
export type GetAssessmentResponse = Assessment[];
export type GetParallelsResponse = Parallel[];
export type GetClassesResponse = Class[];
export type GetStudentsResponse = Student[];

export type GetDiaryResponse = {
    Url: string;
};

export interface ServerResponse<T> {
    data: T;
    state: number;
    success: boolean;
    message: string;
    closable: null;
    code: null;
    details: null;
    duration: null;
    refreshPage: null;
    title: null;
    total: null;
}

export type Maybe<T> = T | null | undefined;

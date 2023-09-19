import {request} from "@shared/lib/request";
import {Assessment, Quarter, Subject, Term} from "@shared/lib/types";

export const refresh = () => request.post<void>("/api/auth/refresh");

interface CheckIfAuthenticatedResponse {
    isAuthenticated: boolean;
}

export const checkIfAuthenticated = () =>
    request.get<CheckIfAuthenticatedResponse>("/api/auth/check");

interface LoginBody {
    login: string;
    password: string;
    city: string;
}

interface LoginResponse {
    login: string;
    password: string;
}

export const login = (body: LoginBody) =>
    request.post<LoginResponse>(
        "/api/login",
        {
            login: body.login,
            password: body.password,
        },
        {
            params: {
                city: body.city,
            },
        },
    );

interface GetTermsResponse {
    terms: Term[];
}

export const getTerms = () => request.get<GetTermsResponse>("/api/terms");

interface GetSubjectsBody {
    quarterId: Quarter["id"];
}

interface GetSubjectsResponse {
    subjects: Subject[];
}

export const getSubjects = (body: GetSubjectsBody) =>
    request.get<GetSubjectsResponse>("/api/subjects", {
        params: {
            quarterId: body.quarterId,
        },
    });

interface GetQuartersBody {
    termId: Term["id"];
}

interface GetQuartersResponse {
    quarters: Quarter[];
}

export const getQuarters = (body: GetQuartersBody) =>
    request.get<GetQuartersResponse>("/api/quarters", {
        params: {
            termId: body.termId,
        },
    });

interface GetAssessmentsBody {
    journalId: string;
    sectionEvaluationId: string;
    quarterEvaluationId: string;
}

interface GetAssessmentsResponse {
    assessments: {
        section: Assessment[];
        quarter: Assessment[];
    };
}

export const getAssessments = (body: GetAssessmentsBody) =>
    request.get<GetAssessmentsResponse>("/api/assessments", {
        params: {
            journalId: body.journalId,
            sectionEvaluationId: body.sectionEvaluationId,
            quarterEvaluationId: body.quarterEvaluationId,
        },
    });


export class StashCLIResponse<T> {
    status: 0 | -1 = 0;
    message?: string;
    result?: T;
    error?: StashCLIError;
}

export declare class StashCLIError {
    statusCode?: number;
    status?: string;
    statusText?: string;
    errors?: StashCLIErrorData[];
}

export interface StashCLIErrorData {
    context?: string;
    message: string;
    exceptionName: string;
}
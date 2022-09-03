export interface FileFilters {
    onlyFolders?: boolean;
    onlyFiles?: boolean;
    absolutePath?: boolean;
    extensions?: string[];
}

export interface Instance {
    alias: string;
    host: string;
    token: string;
}
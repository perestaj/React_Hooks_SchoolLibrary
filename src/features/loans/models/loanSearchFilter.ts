export interface LoanSearchFilter {
    title?: string;
    user?: string;
    bookStatuses?: BookStatusSearch[];
}

export interface BookStatusSearch {
    id: number;
    name?: string;
    isSelected: boolean;
}
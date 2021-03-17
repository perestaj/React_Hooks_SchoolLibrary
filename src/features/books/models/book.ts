export interface Book {
    bookID?: number;
    title?: string;
    additionalInformation?: string;
    publisherID?: number;
    status?: number;
    authorIds?: number[];
    isDeleted?: boolean;
    authorsList?: string;
    publisherName?: string;
    statusName?: string;
}
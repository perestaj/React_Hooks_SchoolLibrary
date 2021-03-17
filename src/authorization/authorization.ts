import { Role } from "../common/role";
import { AuthorizationData } from "./authorizationData";
import { CurrentUser } from "./currentUser";

const AUTHORIZATION_DATA_LOCAL_STORAGE_KEY = 'AUTHORIZATION_DATA';

export const authenticate = (authorizationData: AuthorizationData): void => {
    localStorage.setItem(AUTHORIZATION_DATA_LOCAL_STORAGE_KEY, JSON.stringify(authorizationData));
}    

export const logOut = (): void => {
    localStorage.removeItem(AUTHORIZATION_DATA_LOCAL_STORAGE_KEY);
}

export const getAuthorizationData = (): AuthorizationData | null => {
    var data  = localStorage.getItem(AUTHORIZATION_DATA_LOCAL_STORAGE_KEY);
    if (data && data.length > 0) {
        return JSON.parse(data);
    }

    return null;
}

export const canAddBook = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const canEditBook = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const canDeleteBook = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const canRequestBook = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn;
}

export const canEditLoans = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const displayAdministrationLink = (currentUser?: CurrentUser): boolean => {
    return canEditAuthors(currentUser) || canEditPublishers(currentUser) || canEditUsers(currentUser);
}

export const canEditAuthors = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const canEditPublishers = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && (currentUser.role === Role.Librarian || currentUser.role === Role.Administrator);
}

export const canEditUsers = (currentUser?: CurrentUser): boolean => {
    if (!currentUser) {
        return false;
    }

    return currentUser.isLoggedIn && currentUser.role === Role.Administrator;
}

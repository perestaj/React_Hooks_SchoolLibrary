import { Role } from "../common/role";

export interface CurrentUser {
    username: string;
    role: Role;
    isLoggedIn: boolean;
}
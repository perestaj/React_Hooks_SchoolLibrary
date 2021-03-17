import { Role } from "../common/role";

export interface AuthorizationData {
    token: string;
    expiration: Date;
    userName: string; 
    role: Role;
}
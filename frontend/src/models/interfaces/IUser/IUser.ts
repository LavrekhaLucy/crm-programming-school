import type {UserRoleEnum} from "../../../enums/user-role.enum.ts";


export interface IUser {
    id: number;
    email: string;
    role: UserRoleEnum;
    username: string;
    name: string;
    surname: string;
    avatarUrl: string | null;
    isActive: boolean;
    locale: string;
}
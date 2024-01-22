import { Observable } from 'rxjs';

export interface User {
    id: number;
    userName: string;
    roles: Array<string>;
}

export interface UserInfo {
    firstName: string;
    lastName: string;
    picture: string;
}

export interface UsersData {
    getUserInfo(): Observable<UserInfo>;
}


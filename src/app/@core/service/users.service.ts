import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserInfo, UsersData } from '../data/users.data';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService implements UsersData {

    constructor(private _http: HttpClient) {
    }

    getUserInfo(): Observable<UserInfo> {
        const url = environment.baseEndpoint + 'userInfo';
        return this._http.get<any>(url);
    }
}
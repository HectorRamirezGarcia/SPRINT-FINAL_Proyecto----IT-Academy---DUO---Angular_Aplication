import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User, Game, Idiom, Status } from '../_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(user: User) {
        return this.http.post<User>(`${environment.apiUrl}/api/users/authenticate`, user)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.userSubject.next(user);
                return user;
            }),
                catchError(err => {
                    if (err == "OK") {
                        localStorage.setItem('user', JSON.stringify(user.email));
                        console.log(localStorage.getItem('user'));
                    }
                    throw err;
                })
            );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/api/users/register`, user);
    }

    getAllGames(): Observable<any> {
        return this.http.get<Game[]>(`${environment.apiUrl}/api/games`);
    }

    getAllIdioms(): Observable<any> {
        return this.http.get<Idiom[]>(`${environment.apiUrl}/api/idioms`);
    }

    getAllStatus(): Observable<any> {
        return this.http.get<Status[]>(`${environment.apiUrl}/api/status`);
    }

    uploadimg(formdata: FormData): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/users/profile/upload`, formdata);
    }

    createGamesLiked(user: User) {
        return this.http.post(`${environment.apiUrl}/api/users/gameslikeds`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/api/users/${id}`);
    }

    getByEmail(email: string) {
        return this.http.get<User>(`${environment.apiUrl}/api/users/${email}`);
    }

    async update(id: string, params: User) {
        const dataToSend = await params;
        return await this.http.put(`${environment.apiUrl}/api/users/${id}`, dataToSend)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}
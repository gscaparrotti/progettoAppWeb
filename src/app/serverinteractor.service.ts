import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './model/user';
import { map } from 'rxjs/operators';

@Injectable()
export class ServerinteractorService {

  baseUrl = 'http://localhost:8080/api/';
  headers = new HttpHeaders().set('Authorization', 'Basic ' + sessionStorage.getItem('authToken'));

  constructor(private http: HttpClient) { }

  public signup(user: User) {
    return this.http.post<boolean>(this.baseUrl + 'newUser', user);
  }

  public login(codicefiscale: string, password: string) {
    return this.http.post<boolean>(this.baseUrl + 'login', {codicefiscale: codicefiscale, password: password})
      .pipe(map(result => {
        sessionStorage.setItem('codicefiscale', codicefiscale);
        sessionStorage.setItem('authToken', btoa(codicefiscale + ':' + password));
        return result;
      }));
  }

  public getUserInfo(codicefiscale: string) {
    return this.http.get<User>(this.baseUrl + 'getUserInfo', {headers: this.headers, params: {codicefiscale: codicefiscale}});
  }

  public test(codicefiscale: string) {
    return this.http.get<string>(this.baseUrl + 'test', {headers: this.headers, params: {codicefiscale: codicefiscale}});
  }

}

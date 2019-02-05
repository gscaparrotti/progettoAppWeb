import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './sign-up/sign-up.component';
import { map } from 'rxjs/operators';

@Injectable()
export class ServerinteractorService {

  baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  public signup(user: User) {
    return this.http.post<boolean>(this.baseUrl + 'newUser', user);
  }

  public login(codicefiscale: string, password: string) {
    return this.http.post<boolean>(this.baseUrl + 'login', {codicefiscale: codicefiscale, password: password})
      .pipe(map(result => {
        sessionStorage.setItem('authToken', btoa(codicefiscale + ':' + password));
        return result;
      }));
  }

  public test(codicefiscale: string) {
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + sessionStorage.getItem('authToken'));
    return this.http.get<string>(this.baseUrl + 'test', {headers: headers, params: {codicefiscale: codicefiscale}});
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './model/model';
import { map } from 'rxjs/operators';
import {Params} from './form1/form1.component';

@Injectable()
export class ServerinteractorService {

  baseUrl = 'http://localhost:8080/api/';
  headers = new HttpHeaders().set('Authorization', 'Basic ' + sessionStorage.getItem('authToken'));

  constructor(private http: HttpClient) { }

  public signup(user: User) {
    return this.http.post<boolean>(this.baseUrl + 'users', user);
  }

  public login(codicefiscale: string, password: string) {
    return this.http.post<boolean>(this.baseUrl + 'login', {codicefiscale: codicefiscale, password: password})
      .pipe(map(result => {
        sessionStorage.setItem('codicefiscale', codicefiscale);
        sessionStorage.setItem('authToken', btoa(codicefiscale + ':' + password));
        this.headers = new HttpHeaders().set('Authorization', 'Basic ' + sessionStorage.getItem('authToken'));
        return result;
      }));
  }

  public getUserInfo(codicefiscale: string) {
    return this.http.get<User>(this.baseUrl + 'users/' + codicefiscale, {headers: this.headers});
  }

  public uploadDrunkDrivingAssistanceRequest(codicefiscale: string, params: Params) {
    return this.http.post<boolean>(this.baseUrl + 'drunkDriving/' + codicefiscale, params, {headers: this.headers});
  }

  public sendFile(codicefiscale: string, requestNumber: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<boolean>(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber,
      formData, {headers: this.headers});
  }

  public uploadedFilesList(codicefiscale: string, requestNumber: number) {
    return this.http.get<string[]>(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber, {headers: this.headers});
  }

  public test(codicefiscale: string) {
    return this.http.get<string>(this.baseUrl + 'test', {headers: this.headers, params: {codicefiscale: codicefiscale}});
  }

}

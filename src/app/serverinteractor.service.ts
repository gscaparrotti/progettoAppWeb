import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DrunkDriving, LegalAssistance, Picture, User} from './model/model';
import { map } from 'rxjs/operators';
import {Params} from './form1/form1.component';
import {JSONUtils} from './utilities/json-utils';
import JSONToClass = JSONUtils.JSONToClass;
import JSONDate = JSONUtils.JSONDate;

@Injectable()
export class ServerinteractorService {

  baseUrl = 'http://localhost:8080/api/';
  headers = new HttpHeaders().set('Authorization', 'Basic ' + sessionStorage.getItem('authToken'));

  constructor(private http: HttpClient) { }

  public signup(user: User) {
    return this.http.post<User>(this.baseUrl + 'users', user);
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

  public getUserRequests(codicefiscale: string) {
    return this.http.get<LegalAssistance[]>(this.baseUrl + 'legalAssistance/' + codicefiscale, {headers: this.headers})
      .pipe(map(result => {
        for (let i = 0; i < result.length; i++) {
          JSONDate(result[i], ['requestDate', 'paymentDate']);
          const protoMap = new Map<string, object>();
          protoMap.set('.DrunkDriving', DrunkDriving.prototype);
          protoMap.set('.LegalAssistance', LegalAssistance.prototype);
          result[i] = JSONToClass(result[i], protoMap);
        }
        return result;
      }));
  }

  public uploadDrunkDrivingAssistanceRequest(codicefiscale: string, params: Params) {
    return this.http.post<DrunkDriving>(this.baseUrl + 'drunkDriving/' + codicefiscale, params, {headers: this.headers});
  }

  public sendFile(codicefiscale: string, requestNumber: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('returnFile', 'false');
    return this.http.post(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber,
      formData, {headers: this.headers});
  }

  public getFile(codicefiscale: string, requestNumber: number, fileName: string) {
    return this.http.get<Picture>(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber + '/' + fileName,
      {headers: this.headers})
  }

  public deleteFile(codicefiscale: string, requestNumber: number, fileName: string) {
    return this.http.delete(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber + '/' + fileName,
      {headers: this.headers})
  }

  public uploadedFilesList(codicefiscale: string, requestNumber: number) {
    return this.http.get<string[]>(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber, {headers: this.headers});
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DrunkDriving, LegalAssistance, Message, Picture, User} from './model/model';
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
    const data: any = params;
    data.className = '.DrunkDriving';
    return this.http.post<DrunkDriving>(this.baseUrl + 'drunkDriving/' + codicefiscale, data, {headers: this.headers});
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
    return this.http.get<Picture[]>(this.baseUrl + 'files/' + codicefiscale + '/' + requestNumber,
      {headers: this.headers, params: {"keepContent": "false"}})
      .pipe(map(result => {
        const names = new Array<string>();
        result.forEach(picture => {
          names.push(picture.id.filename);
        });
        return names;
      }));
  }

  public getMessages(codicefiscale: string, requestNumber: number) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/' + codicefiscale + '/' + requestNumber,
      {headers: this.headers})
      .pipe(map(result => {
        for (let i = 0; i < result.length; i++) {
          JSONDate(result[i], ['date']);
        }
        return result;
      }));
  }

  public sendMessage(codicefiscale: string, requestNumber: number, message: Message) {
    return this.http.post(this.baseUrl + 'messages/' + codicefiscale + '/' + requestNumber, message,
      {headers: this.headers});
  }

  public sendPaymentRequest(codicefiscale: string, requestNumber: number, token: string) {
    const formData: FormData = new FormData();
    formData.append('token', token);
    formData.append('user', codicefiscale);
    formData.append('request', requestNumber.toString());
    return this.http.post(this.baseUrl + 'payWithCC', formData, {headers: this.headers});
  }
}

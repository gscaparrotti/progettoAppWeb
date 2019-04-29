import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {LegalAssistance, User} from '../model/model';
import {Option, option, none} from 'ts-option';
import * as HttpStatus from 'http-status-codes';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit, OnChanges {

  //if this field is defined it means that this component is being used from another component
  @Input() userIn: Option<User> = none;
  user: Option<User> = none;
  request: Option<LegalAssistance> = none;
  userInfoError: Option<string> = none;
  communicatingUser = false;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    console.log('personal page init');
    this.getUserInfo();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    console.log('personal page changes');
    this.user = none;
    this.request = none;
    if (changes['userIn'] && !changes['userIn'].firstChange) {
      this.getUserInfo();
    }
  }

  getUserInfo() {
    this.communicatingUser = true;
    let cf = sessionStorage.getItem('codicefiscale');
    if (this.userIn.isDefined) {
      cf = this.userIn.get.codicefiscale;
    }
    this.serverInteractorService.getUserInfo(cf).subscribe(
      result => {
        this.userInfoError = none;
        this.user = option(result);
        this.getRequests();
      },
      () => {
        this.communicatingUser = false;
        this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
      }
    );
  }

  getRequests() {
    if (this.user.isDefined) {
      this.serverInteractorService.getUserRequests(this.user.get.codicefiscale).subscribe(
        result => {
          // at the moment we only show the last request
          result.sort((a, b) => {
            return a.requestDate < b.requestDate ? 1 : -1;
          });
          if (result.length > 0) {
            this.request = option(result[0]);
          }
          this.communicatingUser = false;
        },
        error => {
          this.communicatingUser = false;
          if (error.status != HttpStatus.NOT_FOUND) {
            this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
          }
        }
      );
    }
  }
}

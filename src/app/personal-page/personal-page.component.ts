import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {LegalAssistance, User} from '../model/model';
import {Option, option, none} from 'ts-option';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit, OnChanges {

  //if this field is defined it means that this component is being used from another component
  @Input() codicefiscalein: Option<string> = none;
  user: Option<User> = none;
  request: Option<LegalAssistance> = none;
  userInfoError: Option<string> = none;
  communicatingUser = false;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.communicatingUser = true;
    const cf = this.codicefiscalein.getOrElse(sessionStorage.getItem('codicefiscale'));
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
        () => {
          this.communicatingUser = false;
          this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
        }
      );
    }
  }
}

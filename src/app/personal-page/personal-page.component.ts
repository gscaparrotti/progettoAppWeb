import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {LegalAssistance, User} from '../model/model';
import {Option, option, none} from 'ts-option';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {

  user: User;
  lastRequestIndex = 0;
  error: Option<string> = none;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.serverInteractorService.getUserInfo(sessionStorage.getItem('codicefiscale')).subscribe(
      result => {
        if (result != null) {
          this.error = none;
          this.user = result;
          // at the moment we only show the last request
          this.user.requiredLegalAssistance.forEach((request, index) => {
            if (request.requestDate > this.user.requiredLegalAssistance[this.lastRequestIndex].requestDate) {
              this.lastRequestIndex = index;
            }
          });
        } else {
          this.error = option('Impossibile recuperare le informazioni sull\'utente.');
        }
      },
      e => this.error = option('Impossibile recuperare le informazioni sull\'utente.'));
  }

}

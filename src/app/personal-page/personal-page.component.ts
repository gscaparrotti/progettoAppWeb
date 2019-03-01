import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/user';
import {Option, option, none} from 'ts-option';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {

  user: User;
  error: Option<string> = none;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.serverInteractorService.getUserInfo(sessionStorage.getItem('codicefiscale')).subscribe(
      result => {
        if (result != null) {
          this.error = none;
          this.user = result;
        } else {
          this.error = option('Impossibile recuperare le informazioni sull\'utente.');
        }
      },
      e => this.error = option('Impossibile recuperare le informazioni sull\'utente.'));
  }

}

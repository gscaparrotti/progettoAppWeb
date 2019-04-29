import { Component, OnInit } from '@angular/core';
import {LegalAssistance, User} from '../model/model';
import {none, option, Option} from 'ts-option';
import {ServerinteractorService} from '../serverinteractor.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  allUsers: Option<User[]> = none;
  errorMessage: Option<string> = none;
  currentUser: Option<User> = none;
  communicating = false;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.getAllRequests();
  }

  getAllRequests() {
    this.communicating = true;
    this.serverInteractorService.getAllUsers().subscribe(
      users => {
        this.allUsers = option(users.filter(user => !user.isAdmin));
        this.communicating = false;
      }, () => {
        this.allUsers = none;
        this.errorMessage = option('Impossibile ottenere i dati');
        this.communicating = false;
      }
    );
  }

  selected(event: any) {
    console.log('selected');
    const currentUserID = event.target.value;
    if (this.allUsers.isDefined) {
      const currentUser = this.allUsers.get.filter(user => user.codicefiscale == currentUserID);
      if (currentUser.length == 1) {
        this.currentUser = option(currentUser[0]);
      }
    }
  }

}

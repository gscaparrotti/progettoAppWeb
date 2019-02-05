import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  codicefiscale = new FormControl('');
  password = new FormControl('');
  response = '';

  constructor(private serverinteractorService: ServerinteractorService) { }

  login() {
    this.serverinteractorService.login(this.codicefiscale.value, this.password.value).subscribe(success => {
      if (success) {
        this.serverinteractorService.test(this.codicefiscale.value).subscribe(result => this.response = result.toString());
      } else {
        this.response = 'Password errata';
      }
    });
  }

  ngOnInit() {
  }

}

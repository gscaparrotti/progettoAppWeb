import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('');
  password = new FormControl('');
  response = '';

  constructor(private signupService: ServerinteractorService) { }

  login() {
    this.signupService.login(this.email.value, this.password.value).subscribe(success => {
      if (success) {
        this.signupService.test().subscribe(result => this.response = result.toString());
      }
    });
  }

  ngOnInit() {
  }

}

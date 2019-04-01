import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  codicefiscale = new FormControl('');
  password = new FormControl('');
  response = '';

  constructor(private serverinteractorService: ServerinteractorService, private router: Router) { }

  login() {
    this.serverinteractorService.login(this.codicefiscale.value, this.password.value).subscribe(success => {
        if (success) {
          this.router.navigate(['/personal-page']);
        } else {
          this.response = 'Password errata';
        }
      },
      error => {
        this.response = 'Errore di comunicazione. Riprovare.';
      });
  }

  ngOnInit() {
  }

}

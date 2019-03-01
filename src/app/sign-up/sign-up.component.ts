import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  codicefiscale = new FormControl('');
  nome = new FormControl('');
  cognome = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');
  response = '';

  constructor(private signupService: ServerinteractorService) { }

  signup() {
    this.signupService
      .signup(new User(this.codicefiscale.value, this.nome.value, this.cognome.value, this.email.value, this.password.value))
      .subscribe(result => this.response = result === true ? 'Registrazione completata' : 'Errore');
  }

  ngOnInit() {
  }

}

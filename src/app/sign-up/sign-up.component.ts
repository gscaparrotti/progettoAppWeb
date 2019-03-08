import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/user';
import {StockService} from '../stock.service';

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

  constructor(private serverinteractorService: ServerinteractorService, private stockService: StockService) { }

  signup() {
    this.serverinteractorService
      .signup(new User(this.codicefiscale.value, this.nome.value, this.cognome.value, this.email.value, this.password.value))
      .subscribe(signupResult => {
        this.response = signupResult === true ? 'Registrazione completata' : 'Errore';
        this.serverinteractorService
          .login(this.codicefiscale.value, this.password.value)
          .subscribe(loginResult => {
            if (loginResult) {
              this.serverinteractorService
                .uploadDrunkDrivingAssistanceRequest(this.codicefiscale.value, this.stockService.getParams())
                .subscribe(requestResult => {
                  this.response = this.response + ' - ' + (requestResult === true ? 'upload completato' : 'errore');
                });
              // this.serverinteractorService.test(this.codicefiscale.value).subscribe(r => this.response += r);
            }
          });
      });
  }

  ngOnInit() {
  }

}

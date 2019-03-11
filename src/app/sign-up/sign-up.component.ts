import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/model';
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
        if (signupResult === true) {
          this.updateStatusMessage(false, 'Registrazione completata');
        } else {
          this.updateStatusMessage(true);
        }
        this.serverinteractorService
          .login(this.codicefiscale.value, this.password.value)
          .subscribe(loginResult => {
            if (loginResult) {
              this.serverinteractorService
                .uploadDrunkDrivingAssistanceRequest(this.codicefiscale.value, this.stockService.getParams())
                .subscribe(requestResult => {
                  if (requestResult === true) {
                    this.updateStatusMessage(false, 'Upload completato', true);
                  } else {
                    this.updateStatusMessage(true);
                  }
                }, e => this.updateStatusMessage(true));
            }
          }, e => this.updateStatusMessage(true));
      }, e => this.updateStatusMessage(true));
  }

  updateStatusMessage(isError: boolean, message = '', append = false) {
    if (isError) {
      this.response = 'Errore nella procedura di registrazione e/o nell\'upload dei dati. Riprovare.';
    } else {
      append ? this.response += message : this.response = message;
    }
  }

  ngOnInit() {
  }

}

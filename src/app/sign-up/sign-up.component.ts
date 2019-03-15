import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/model';
import {StockService} from '../stock.service';
import {Router} from '@angular/router';

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
  communicating = false;

  constructor(private serverinteractorService: ServerinteractorService, private stockService: StockService,
              private router: Router) { }

  signup() {
    this.response = '';
    this.communicating = true;
    this.serverinteractorService
      .signup(new User(this.codicefiscale.value, this.nome.value, this.cognome.value, this.email.value, this.password.value))
      .subscribe(signupResult => {
        if (signupResult === true) {
          this.updateStatus(false, 'Registrazione completata');
        } else {
          this.updateStatus(true);
        }
        this.serverinteractorService
          .login(this.codicefiscale.value, this.password.value)
          .subscribe(loginResult => {
            if (loginResult) {
              this.serverinteractorService
                .uploadDrunkDrivingAssistanceRequest(this.codicefiscale.value, this.stockService.getParams())
                .subscribe(requestResult => {
                  if (requestResult === true) {
                    this.updateStatus(false, 'Upload completato', true);
                    this.router.navigate(['/personal-page']);
                  } else {
                    this.updateStatus(true);
                  }
                }, e => this.updateStatus(true));
            }
          }, e => this.updateStatus(true));
      }, e => this.updateStatus(true));
  }

  updateStatus(isError: boolean, message = '', append = false) {
    if (isError) {
      this.response = 'Errore nella procedura di registrazione e/o nell\'upload dei dati. Riprovare.';
      this.communicating = false;
    } else {
      append ? this.response += message : this.response = message;
    }
  }

  ngOnInit() {
  }

}

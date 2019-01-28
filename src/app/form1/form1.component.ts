import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {StockService} from '../stock.service';

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css']
})
export class Form1Component implements OnInit {

    tasso = new FormControl('');
    rifiutato = new FormControl(false);
    estraneo = new FormControl(false);
    recidiva = new FormControl(false);
    incidente = new FormControl(false);


  constructor(private stock: StockService) { }

  stockResult() {
    this.stock.setResult(this.calcolaPena());
  }

  calcolaPena() {
    if (!this.rifiutato.value  && (isNaN(Number(this.tasso.value)) || +this.tasso.value === 0)) {
      return new Result(false);
    }

    const rilevazione = !this.rifiutato.value ? +this.tasso.value : 4;
    const veicolo: boolean = this.estraneo.value;
    const moltiplicatoreVeicoloAppartiene: number = veicolo ? 2 : 1;
    const recidiva: boolean = this.recidiva.value;
    const incidente: boolean = this.incidente.value;
    const moltiplicatoreIncidente: number = incidente ? 2 : 1;
    const fermo: boolean = (incidente === true && veicolo === false);

    let revocaPatente = false;
    let confisca = false;
    let minSanzione = 0,
        maxSanzione = 0,
        minAmmenda = 0,
        maxAmmenda = 0,
        minSospensione = 0,
        maxSospensione = 0,
        minArresto = 0,
        maxArresto = 0;

    if (rilevazione >= 0.5 && rilevazione <= 0.8) {
        minSanzione = (527 * moltiplicatoreIncidente);
        maxSanzione = (2108 * moltiplicatoreIncidente);
        minSospensione = (3 * moltiplicatoreIncidente);
        maxSospensione = (6 * moltiplicatoreIncidente);
    } else if (rilevazione > 0.8 && rilevazione <= 1.5) {
        minAmmenda = 800;
        maxAmmenda = 3200;
        minSospensione = (6 * moltiplicatoreIncidente);
        maxSospensione = (12 * moltiplicatoreIncidente);
        minArresto = 0;
        maxArresto = 6;
    } else {
        if (this.rifiutato.value === true) {
            minAmmenda = 1500;
            maxAmmenda = 6000;
            minSospensione = 6;
            maxSospensione = 24;
            revocaPatente = recidiva;
        } else {
            minAmmenda = 1500;
            maxAmmenda = 6000;
            minSospensione = (12 * moltiplicatoreVeicoloAppartiene * moltiplicatoreIncidente);
            maxSospensione = (24 * moltiplicatoreVeicoloAppartiene * moltiplicatoreIncidente);
            revocaPatente = (incidente || recidiva);
        }
        confisca = veicolo === false;
        minArresto = 6;
        maxArresto = 12;
    }
    if (revocaPatente) {
        minSospensione = 0;
    }
    return new Result(true,
            minSanzione,
            maxSanzione,
            minAmmenda,
            maxAmmenda,
            minSospensione,
            maxSospensione,
            minArresto,
            maxArresto,
            fermo,
            revocaPatente,
            confisca,
            minAmmenda > 0 && moltiplicatoreIncidente === 1);
  }

  ngOnInit() {
  }

}

export class Result {

  public valid: boolean;
  public minSanzione: number;
  public maxSanzione: number;
  public minAmmenda: number;
  public maxAmmenda: number;
  public minSospensione: number;
  public maxSospensione: number;
  public minArresto: number;
  public maxArresto: number;
  public fermo: boolean;
  public revoca: boolean;
  public confisca: boolean;
  public assistenza: boolean;

  constructor(valid: boolean, minSanzione?: number, maxSanzione?: number, minAmmenda?: number, maxAmmenda?: number,
              minSospensione?: number, maxSospensione?: number, minArresto?: number, maxArresto?: number, fermo?: boolean,
              revoca?: boolean, confisca?: boolean, assistenza?: boolean) {
    this.valid = valid;
    this.minSanzione = minSanzione;
    this.maxSanzione = maxSanzione;
    this.minAmmenda = minAmmenda;
    this.maxAmmenda = maxAmmenda;
    this.minSospensione = minSospensione;
    this.maxSospensione = maxSospensione;
    this.minArresto = minArresto;
    this.maxArresto = maxArresto;
    this.fermo = fermo;
    this.revoca = revoca;
    this.confisca = confisca;
    this.assistenza = assistenza;
  }
}


import {Component, Input, OnInit} from '@angular/core';
import {none, Option} from 'ts-option';
import {LegalAssistance} from '../model/model';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  @Input() request: Option<LegalAssistance> = none;

  constructor() { }

  ngOnInit() {
  }

}

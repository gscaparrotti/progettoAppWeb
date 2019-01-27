import { Injectable } from '@angular/core';
import {Result} from './form1/form1.component';

@Injectable()
export class StockService {

  result;

  constructor() { }

  setResult(result: Result) {
    this.result = result;
  }

  getResult(): Result {
    return this.result;
  }

}

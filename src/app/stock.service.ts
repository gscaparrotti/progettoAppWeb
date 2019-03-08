import { Injectable } from '@angular/core';
import {Params, Result} from './form1/form1.component';

@Injectable()
export class StockService {

  private params;
  private result;

  constructor() { }

  setParams(params: Params) {
    this.params = params;
  }

  getParams() {
    return this.params;
  }

  setResult(result: Result) {
    this.result = result;
  }

  getResult(): Result {
    return this.result;
  }

}

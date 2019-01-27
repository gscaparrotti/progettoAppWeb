import { Component, OnInit } from '@angular/core';
import {StockService} from '../stock.service';
import {Result} from '../form1/form1.component';

@Component({
  selector: 'app-pena',
  templateUrl: './pena.component.html',
  styleUrls: ['./pena.component.css']
})
export class PenaComponent implements OnInit {

  result;

  constructor(private stock: StockService) { }

  ngOnInit() {
    const temp = this.stock.getResult();
    if (temp == null) {
      this.result = new Result(false);
    } else {
      this.result = temp;
    }
  }

}

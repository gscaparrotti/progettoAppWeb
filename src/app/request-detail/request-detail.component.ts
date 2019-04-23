import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {none, option, Option} from 'ts-option';
import {DrunkDriving, LegalAssistance, User} from '../model/model';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit, OnChanges {

  @Input() request: Option<LegalAssistance> = none;
  drunkDriving: Option<DrunkDriving> = none;

  constructor() { }

  ngOnInit() {
    this.checkType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkType();
  }

  checkType() {
    this.drunkDriving = none;
    if (this.request.isDefined && this.request.get instanceof DrunkDriving) {
      this.drunkDriving = option(<DrunkDriving> this.request.get);
    }
  }

}

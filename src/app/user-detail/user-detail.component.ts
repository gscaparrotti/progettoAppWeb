import {Component, Input} from '@angular/core';
import {none, Option} from 'ts-option';
import {User} from '../model/model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {

  @Input() user: Option<User> = none;

  constructor() { }

}

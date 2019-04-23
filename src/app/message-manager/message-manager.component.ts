import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {none, option, Option} from 'ts-option';
import {LegalAssistance, Message, User} from '../model/model';
import {ServerinteractorService} from '../serverinteractor.service';

@Component({
  selector: 'app-message-manager',
  templateUrl: './message-manager.component.html',
  styleUrls: ['./message-manager.component.css']
})
export class MessageManagerComponent implements OnInit, OnChanges {

  @Input() user: Option<User> = none;
  @Input() request: Option<LegalAssistance> = none;
  @Input() fromUser: boolean = true;
  messages: Message[] = [];
  messageTimer = null;
  communicatingMessages = false;
  messageSendError: Option<string> = none;
  messagesError: Option<string> = none;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.updateMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMessages();
  }

  updateMessages() {
    if (this.request.isDefined && this.user.isDefined) {
      this.messagesError = none;
      this.communicatingMessages = true;
      this.serverInteractorService.getMessages(this.user.get.codicefiscale, this.request.get.id).subscribe(result => {
        result.sort((a, b) => {
          return a.date < b.date ? 1 : -1;
        });
        this.messages = result;
        this.messageTimer = setTimeout(this.updateMessages.bind(this), 5000);
        this.communicatingMessages = false;
      }, () => {
        this.messageTimer = null;
        this.messages = [];
        this.messagesError = option('Impossibile ottenere la lista dei messaggi.');
        this.communicatingMessages = false;
      });
    }
  }

  sendMessage(message: string) {
    if (this.request.isDefined && this.user.isDefined) {
      this.communicatingMessages = true;
      this.messageSendError = none;
      this.serverInteractorService.sendMessage(this.user.get.codicefiscale, this.request.get.id,
        new Message(null, message, this.fromUser, null)).subscribe(() => {
        this.communicatingMessages = false;
        this.updateMessages();
      }, () => {
        this.communicatingMessages = false;
        this.messageSendError = option('Impossibile inviare il messaggio.');
      });
    }
  }

}

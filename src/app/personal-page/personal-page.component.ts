import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {DrunkDriving, LegalAssistance, Message, User} from '../model/model';
import {Option, option, none} from 'ts-option';
import * as HttpStatus from 'http-status-codes';
import {b64Utils} from '../utilities/b64-utils';
import b64ToBlob = b64Utils.b64ToBlob;
import {IAlbum, Lightbox, LightboxConfig} from 'ngx-lightbox';
import {Router} from '@angular/router';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {

  user: Option<User> = none;
  request: Option<LegalAssistance> = none;
  drunkDriving: Option<DrunkDriving> = none;
  userInfoError: Option<string> = none;
  filesListError: Option<string> = none;
  messagesError: Option<string> = none;
  fileToUpload: Option<File> = none;
  communicatingUser = false;
  communicatingFiles = false;
  communicatingMessages = false;
  messageTimer = null;
  autoMessage = false;
  fileStatus = '';
  messageSendError: Option<string> = none;
  alreadyUploadedFiles: string[] = [];
  messages: Message[] = [];

  constructor(private serverInteractorService: ServerinteractorService, private lightbox: Lightbox,
              private lightboxConfig: LightboxConfig, private router: Router) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.communicatingUser = true;
    this.serverInteractorService.getUserInfo(sessionStorage.getItem('codicefiscale')).subscribe(
      result => {
        this.userInfoError = none;
        this.user = option(result);
        this.getRequests();
      },
      () => {
        this.communicatingUser = false;
        this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
      }
    );
  }

  getRequests() {
    if (this.user.isDefined) {
      this.serverInteractorService.getUserRequests(this.user.get.codicefiscale).subscribe(
        result => {
          // at the moment we only show the last request
          this.drunkDriving = none;
          result.sort((a, b) => {
            return a.requestDate < b.requestDate ? 1 : -1;
          });
          if (result.length > 0) {
            this.request = option(result[0]);
          }
          if (this.request.isDefined && this.request.get instanceof DrunkDriving) {
            this.drunkDriving = option(<DrunkDriving> this.request.get);
          }
          this.communicatingUser = false;
          this.updateFilesList();
          this.updateMessages();
        },
        () => {
          this.communicatingUser = false;
          this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
        }
      );
    }
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
        new Message(null, message, true, null)).subscribe(() => {
        this.communicatingMessages = false;
        this.updateMessages();
      }, () => {
        this.communicatingMessages = false;
        this.messageSendError = option('Impossibile inviare il messaggio.');
      });
    }
  }

  updateFilesList() {
    if (this.request.isDefined && this.user.isDefined) {
      this.filesListError = none;
      this.communicatingFiles = true;
      this.serverInteractorService.uploadedFilesList(this.user.get.codicefiscale, this.request.get.id).subscribe(fileResult => {
        fileResult.sort();
        this.alreadyUploadedFiles = fileResult;
        this.communicatingFiles = false;
      }, () => {
        this.alreadyUploadedFiles = [];
        this.filesListError = option('Impossibile ottenere la lista dei file.');
        this.communicatingFiles = false;
      });
    }
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.fileStatus = '';
      this.fileToUpload = option(files.item(0));
      this.fileStatus = 'File selezionato: ' + files.item(0).name;
    }
  }

  uploadFile() {
    if (this.user.isDefined && this.fileToUpload.isDefined && this.request.isDefined) {
      this.communicatingFiles = true;
      this.serverInteractorService.sendFile(this.user.get.codicefiscale, this.request.get.id, this.fileToUpload.get)
        .subscribe(() => {
          this.fileStatus = 'Il file ' + this.fileToUpload.get.name + ' è stato inviato con successo';
          this.fileToUpload = none;
          this.communicatingFiles = false;
          this.updateFilesList();
        }, error => {
          if (error.status === HttpStatus.CONFLICT) {
            this.fileStatus = 'Impossibile inviare il file (possibile file duplicato)';
          } else {
            this.fileStatus = 'Errore nell\'invio del file (possibile file non permesso)';
          }
          this.fileToUpload = none;
          this.communicatingFiles = false;
        });
    }
  }

  getFile(fileName: string) {
    if (this.user.isDefined && this.request.isDefined) {
      this.communicatingFiles = true;
      this.fileStatus = '';
      this.serverInteractorService.getFile(this.user.get.codicefiscale, this.request.get.id, fileName)
        .subscribe(file => {
          const fileReader = new FileReader();
          fileReader.onload = (event:any) => {
            const album: Array<IAlbum> = [];
            album.push({src: event.target.result, caption: file.id.filename, thumb: null});
            this.router.events.subscribe(() => this.lightbox.close());
            this.lightbox.open(album, 0, {centerVertically: true, disableScrolling: true});
          };
          fileReader.readAsDataURL(b64ToBlob(file.data, 'image/' + file.id.filename.split('.')[1]));
          this.communicatingFiles = false;
        }, () => {
          this.fileStatus = 'Errore nella ricezione del file';
          this.communicatingFiles = false;
        });
    }
  }

  deleteFile(fileName: string) {
    if (this.user.isDefined && this.request.isDefined) {
      this.communicatingFiles = true;
      this.fileStatus = '';
      this.serverInteractorService.deleteFile(this.user.get.codicefiscale, this.request.get.id, fileName)
        .subscribe(() => {
          this.fileStatus = 'Il file ' + fileName + ' è stato eliminato con successo';
          this.communicatingFiles = false;
          this.updateFilesList();
        }, () => {
          this.fileStatus = 'Errore nell\'eliminazione del file';
          this.communicatingFiles = false;
        });
    }
  }
}

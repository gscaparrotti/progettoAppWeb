import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {DrunkDriving, LegalAssistance, User} from '../model/model';
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
  fileToUpload: Option<File> = none;
  communicatingFiles = false;
  fileStatus = '';
  alreadyUploadedFiles: string[] = [];

  constructor(private serverInteractorService: ServerinteractorService, private lightbox: Lightbox,
              private lightboxConfig: LightboxConfig, private router: Router) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.serverInteractorService.getUserInfo(sessionStorage.getItem('codicefiscale')).subscribe(
      result => {
        this.userInfoError = none;
        this.user = option(result);
        this.getRequests();
      },
      () => this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
    );
  }

  getRequests() {
    if (this.user.isDefined) {
      this.serverInteractorService.getUserRequests(this.user.get.codicefiscale).subscribe(
        result => {
          // at the moment we only show the last request
          this.request = option(new LegalAssistance(0, this.user.get, new Date(0), undefined, ''));
          this.drunkDriving = none;
          result.forEach(request => {
            if (request.requestDate > this.request.get.requestDate) {
              this.request = option(request);
            }
          });
          if (this.request.isDefined && this.request.get instanceof DrunkDriving) {
            this.drunkDriving = option(<DrunkDriving> this.request.get);
          }
          this.updateFilesList();
        },
        () => this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.')
      );
    }
  }

  updateFilesList() {
    if (this.request.isDefined && this.user.isDefined) {
      this.filesListError = none;
      this.communicatingFiles = true;
      this.serverInteractorService.uploadedFilesList(this.user.get.codicefiscale, this.request.get.id).subscribe(fileResult => {
        this.alreadyUploadedFiles = fileResult;
        this.communicatingFiles = false;
      }, () => {
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
      this.serverInteractorService.sendFile(this.user.get.codicefiscale, this.request.get.id, this.fileToUpload.get)
        .subscribe(() => {
          this.fileStatus = 'Il file ' + this.fileToUpload.get.name + ' è stato inviato con successo';
          this.updateFilesList();
          this.fileToUpload = none;
        }, error => {
          if (error.status === HttpStatus.CONFLICT) {
            this.fileStatus = 'Impossibile inviare il file (possibile file duplicato)';
          } else {
            this.fileStatus = 'Errore nell\'invio del file';
          }
          this.fileToUpload = none;
        });
    }
  }

  getFile(fileName: string) {
    if (this.user.isDefined && this.request.isDefined) {
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
        }, () => {
          this.fileStatus = 'Errore nella ricezione del file';
        });
    }
  }

  deleteFile(fileName: string) {
    if (this.user.isDefined && this.request.isDefined) {
      this.fileStatus = '';
      this.serverInteractorService.deleteFile(this.user.get.codicefiscale, this.request.get.id, fileName)
        .subscribe(() => {
          this.fileStatus = 'Il file ' + fileName + ' è stato eliminato con successo';
          this.updateFilesList();
        }, () => {
          this.fileStatus = 'Errore nell\'eliminazione del file';
          this.updateFilesList();
        });
    }
  }
}

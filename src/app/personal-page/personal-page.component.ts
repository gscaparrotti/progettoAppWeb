import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {DrunkDriving, LegalAssistance, User} from '../model/model';
import {Option, option, none} from 'ts-option';
import * as HttpStatus from 'http-status-codes';

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
  fileUploadStatus = '';
  alreadyUploadedFiles: string[] = [];

  constructor(private serverInteractorService: ServerinteractorService) { }

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
      this.fileUploadStatus = '';
      this.fileToUpload = option(files.item(0));
      this.fileUploadStatus = 'File selezionato: ' + files.item(0).name;
    }
  }

  uploadFile() {
    if (this.fileToUpload.isDefined && this.request.isDefined) {
      this.serverInteractorService.sendFile(sessionStorage.getItem('codicefiscale'),
        this.request.get.id, this.fileToUpload.get)
        .subscribe(() => {
          this.fileUploadStatus = 'Il file ' + this.fileToUpload.get.name + ' è stato inviato con successo';
          this.updateFilesList();
          this.fileToUpload = none;
        }, error => {
          if (error.status === HttpStatus.CONFLICT) {
            this.fileUploadStatus = 'Impossibile inviare il file (possibile file duplicato)';
          } else {
            this.fileUploadStatus = 'Errore nell\'invio del file';
          }
          this.fileToUpload = none;
        });
    }
  }
}

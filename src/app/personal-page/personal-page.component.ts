import {Component, OnInit} from '@angular/core';
import {ServerinteractorService} from '../serverinteractor.service';
import {User} from '../model/model';
import {Option, option, none} from 'ts-option';
import * as HttpStatus from 'http-status-codes';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {

  user: User;
  lastRequestIndex = 0;
  userInfoError: Option<string> = none;
  filesListError: Option<string> = none;
  fileToUpload: File = null;
  communicatingFiles = false;
  fileUploadStatus = '';
  alreadyUploadedFiles: string[] = [];

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngOnInit() {
    this.serverInteractorService.getUserInfo(sessionStorage.getItem('codicefiscale')).subscribe(
      result => {
        if (result != null) {
          this.userInfoError = none;
          this.user = result;
          // at the moment we only show the last request
          this.user.requiredLegalAssistance.forEach((request, index) => {
            if (request.requestDate > this.user.requiredLegalAssistance[this.lastRequestIndex].requestDate) {
              this.lastRequestIndex = index;
            }
          });
          this.updateFilesList();
        } else {
          this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.');
        }
      },
      () => this.userInfoError = option('Impossibile recuperare le informazioni sull\'utente.'));
  }

  handleFileInput(files: FileList) {
    this.fileUploadStatus = '';
    this.fileToUpload = files.item(0);
    this.fileUploadStatus = 'File selezionato: ' + this.fileToUpload.name;
  }

  uploadFile() {
    if (this.fileToUpload != null) {
      this.serverInteractorService.sendFile(sessionStorage.getItem('codicefiscale'),
        this.user.requiredLegalAssistance[0].id, this.fileToUpload)
        .subscribe(() => {
          this.fileUploadStatus = 'Il file ' + this.fileToUpload.name + ' è stato inviato con successo';
          this.updateFilesList();
          this.fileToUpload = null;
        }, error => {
          if (error.status === HttpStatus.CONFLICT) {
            this.fileUploadStatus = 'Impossibile inviare il file (possibile file duplicato)';
          } else {
            this.fileUploadStatus = 'Errore nell\'invio del file';
          }
          this.fileToUpload = null;
        });
    }
  }

  updateFilesList() {
    this.communicatingFiles = true;
    this.serverInteractorService.uploadedFilesList(this.user.codicefiscale,
      this.user.requiredLegalAssistance[this.lastRequestIndex].id).subscribe(fileResult => {
      this.alreadyUploadedFiles = fileResult;
      this.communicatingFiles = false;
    }, () => {
      this.filesListError = option('Impossibile ottenere la lista dei file.');
      this.communicatingFiles = false;
    });
  }

}

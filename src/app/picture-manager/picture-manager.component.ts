import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {none, Option, option} from 'ts-option';
import * as HttpStatus from 'http-status-codes';
import {IAlbum, Lightbox, LightboxConfig} from 'ngx-lightbox';
import {LegalAssistance, User} from '../model/model';
import {ServerinteractorService} from '../serverinteractor.service';
import {Router} from '@angular/router';
import {b64Utils} from '../utilities/b64-utils';
import b64ToBlob = b64Utils.b64ToBlob;

@Component({
  selector: 'app-picture-manager',
  templateUrl: './picture-manager.component.html',
  styleUrls: ['./picture-manager.component.css']
})
export class PictureManagerComponent implements OnInit, OnChanges {


  @Input() user: Option<User> = none;
  @Input() request: Option<LegalAssistance> = none;
  alreadyUploadedFiles: string[] = [];
  fileToUpload: Option<File> = none;
  communicatingFiles = false;
  fileStatus = '';
  filesListError: Option<string> = none;

  constructor(private serverInteractorService: ServerinteractorService, private lightbox: Lightbox,
              private lightboxConfig: LightboxConfig, private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateFilesList();
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

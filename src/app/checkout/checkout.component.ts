import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef, Input
} from '@angular/core';

import { NgForm } from '@angular/forms';
import {ServerinteractorService} from '../serverinteractor.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements AfterViewInit, OnDestroy{

  @Input() codicefiscale: string;
  @Input() request: number;
  @Input() paid: boolean;
  @ViewChild('cardInfo') cardInfo: ElementRef;
  card: any;
  message: string = '';
  done: boolean = false;
  communicating: boolean = false;

  constructor(private serverInteractorService: ServerinteractorService) { }

  ngAfterViewInit() {
    if (this.cardInfo != undefined) {
      this.card = elements.create('card');
      this.card.mount(this.cardInfo.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.card != undefined) {
      this.card.destroy();
    }
  }

  async onSubmit(form: NgForm) {
    if (this.codicefiscale != undefined && this.request != undefined) {
      this.communicating = true;
      const { token, error } = await stripe.createToken(this.card);
      if (error) {
        this.message = 'Errore nel pagamento. Riprovare.';
        this.communicating = false;
      } else {
        this.serverInteractorService.sendPaymentRequest(this.codicefiscale, this.request, token.id).subscribe(
          () => {
            this.done = true;
            this.message = 'Pagamento riuscito!';
            this.communicating = false;
          }, () => {
            this.message = 'Errore nel pagamento. Riprovare.';
            this.communicating = false;
          });
      }
    }
  }

}

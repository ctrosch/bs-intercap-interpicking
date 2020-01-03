import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { PickingService } from '../../../services/picking.service';

import * as swal from 'sweetalert';


@Component({
  selector: 'app-picking-item',
  templateUrl: './picking-item.page.html',
  styleUrls: ['./picking-item.page.scss'],
})
export class PickingItemPage implements OnInit {

  item: any;
  codigoBarra: string;
  cantidadManual: number = 0;

  constructor(private route: ActivatedRoute,
          private router: Router,
          private pickingService: PickingService,
          private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) {
    
      console.log('ItemColecta - constructor ');

  }

  ngOnInit() {

    //console.log('ItemColecta - ngOnInit');    
    this.item = this.pickingService.item;

    if (this.item) {
      this.cantidadManual = this.item.CNTPCK;
    }

    //console.log(this.item);

  }  

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  add(key: number) {

    if (key === 0 && this.cantidadManual === 0) {
      return;
    }

    this.cantidadManual = this.cantidadManual * 10 + key;

    if (this.cantidadManual > this.item.cantidad) {
      this.cantidadManual = 0;
    }

  }

  clean() {
    this.cantidadManual = 0;
  }

  confirmar() {

    const resultado: boolean = this.pickingService.confirmarCantidad(this.item, Number(this.cantidadManual));

    if (resultado) {

      //if (this.item.ESTPCK === 'B') {
        this.pickingService.confirmarItem(this.item)
          .subscribe(resp => {
            if (resp.ok) {
              
                this.router.navigateByUrl('picking');
              
            } else {
              swal("Error", "Problemas para confirmar picking", "error");
            }
          });
      //}
    }
  }

  resetCantidad() {

    this.pickingService.resetCantidad(this.item);
    this.cantidadManual = this.item.CNTPCK;

    console.log(this.item);

  }

  sendInfo() {

  }


}

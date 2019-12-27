import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColectaService } from '../../services/colecta.service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-item-colecta',
  templateUrl: './item-colecta.page.html',
  styleUrls: ['./item-colecta.page.scss'],
})
export class ItemColectaPage implements OnInit {

  item: any;
  codigoBarra: string;
  cantidadManual: number = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private colectaService: ColectaService,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) {

    const id = this.route.snapshot.paramMap.get('id');
    this.item = this.colectaService.getItem(id);

    if (this.item.cantidadPicking) {
      this.cantidadManual = this.item.cantidadPicking;
    }

    console.log('cantidad picking ' + this.item.cantidadPicking);
    console.log('this.cantidadManual ' + this.cantidadManual);



    //console.log(id);
    //console.log(this.item);

  }

  ngOnInit() {

  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      this.codigoBarra = barcodeData.text;
      this.procesarCodigoBarra();


    }).catch(err => {
      console.log('Error', err);
      //this.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoBarra() {

    if (this.codigoBarra !== undefined) {

      this.colectaService.procesarCodigoBarra(this.codigoBarra);
      this.codigoBarra = '';


    } else {
      //this.presentToast('Código de barra vacío');
    }
  }

  add(key: number) {

    console.log(key);

    if (key === 0 && this.cantidadManual === 0) {
      console.log('sale');
      return;
    }

    console.log('Cantidad manual 1 ' + this.cantidadManual);

    this.cantidadManual = this.cantidadManual * 10 + key;

    console.log('Cantidad manual 2 ' + this.cantidadManual);

    if (this.cantidadManual > this.item.cantidad) {
      this.cantidadManual = 0;
    }


  }

  clean() {
    this.cantidadManual = 0;
  }

  confirmar() {

    this.colectaService.confirmarCantidadManual(this.item, Number(this.cantidadManual));
    this.router.navigateByUrl('colecta');
  }

  resetCantidad() {

    this.colectaService.resetCantidad(this.item);
    this.cantidadManual = this.item.cantidadPicking;

  }

  sendInfo() {

  }


}

import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Observable } from 'rxjs';
import { ColectaService } from '../../services/colecta.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-colecta',
  templateUrl: './colecta.page.html',
  styleUrls: ['./colecta.page.scss'],
})
export class ColectaPage implements OnInit {

  datos: any[];
  codigoManual: string;
  porcentaje = 0;

  constructor(private colectaService: ColectaService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) { }

  ngOnInit() {

    this.colectaService.getPendientes()
    .subscribe((data:any) => { 
        
      console.log(data); 
      this.datos = data;
    });
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  resetDatos() {

    this.colectaService.resetStorage();
    this.datos = this.colectaService.datos;
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      const item: any = this.colectaService.getItemByCodigoBarra(barcodeData.text);

      if (item !== undefined) {

        this.seleccionarItem(item);

      }


    }).catch(err => {
      console.log('Error', err);
      this.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoManual() {

    if (this.codigoManual !== undefined) {

      let item: any = this.colectaService.getItemByCodigoBarra(this.codigoManual);
      this.seleccionarItem(item);
      this.codigoManual = '';

    } else {
      this.presentToast('Código de barra vacío');
    }
  }

  scanCodeOld() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {
      console.log('Error', err);
      this.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined) {

      this.colectaService.procesarCodigoBarra(codigoBarra);

    } else {
      this.presentToast('Código de barra vacío');
    }
  }

  seleccionarItem(i: any) {

    this.router.navigateByUrl('item-colecta/' + i.numeroFormulario + '-' + i.itemAplicacion);
  }

}

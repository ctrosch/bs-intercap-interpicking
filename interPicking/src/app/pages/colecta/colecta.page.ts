import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Observable } from 'rxjs';
import { ColectaService } from '../../services/colecta.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { async } from '@angular/core/testing';

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
    public toastController: ToastController) {

  }

  ngOnInit() {

    console.log('ColectaPage - ngOnInit()');
    this.cargarPendientes();

  }

  cargarPendientes() {

    this.colectaService.getPendientes()
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.colecta;
          this.colectaService.guardarStorage(this.datos);

        } else {
          console.log('No hay pendientes de picking en estos momentos');
        }

      });

  }

  seleccionarItem(i: any) {

    this.colectaService.item = i;
    this.router.navigateByUrl('item-colecta/' + i.ID);
  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined) {

      this.datos.find(item => {

        item.CODBAR.split('|').find(i => {

          if (i === codigoBarra) {
            this.seleccionarItem(item);
          }

        });

      });

    } else {
      this.presentToast('Código de barra vacío');
    }
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      console.log('Error', err);
      this.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }


  confirmarColecta() {

    this.router.navigateByUrl('colecta-confirmacion');
    
  }
}


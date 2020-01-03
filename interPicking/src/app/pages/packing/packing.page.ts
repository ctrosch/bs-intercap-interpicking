import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { PackingService } from '../../services/packing.service';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.page.html',
  styleUrls: ['./packing.page.scss'],
})
export class PackingPage implements OnInit {

  datos: any[];
  codigoManual: string;
  porcentaje = 0;

  constructor(private packingService: PackingService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) {

  }

  ngOnInit() {

    console.log('PackingPage - ngOnInit()');
    this.cargarPendientes();

  }

  cargarPendientes() {

    this.packingService.getPendientes()
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.packingService.guardarStorage(this.datos);

        } else {
          console.log('No hay pendientes de packing en estos momentos');
        }

      });

  }

  seleccionarItem(i: any) {

    this.packingService.item = i;
    this.router.navigateByUrl('packing-item/' + i.ID);
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


  confirmarPacking() {

    this.packingService.confirmarPacking(this.datos)
      .subscribe(resp => {
        if (resp.ok) {
          this.presentToast('Packing confirmado correctamente');
        } else {
          this.presentToast('Problemas para confirmar packing');
        }
      });
    
  }

}

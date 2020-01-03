import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { PickingService } from '../../services/picking.service';

import * as swal from 'sweetalert';



@Component({
  selector: 'app-picking',
  templateUrl: './picking.page.html',
  styleUrls: ['./picking.page.scss'],
})
export class PickingPage implements OnInit {

  datos: any[];
  codigoManual: string;
  porcentaje = 0;

  constructor(private pickingService: PickingService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) {

  }

  ngOnInit() {

    console.log('ColectaPage - ngOnInit()');
    this.cargarPendientes();

  }

  cargarPendientes() {

    this.pickingService.getPendientes()
      
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.colecta;
          this.pickingService.guardarStorage(this.datos);

        } else {
          console.log('No hay pendientes de picking en estos momentos');
        }

      });

  }

  seleccionarItem(i: any) {

    console.log('item seleccionado', i);

    this.pickingService.item = i;
    this.router.navigateByUrl('picking-item/' + i.ID);
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      console.log('Error', err);
      swal("Error", "Error leyendo código de barra", "error");
    });
  }

  procesarCodigoManual() {

    console.log(this.codigoManual);

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined) {

      let itemEncontrado: any;

      this.datos.find(item => {

        item.CODBAR.split('|').find(i => {

          if (i === codigoBarra) {
            itemEncontrado = item;
          }

        });

      });

      if (itemEncontrado) {
        this.seleccionarItem(itemEncontrado);
      } else {
        swal("Error", "El código de barra obtenido no pertenece a ningún producto pendiente de picking", "error");
      }

    } else {
      this.presentToast('Código de barra vacío');
    }
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }


  confirmarPicking() {

    console.log('confirmar picking');

    this.pickingService.confirmarPicking('CTROSCH')
      .subscribe(resp => {

        console.log(resp);

        if (resp.ok) {
          swal("Picking confirmado","Los productos fueron confirmados correctamente","success")
          .then(value => {
            this.cargarPendientes();
          });
        } else {
          swal("Error", "No es posible guardar los datos", "error");
        }
      });
  }
}


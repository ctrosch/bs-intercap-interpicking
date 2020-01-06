import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment, LoadingController } from '@ionic/angular';
import { PackingService } from '../../services/packing.service';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.page.html',
  styleUrls: ['./packing.page.scss'],
})
export class PackingPage implements OnInit {

  @ViewChild(IonSegment, {static: true}) segment: IonSegment;

  datos: any[];
  pendientes: any[];
  completados: any[];

  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  procesando: any;

  circuito: string;

  constructor(private packingService: PackingService,
              private router: Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController,
              public loadingController: LoadingController) {

  }

  ngOnInit() {

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    this.cargarPendientes();
  }

  cargarPendientes( event? ) {

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    this.packingService.getPendientes()
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.filtrarItems();

          if (event) {
            event.target.complete();
          }

          this.cargando = false;

        } else {
          console.log('No hay pendientes de packing en estos momentos');
        }

      });

  }

  filtrarItems() {

    this.pendientes = this.datos.filter(item => item.CNTPK2 < item.CANTID);
    this.completados = this.datos.filter(item => item.CNTPK2 === item.CANTID);

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  seleccionarItem(i: any) {

    this.packingService.item = i;
    this.router.navigateByUrl('packing-producto/' + i.ID);
  }

  confirmarPacking() {

    this.presentLoading();

    this.packingService.confirmarPacking('ctrosch')
      .subscribe(resp => {

        console.log(resp);

        if (resp.ok) {

          this.cargarPendientes();
          this.procesando.dismiss();

          // swal("Picking confirmado","Los productos fueron confirmados correctamente","success").then(value => {});
        } else {
          // swal("Error", "No es posible guardar los datos", "error");
          this.procesando.dismiss();
        }
      });
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.procesando = await this.loadingController.create({
      message: 'Procesando información'
    });
    return this.procesando.present();
  }

  segmentChanged(event) {

    this.filtrarItems();

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

}

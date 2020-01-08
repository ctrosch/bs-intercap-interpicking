import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment } from '@ionic/angular';
import { PickingService } from '../../services/picking.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-picking',
  templateUrl: './picking.page.html',
  styleUrls: ['./picking.page.scss'],
})
export class PickingPage implements OnInit {

  @ViewChild(IonSegment, {static: true}) segment: IonSegment;

  datos: any[];
  pendientes: any[];
  completados: any[];

  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  procesando: any;

  circuito: string;


  constructor(private pickingService: PickingService,
              private router: Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController,
              public loadingController: LoadingController) {

  }

  ngOnInit() {

    if (this.segment) {
      this.segment.value = 'pendientes';
    }
  }

  ionViewDidEnter() {

    this.cargarPendientes();

  }

  cargarPendientes( event? ) {

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    this.pickingService.getPendientes()
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.colecta;
          this.filtrarItems();

          if (event) {
            event.target.complete();
          }

          this.cargando = false;

        } else {
          console.log('No hay pendientes de picking en estos momentos');
        }

      });

  }

  filtrarItems() {

    this.pendientes = this.datos.filter(item => item.CNTPCK < item.CANTID);
    this.completados = this.datos.filter(item => item.CNTPCK === item.CANTID);

  }

  recargar(event) {

    this.cargarPendientes(event);

  }

  seleccionarItem(i: any) {

    this.pickingService.item = i;
    this.router.navigateByUrl('picking-item/' + i.ID);
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      // console.log('Error', err);
      // swal({title: 'Error',text: 'Error leyendo código de barra',icon: 'error',});
    });
  }

  procesarCodigoManual() {

    // console.log(this.codigoManual);

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined) {

      let itemEncontrado: any;

      this.datos.find(item => {

        if (item.CNTPCK < item.CANTID) {

          item.CODBAR.split('|').find(i => {

            if (i === codigoBarra ) {
              itemEncontrado = item;
            }
          });
        }

      });

      if (itemEncontrado) {
        this.seleccionarItem(itemEncontrado);
      } else {
        this.presentToast('No se encontró producto con el código de barra ' + codigoBarra);
        // swal({title: 'Error',text: 'El código de barra no pertenece a ningún producto pendiene de picking',icon: 'error',});
      }

    } else {
      this.presentToast('Código de barra vacío');
    }
  }

  confirmarPicking() {

    this.presentLoading();

    this.pickingService.confirmarPicking('CTROSCH')
      .subscribe(resp => {

        console.log(resp);

        if (resp.ok) {

          this.cargarPendientes();
          this.procesando.dismiss();

          // swal("Picking confirmado","Los productos fueron confirmados correctamente","success").then(value => {});
        } else {
          // swal("Error", "No es posible guardar los datos", "error");
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

}


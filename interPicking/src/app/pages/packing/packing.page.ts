import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment, LoadingController, NavController } from '@ionic/angular';
import { PackingService } from '../../services/packing.service';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.page.html',
  styleUrls: ['./packing.page.scss'],
})
export class PackingPage implements OnInit {

  @ViewChild(IonSegment, {static: true}) segment: IonSegment;

  usuario: Usuario = {};

  datos: any[];
  pendientes: any[];
  completados: any[];

  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  procesando: any;

  circuito: string;

  constructor(private packingService: PackingService,
              private usuarioService: UsuarioService,
              private uiService: UiServiceService,
              private router: Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController,
              public loadingController: LoadingController,
              private navCtrl: NavController) {

  }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    // this.cargarPendientes();
  }

  ionViewDidEnter() {

    this.cargarPendientes();

  }

  cargarPendientes( event? ) {

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    this.packingService.getPendientes(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.filtrarItems();

          if (event) {
            event.target.complete();
          }
        } else {
          this.uiService.alertaInformativa('No hay pendientes de picking en estos momentos');
          this.navCtrl.navigateRoot('/home', { animated: true });
         
        }

        this.cargando = false;

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

    this.packingService.confirmarPacking(this.usuario.USUARIO)
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

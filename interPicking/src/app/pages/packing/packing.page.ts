import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonSegment, LoadingController, NavController } from '@ionic/angular';
import { PackingService } from '../../services/packing.service';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.page.html',
  styleUrls: ['./packing.page.scss'],
})
export class PackingPage implements OnInit {

  // @ViewChild(IonSegment, {static: true}) segment: IonSegment;

  usuario: Usuario = {};

  pendiente = true;
  filtro: Filtro;

  datos: any[];
  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  titulo = 'Packing';
  procesando: any;

  circuito: string;

  constructor(private packingService: PackingService,
    private usuarioService: UsuarioService,
    public filtroService: FiltroService,
    private uiService: UiServiceService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public loadingController: LoadingController,
    private navCtrl: NavController) {

  }

  ngOnInit() {

    this.filtro = this.filtroService.inicializarFiltro('filtro-picking');
    this.usuario = this.usuarioService.getUsuario();

    /**
    if (this.segment) {
      this.segment.value = 'pendientes';
    }
     */

    // this.cargarPendientes();
  }

  ionViewDidEnter() {

    this.cargarPendientes();

  }

  cargarPendientes(event?) {

    this.cargando = true;

    /**
    if (this.segment) {
      this.segment.value = 'pendientes';
    }
     */

    this.packingService.getPendientes(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.packingService.datos = this.datos;

          if (event) {
            event.target.complete();
          }

          this.titulo = 'Packing (' + this.datos.length + ')';

        } else {
          this.uiService.alertaInformativa('No hay pendientes de packing en estos momentos');
          this.navCtrl.navigateRoot('/home', { animated: true });

        }

        this.cargando = false;

      });

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


  async presentLoading() {
    this.procesando = await this.loadingController.create({
      message: 'Procesando información'
    });
    return this.procesando.present();
  }

  segmentChanged(event) {

    //    this.pendiente = (this.segment.value === 'pendientes');

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined && codigoBarra.length > 0) {

      codigoBarra = codigoBarra.trim();

      this.datos.find(item => {

        item.CODBAR.split('|').find(i => {

          if (i.trim() === codigoBarra) {
            this.seleccionarItem(item);
          }

        });

      });

    } else {
      this.uiService.presentToast('Código de barra vacío');
    }
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      console.log('Error', err);
      this.uiService.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

}

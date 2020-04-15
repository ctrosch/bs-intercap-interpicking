import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonSegment, LoadingController, NavController } from '@ionic/angular';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';
import { ReposicionService } from '../../services/reposicion.service';

@Component({
  selector: 'app-reposicion',
  templateUrl: './reposicion.page.html',
  styleUrls: ['./reposicion.page.scss'],
})
export class ReposicionPage implements OnInit {

  usuario: Usuario = {};

  pendiente = true;
  filtro: Filtro;

  datos: any[];
  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  titulo = 'Reposición';
  procesando: any;

  circuito: string;

  constructor(private reposicionService: ReposicionService,
              private usuarioService: UsuarioService,
              public filtroService: FiltroService,
              private uiService: UiServiceService,
              private router: Router,
              private barcodeScanner: BarcodeScanner,
              public loadingController: LoadingController,
              private navCtrl: NavController) {

  }

  ngOnInit() {

    this.filtro = this.filtroService.inicializarFiltro('filtro-reposicion');
    this.usuario = this.usuarioService.getUsuario();
    
  }

  ionViewDidEnter() {

    this.cargarPendientes();

  }

  cargarPendientes( event? ) {

    this.cargando = true;

    this.reposicionService.getPendientes(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.reposicionService.datos = this.datos;
          this.titulo = 'Reposición ('+this.datos.length+')';

          if (event) {
            event.target.complete();
          }


        } else {
          this.uiService.alertaInformativa('No hay pendientes de reposición en estos momentos');
          this.navCtrl.navigateRoot('/home', { animated: true });

        }

        this.cargando = false;

      });

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  seleccionarItem(i: any) {

    this.reposicionService.item = i;
    this.router.navigateByUrl('reposicion-producto/' + i.MODFOR + i.CODFOR + i.NROFOR);
  }

  confirmarReposicion() {

    this.presentLoading();

    this.reposicionService.confirmarReposicion(this.usuario.USUARIO)
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

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra === undefined) {
      this.uiService.presentToast('Código de barra vacío');
      return;
    } else {
      codigoBarra = codigoBarra.replace('\n', '');
      codigoBarra = codigoBarra.trim();
    }

    if (codigoBarra.length > 0) {

      let itemEncontrado: any;

      this.datos.find(item => {

        if (item.CNTPCK + item.CNTFST < item.CANTID) {

          item.CODBAR.split('|').find(i => {

            if (i.trim() === codigoBarra) {
              itemEncontrado = item;
              return;
            }
          });
        }

      });

      if (itemEncontrado) {
        this.seleccionarItem(itemEncontrado);
      } else {
        this.uiService.alertaInformativa('No se encontró producto con el código de barra ' + codigoBarra);
      }

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

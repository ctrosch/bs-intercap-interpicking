import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment } from '@ionic/angular';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { UiServiceService } from '../../../services/ui-service.service';
import { ReposicionService } from '../../../services/reposicion.service';

@Component({
  selector: 'app-reposicion-producto',
  templateUrl: './reposicion-producto.page.html',
  styleUrls: ['./reposicion-producto.page.scss'],
})
export class ReposicionProductoPage implements OnInit {

  @ViewChild(IonSegment, { static: true }) segment: IonSegment;

  usuario: Usuario = {};

  pendiente = true;
  completados = false;
  filtro: Filtro;

  datos: any[];
  item: any;

  codigoManual: string;
  cargando = false;
  procesando: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public filtroService: FiltroService,
              private uiService: UiServiceService,
              private reposicionService: ReposicionService,
              private barcodeScanner: BarcodeScanner,
              private usuarioService: UsuarioService,
              public toastController: ToastController) {

    this.filtro = this.filtroService.inicializarFiltro('filtro-reposicion');
    this.usuario = this.usuarioService.getUsuario();

  }

  ngOnInit() {

    // console.log('ItemColecta - ngOnInit');
    this.item = this.reposicionService.item;
    this.cargarPendientes();
  }

  cargarPendientes(event?) {

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    if (!this.item) {
      return;
    }


    this.reposicionService.getProductosPendiente(this.item)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.datos;

          if (event) {
            event.target.complete();
          }


        } else {
          console.log('No hay productos pendientes de reposicion en estos momentos');
        }
        this.cargando = false;
      });

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  seleccionarItem(i: any) {

    this.reposicionService.itemProducto = i;
    this.router.navigateByUrl('reposicion-item/' + i.ID);

  }

  segmentChanged(event) {

    this.pendiente = (this.segment.value === 'pendientes');

  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

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
      
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {
      
      // swal({title: 'Error',text: 'Error leyendo código de barra',icon: 'error',});
    });
  }


}

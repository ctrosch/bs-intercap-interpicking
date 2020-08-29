import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackingService } from '../../../services/packing.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment, IonToggle } from '@ionic/angular';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { UiServiceService } from '../../../services/ui-service.service';

@Component({
  selector: 'app-packing-producto',
  templateUrl: './packing-producto.page.html',
  styleUrls: ['./packing-producto.page.scss'],
})
export class PackingProductoPage implements OnInit {

  // @ViewChild(IonSegment, { static: true }) segment: IonSegment;
  @ViewChild(IonToggle, { static: true }) toggle: IonToggle;

  usuario: Usuario = {};

  completados = false;
  pendiente = true;
  filtro: Filtro;

  datos: any[];
  item: any;

  codigoManual: string;
  cargando = false;
  titulo = ''
  procesando: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public filtroService: FiltroService,
              private uiService: UiServiceService,
              private packingService: PackingService,
              private barcodeScanner: BarcodeScanner,
              private usuarioService: UsuarioService,
              public toastController: ToastController) {

    this.filtro = this.filtroService.inicializarFiltro('filtro-packing');
    this.usuario = this.usuarioService.getUsuario();

  }

  ngOnInit() {

    console.log('************************* CARGA PENDIENTE *********************************************');

    // console.log('ItemColecta - ngOnInit');
    this.item = this.packingService.item;
    this.cargarPendientes();
  }

  cargarPendientes(event?) {

    this.cargando = true;

    /**
    if (this.segment) {
      this.segment.value = 'pendientes';
    }
     */

    if (!this.item) {
      return;
    }


    this.packingService.getProductosPendiente(this.item)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;

          if (event) {
            event.target.complete();
          }

        } else {
          console.log('No hay productos pendientes de packing en estos momentos');
        }
        this.cargando = false;
      });

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  seleccionarItem(i: any) {

    this.packingService.itemProducto = i;
    this.router.navigateByUrl('packing-item/' + i.ID);

  }

  segmentChanged(event) {

    //this.pendiente = (this.segment.value === 'pendientes');

  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined) {

      let itemEncontrado: any;

      this.datos.find(item => {

        if (item.CNTPK2 < item.CANTID) {

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
        this.uiService.alertaInformativa('No se encontró producto con el código de barra ' + codigoBarra);
        // swal({title: 'Error',text: 'El código de barra no pertenece a ningún producto pendiene de picking',icon: 'error',});
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

  toggleChanged(event) {
    this.completados = !this.completados;
  }

  volverEstado(i: any) {

    //console.log('volver estado');

    if (!i) {
      return;
    }

      i.ESTPCK = 'B';
      i.ESTPK2 = 'A';
      i.CNTPK2 = 0;
   

    this.packingService.confirmarItem(i)
      .subscribe(resp => {
        if (resp.ok) {

          this.router.navigateByUrl('packing');

        } else {
          // swal({title: 'Error',text: 'Problemas para confirmar picking',icon: 'error',});
        }
      });
  }


}

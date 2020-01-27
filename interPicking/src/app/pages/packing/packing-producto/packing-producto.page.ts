import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackingService } from '../../../services/packing.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment } from '@ionic/angular';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-packing-producto',
  templateUrl: './packing-producto.page.html',
  styleUrls: ['./packing-producto.page.scss'],
})
export class PackingProductoPage implements OnInit {

  @ViewChild(IonSegment, { static: true }) segment: IonSegment;

  usuario: Usuario = {};

  pendiente = true;
  filtro: Filtro;

  datos: any[];
  item: any;

  cargando = false;
  procesando: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public filtroService: FiltroService,
              private packingService: PackingService,
              private barcodeScanner: BarcodeScanner,
              private usuarioService: UsuarioService,
              public toastController: ToastController) {

    this.filtro = this.filtroService.inicializarFiltro();
    this.usuario = this.usuarioService.getUsuario();

  }

  ngOnInit() {

    // console.log('ItemColecta - ngOnInit');
    this.item = this.packingService.item;
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

    this.pendiente = (this.segment.value === 'pendientes');

  }


}

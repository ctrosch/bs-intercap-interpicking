import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackingService } from '../../../services/packing.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-packing-producto',
  templateUrl: './packing-producto.page.html',
  styleUrls: ['./packing-producto.page.scss'],
})
export class PackingProductoPage implements OnInit {

  @ViewChild(IonSegment, {static: true}) segment: IonSegment;

  item: any;
  datos: any[];
  pendientes: any[];
  completados: any[];

  cargando = false;
  procesando: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private packingService: PackingService,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController) { }

  ngOnInit() {

    // console.log('ItemColecta - ngOnInit');
    this.item = this.packingService.item;
    this.cargarPendientes();
  }

  cargarPendientes( event? ) {

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    if (!this.item) {
      return;
    }

    console.log(this.item);

    this.packingService.getProductosPendiente(this.item)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.filtrarItems();

          if (event) {
            event.target.complete();
          }
          this.cargando = false;

        } else {
          console.log('No hay productos pendientes de packing en estos momentos');
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

    this.packingService.itemProducto = i;
    this.router.navigateByUrl('packing-item/' + i.ID);
  }

  segmentChanged(event) {

    this.filtrarItems();

  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackingService } from '../../../services/packing.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-packing-item',
  templateUrl: './packing-item.page.html',
  styleUrls: ['./packing-item.page.scss'],
})
export class PackingItemPage implements OnInit {

  usuario: Usuario = {};

  item: any;
  codigoBarra: string;
  cantidadManual = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private packingService: PackingService,
    private barcodeScanner: BarcodeScanner,
    private usuarioService: UsuarioService) {

    // console.log('ItemColecta - constructor ');
  }

  ngOnInit() {

    // console.log('ItemColecta - ngOnInit');
    this.item = this.packingService.itemProducto;
    this.usuario = this.usuarioService.getUsuario();

    if (this.item) {
      this.cantidadManual = this.item.CNTPK2;
    }

    // console.log(this.item);

  }

  add(key: number) {

    if (key === 0 && this.cantidadManual === 0) {
      return;
    }

    this.cantidadManual = this.cantidadManual * 10 + key;

    if (this.cantidadManual > this.item.cantidad) {
      this.cantidadManual = 0;
    }

  }

  clean() {

    if (this.cantidadManual === 0) {
      return;
    }

    if (this.cantidadManual < 10) {
      this.cantidadManual = 0;
      return;
    }

    this.cantidadManual = Number(String(this.cantidadManual).substring(0, String(this.cantidadManual).length - 1));

  }

  confirmar() {

    const resultado: boolean = this.packingService.confirmarCantidad(this.item, Number(this.cantidadManual));

    if (resultado) {

      this.item.USUARIO = this.usuario.USUARIO;

      this.packingService.confirmarItem(this.item)
        .subscribe(resp => {
          if (resp.ok) {

            this.router.navigateByUrl('packing-producto/' + this.item.ID);

          } else {
            // swal({title: 'Error',text: 'Problemas para confirmar picking',icon: 'error',});
          }
        });
      // }
    }
  }

  resetCantidad() {

    this.packingService.resetCantidad(this.item);
    this.cantidadManual = this.item.CNTPK2;
  }

  sendInfo() {

  }

}

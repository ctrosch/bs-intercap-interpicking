import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { ReposicionService } from '../../../services/reposicion.service';
import { UiServiceService } from '../../../services/ui-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reposicion-item',
  templateUrl: './reposicion-item.page.html',
  styleUrls: ['./reposicion-item.page.scss'],
})
export class ReposicionItemPage implements OnInit {

  usuario: Usuario = {};

  item: any;
  codigoBarra: string;
  cantidadManual = 0;
  cantidadFaltante = 0;

  cargando = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private reposicionService: ReposicionService,
    private barcodeScanner: BarcodeScanner,
    private uiService: UiServiceService,
    private navCtrl: NavController,
    private usuarioService: UsuarioService
  ) {

    // console.log('ItemColecta - constructor ');
  }

  ngOnInit() {

    this.item = this.reposicionService.itemProducto;
    this.usuario = this.usuarioService.getUsuario();

    if (this.item) {
      this.cantidadManual = this.item.CNTPCK;
      this.cantidadFaltante = this.item.CNTFST;
    }

  }

  add(key: number, tipoCantidad: string) {

    if (tipoCantidad === 'P') {

      if (key === 0 && this.cantidadManual === 0) {
        return;
      }

      this.cantidadManual = this.cantidadManual * 10 + key;

      if (this.cantidadManual > this.item.cantidad + this.cantidadFaltante) {
        this.cantidadManual = 0;
      }
    }

    if (tipoCantidad === 'F') {

      if (key === 0 && this.cantidadFaltante === 0) {
        return;
      }

      this.cantidadFaltante = this.cantidadFaltante * 10 + key;

      if (this.cantidadFaltante > this.item.cantidad + this.cantidadManual) {
        this.cantidadFaltante = 0;
      }
    }
  }

  clean(tipoCantidad: string) {

    if (tipoCantidad === 'P') {

      if (this.cantidadManual === 0) {
        return;
      }

      if (this.cantidadManual < 10) {
        this.cantidadManual = 0;
        return;
      }

      this.cantidadManual = Number(String(this.cantidadManual).substring(0, String(this.cantidadManual).length - 1));
    }

    if (tipoCantidad === 'F') {

      if (this.cantidadFaltante === 0) {
        return;
      }

      if (this.cantidadFaltante < 10) {
        this.cantidadFaltante = 0;
        return;
      }
      this.cantidadFaltante = Number(String(this.cantidadFaltante).substring(0, String(this.cantidadFaltante).length - 1));
    }

  }

confirmar() {

  const resultado: boolean = this.reposicionService.confirmarCantidad(this.item, Number(this.cantidadManual), Number(this.cantidadFaltante));

  if (resultado) {

    this.item.USUARIO = this.usuario.USUARIO;

    this.reposicionService.confirmarItem(this.item)
      .subscribe(resp => {
        if (resp.ok) {

          this.router.navigateByUrl('reposicion-producto/' + this.item.ID);

        } else {
          // swal({title: 'Error',text: 'Problemas para confirmar picking',icon: 'error',});
        }
      });
    // }
  }
}

resetCantidad() {

  this.reposicionService.resetCantidad(this.item);
  this.cantidadManual = this.item.CNTPCK;
}

sendInfo() {

}

}

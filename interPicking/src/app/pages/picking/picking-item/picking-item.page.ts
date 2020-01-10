import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { PickingService } from '../../../services/picking.service';
import { UiServiceService } from '../../../services/ui-service.service';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-picking-item',
  templateUrl: './picking-item.page.html',
  styleUrls: ['./picking-item.page.scss'],
})
export class PickingItemPage implements OnInit {

  usuario: Usuario = {};

  item: any;
  codigoBarra: string;
  cantidadManual = 0;

  cargando = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private pickingService: PickingService,
    private barcodeScanner: BarcodeScanner,
    private uiService: UiServiceService,
    private navCtrl: NavController,
    private usuarioService: UsuarioService
  ) {

    // console.log('ItemColecta - constructor ');
  }

  ngOnInit() {

    //this.cargando = true;

    this.item = this.pickingService.item;
    this.usuario = this.usuarioService.getUsuario();

    /** 
    this.pickingService.getItemPendiente().subscribe(resp => {

        if ( resp.ok ) {
          this.item = resp.colecta;
        } else {
          this.uiService.alertaInformativa('El item seleccionado ya no se encuentra disponible');
          this.navCtrl.navigateRoot('/home', { animated: true });
        }

        this.cargando = false;

    } );
    */

    if (this.item) {
      this.cantidadManual = this.item.CNTPCK;
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

    const resultado: boolean = this.pickingService.confirmarCantidad(this.item, Number(this.cantidadManual));

    if (resultado) {

      this.item.USUARIO = this.usuario.USUARIO;

      this.pickingService.confirmarItem(this.item)
        .subscribe(resp => {
          if (resp.ok) {

            this.router.navigateByUrl('picking');

          } else {
            // swal({title: 'Error',text: 'Problemas para confirmar picking',icon: 'error',});
          }
        });
      // }
    }
  }

  resetCantidad() {

    this.pickingService.resetCantidad(this.item);
    this.cantidadManual = this.item.CNTPCK;
  }

  sendInfo() {

  }


}

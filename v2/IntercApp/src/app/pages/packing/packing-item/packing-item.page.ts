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

  bulto: any;
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
    this.bulto = this.packingService.bulto;
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

      this.item.USUARIO = '';
      this.item.NROBUL = '';

      if (this.item.CNTPK2 > 0) {

        this.item.USUARIO = this.usuario.USUARIO;
        this.item.NROBUL = this.bulto.CODFOR + '-' + this.bulto.NROFOR;

      }

      console.log('NRO DE BULTO A CONFIRMAR ' + this.item.NROBUL);

      this.packingService.confirmarItem(this.item)
        .subscribe(resp => {
          if (resp.ok) {

            if(this.item.CANTID === this.item.CANTID - this.item.CNTFST){
              this.item.ESTPK2 = 'B';
            }else{
              this.item.ESTPK2 = 'A';
            }

            this.router.navigateByUrl('packing-producto/' + this.item.ID);

          } else {
            
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

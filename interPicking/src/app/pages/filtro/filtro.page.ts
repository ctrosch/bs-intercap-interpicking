import { Component, OnInit } from '@angular/core';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';
import { NavController } from '@ionic/angular';
import { PickingService } from '../../services/picking.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.page.html',
  styleUrls: ['./filtro.page.scss'],
})
export class FiltroPage implements OnInit {

  filtro: Filtro;
  circuito = '';
  clientes: string[];
  transportes: string[];
  tipoProducto = '';

  constructor(public filtroService: FiltroService,
              public pickingService: PickingService,
              private navCtrl: NavController) {

    this.filtro = this.filtroService.filtro;

    this.prepararDatosClientes();
    this.prepararDatosTransporte();

  }

  ngOnInit() {

  }

  guardarFiltro() {

    console.log(this.filtroService.filtro);

    // this.filtroService.filtro.CIRCOM = this.circuito;

    this.filtroService.guardarFiltro();
    this.navCtrl.navigateRoot('/home', { animated: true });

  }

  prepararDatosClientes() {

    this.clientes = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        // console.log(item.NOMBRE);

        if (!map.has(item.NOMBRE)
          && (this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)) {

          map.set(item.NOMBRE, true);    // set any value to Map
          this.clientes.push(item.NOMBRE);
        }
      });

      this.clientes.sort();

    }

  }
    

    prepararDatosTransporte() {

      this.transportes = [];
      const map = new Map();
  
      if (this.pickingService.datos) {
  
        this.pickingService.datos.forEach(item => {
  
          // console.log(item.NOMBRE);
  
          if (!map.has(item.TRADES)
            && (this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)) {
  
            map.set(item.TRADES, true);    // set any value to Map
            this.transportes.push(item.TRADES);
          }
        });
  
        this.transportes.sort();
  
      }
  }


}

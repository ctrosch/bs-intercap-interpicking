import { Component, OnInit } from '@angular/core';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { NavController } from '@ionic/angular';
import { PackingService } from '../../../services/packing.service';

@Component({
  selector: 'app-filtro-packing',
  templateUrl: './filtro-packing.page.html',
  styleUrls: ['./filtro-packing.page.scss'],
})
export class FiltroPackingPage implements OnInit {

  filtro: Filtro;
  circuito = '';
  clientes: string[];
  transportes: string[];
  tipoProducto = '';

  constructor(public filtroService: FiltroService,
              public packingService: PackingService,
              private navCtrl: NavController) {

    this.filtro = this.filtroService.inicializarFiltro('filtro-packing');
    this.prepararDatosClientes();
    this.prepararDatosTransporte();

  }

  ngOnInit() {

  }

  guardarFiltro() {

    this.filtroService.guardarFiltro();
    this.navCtrl.navigateRoot('/packing', { animated: true });
  }

  limpiarFiltro() {

    this.filtroService.limpiarFiltro();
  }

  prepararDatosClientes() {

    this.clientes = [];
    const map = new Map();

    if (this.packingService.datos) {

      this.packingService.datos.forEach(item => {

        // console.log(item.NOMBRE);

        if (!map.has(item.NOMBRE)
          && (this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.TRADES || this.filtro.TRADES && item['TRADES'].includes(this.filtro.TRADES) || this.filtro.TRADES.length === 0)) {

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
  
      if (this.packingService.datos) {
  
        this.packingService.datos.forEach(item => {
  
          // console.log(item.NOMBRE);
  
          if (!map.has(item.TRADES)
            && (this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
            && (!this.filtro.NOMBRE || this.filtro.NOMBRE && item['NOMBRE'].includes(this.filtro.NOMBRE) || this.filtro.NOMBRE.length === 0)) {
  
            map.set(item.TRADES, true);    // set any value to Map
            this.transportes.push(item.TRADES);
          }
        });
  
        this.transportes.sort();
  
      }
  }

}

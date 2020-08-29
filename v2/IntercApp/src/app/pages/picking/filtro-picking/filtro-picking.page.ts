import { Component, OnInit } from '@angular/core';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { PickingService } from '../../../services/picking.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-filtro-picking',
  templateUrl: './filtro-picking.page.html',
  styleUrls: ['./filtro-picking.page.scss'],
})
export class FiltroPickingPage implements OnInit {

  filtro: Filtro;
  circuito = '';
  clientes: string[];
  sitios: string[];
  transportes: string[];
  tipoProductos: string[];
  fechas: Date[];
  tipoProducto = '';

  constructor(public filtroService: FiltroService,
    public pickingService: PickingService,
    private navCtrl: NavController) {

    this.filtro = this.filtroService.inicializarFiltro('filtro-picking');
    this.prepararFiltros();

  }

  ngOnInit() {

  }

  prepararFiltros() {

    this.prepararDatosClientes();
    this.prepararDatosTransporte();
    this.prepararDatosTipoProducto();
    this.prepararDatosSitios();
    this.prepararDatosFechas();
  }

  guardarFiltro() {

    this.filtroService.guardarFiltro();
    this.navCtrl.navigateRoot('/picking', { animated: true });
  }

  limpiarFiltro() {

    this.filtroService.limpiarFiltro();
        
  }

  prepararDatosClientes() {

    this.clientes = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        if (!map.has(item.NOMBRE)
          && (!this.filtro.CIRCOM || this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.SITDES || this.filtro.SITDES && item['SITDES'].includes(this.filtro.SITDES) || this.filtro.SITDES.length === 0)
          && (!this.filtro.FCHMOV || this.filtro.FCHMOV && item['FCHMOV'].includes(this.filtro.FCHMOV) || this.filtro.FCHMOV === null)
          && (!this.filtro.TRADES || this.filtro.TRADES && item['TRADES'].includes(this.filtro.TRADES) || this.filtro.TRADES.length === 0)
          && (!this.filtro.TIPDES || this.filtro.TIPDES && item['TIPDES'].includes(this.filtro.TIPDES) || this.filtro.TIPDES.length === 0)) {

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
          && (!this.filtro.CIRCOM || this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.SITDES || this.filtro.SITDES && item['SITDES'].includes(this.filtro.SITDES) || this.filtro.SITDES.length === 0)
          && (!this.filtro.FCHMOV || this.filtro.FCHMOV && item['FCHMOV'].includes(this.filtro.FCHMOV) || this.filtro.FCHMOV === null)
          && (!this.filtro.NOMBRE || this.filtro.NOMBRE && item['NOMBRE'].includes(this.filtro.NOMBRE) || this.filtro.NOMBRE.length === 0)
          && (!this.filtro.TIPDES || this.filtro.TIPDES && item['TIPDES'].includes(this.filtro.TIPDES) || this.filtro.TIPDES.length === 0)) {

          map.set(item.TRADES, true);    // set any value to Map
          this.transportes.push(item.TRADES);
        }
      });

      this.transportes.sort();

    }
  }


  prepararDatosTipoProducto() {

    this.tipoProductos = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        // console.log(item.NOMBRE);

        if (!map.has(item.TIPDES)
          && (!this.filtro.CIRCOM || this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.SITDES || this.filtro.SITDES && item['SITDES'].includes(this.filtro.SITDES) || this.filtro.SITDES.length === 0)
          && (!this.filtro.FCHMOV || this.filtro.FCHMOV && item['FCHMOV'].includes(this.filtro.FCHMOV) || this.filtro.FCHMOV === null)
          && (!this.filtro.NOMBRE || this.filtro.NOMBRE && item['NOMBRE'].includes(this.filtro.NOMBRE) || this.filtro.NOMBRE.length === 0)
          && (!this.filtro.TRADES || this.filtro.TRADES && item['TRADES'].includes(this.filtro.TRADES) || this.filtro.TRADES.length === 0)) {

          map.set(item.TIPDES, true);    // set any value to Map
          this.tipoProductos.push(item.TIPDES);
        }
      });

      this.tipoProductos.sort();

    }
  }


  prepararDatosSitios() {

    this.sitios = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        // console.log(item.NOMBRE);

        if (!map.has(item.SITDES)
          && (!this.filtro.CIRCOM || this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.FCHMOV || this.filtro.FCHMOV && item['FCHMOV'].includes(this.filtro.FCHMOV) || this.filtro.FCHMOV === null)
          && (!this.filtro.NOMBRE || this.filtro.NOMBRE && item['NOMBRE'].includes(this.filtro.NOMBRE) || this.filtro.NOMBRE.length === 0)
          && (!this.filtro.TRADES || this.filtro.TRADES && item['TRADES'].includes(this.filtro.TRADES) || this.filtro.TRADES.length === 0)
          && (!this.filtro.TIPDES || this.filtro.TIPDES && item['TIPDES'].includes(this.filtro.TIPDES) || this.filtro.TIPDES.length === 0)) {

          map.set(item.SITDES, true);    // set any value to Map
          this.sitios.push(item.SITDES);
        }
      });

      this.sitios.sort();

    }
  }


  prepararDatosFechas() {

    this.fechas = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        if (!map.has(item.FCHMOV)
          && (!this.filtro.CIRCOM || this.filtro.CIRCOM && item['CIRCOM'].includes(this.filtro.CIRCOM) || this.filtro.CIRCOM.length === 0)
          && (!this.filtro.SITDES || this.filtro.SITDES && item['SITDES'].includes(this.filtro.SITDES) || this.filtro.SITDES.length === 0)
          && (!this.filtro.NOMBRE || this.filtro.NOMBRE && item['NOMBRE'].includes(this.filtro.NOMBRE) || this.filtro.NOMBRE.length === 0)
          && (!this.filtro.TRADES || this.filtro.TRADES && item['TRADES'].includes(this.filtro.TRADES) || this.filtro.TRADES.length === 0)
          && (!this.filtro.TIPDES || this.filtro.TIPDES && item['TIPDES'].includes(this.filtro.TIPDES) || this.filtro.TIPDES.length === 0)) {

          map.set(item.FCHMOV, true);    // set any value to Map
          this.fechas.push(item.FCHMOV);
        }
      });

      this.fechas.sort();

    }
  }

}

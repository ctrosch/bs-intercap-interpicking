import { Component, OnInit } from '@angular/core';
import { Filtro } from '../../../model/filtro';
import { FiltroService } from '../../../services/filtro.service';
import { PickingService } from '../../../services/picking.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-filtro-reposicion',
  templateUrl: './filtro-reposicion.page.html',
  styleUrls: ['./filtro-reposicion.page.scss'],
})
export class FiltroReposicionPage implements OnInit {

  filtro: Filtro;
  circuito = '';
  sitios: string[];
  tipoProductos: string[];
  tipoProducto = '';

  constructor(public filtroService: FiltroService,
    public pickingService: PickingService,
    private navCtrl: NavController) {

    this.filtro = this.filtroService.inicializarFiltro('filtro-reposicion');
    this.prepararFiltros();

  }

  ngOnInit() {

  }

  prepararFiltros() {

    this.prepararDatosTipoProducto();
    this.prepararDatosSitios();
  }

  guardarFiltro() {

    this.filtroService.guardarFiltro();
    this.navCtrl.navigateRoot('/reposicion', { animated: true });
  }

  limpiarFiltro() {

    this.filtroService.limpiarFiltro();
  }

  
  prepararDatosTipoProducto() {

    this.tipoProductos = [];
    const map = new Map();

    if (this.pickingService.datos) {

      this.pickingService.datos.forEach(item => {

        // console.log(item.NOMBRE);

        if (!map.has(item.TIPDES)
          && (!this.filtro.SITDES || this.filtro.SITDES && item['SITDES'].includes(this.filtro.SITDES) || this.filtro.SITDES.length === 0)
          ) {

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
          && (!this.filtro.TIPDES || this.filtro.TIPDES && item['TIPDES'].includes(this.filtro.TIPDES) || this.filtro.TIPDES.length === 0)) {

          map.set(item.SITDES, true);    // set any value to Map
          this.sitios.push(item.SITDES);
        }
      });

      this.sitios.sort();

    }
  }

}

import { Injectable } from '@angular/core';
import { Filtro } from '../model/filtro';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  nombre = 'filtro';
  filtro: Filtro = {};

  private filtroTemplate: Filtro = {
    CIRCOM: '',
    NOMBRE: null,
    TRADES: null,
    TIPDES: null,
    SITDES: null
  };

  constructor(private storage: Storage) {

  }

  inicializarFiltro(nombre: string) {

    this.nombre = nombre;
    this.cargarFiltro();
    return this.filtro;

  }

  async guardarFiltro() {

    await this.storage.set(this.nombre, this.filtro);

  }

  async cargarFiltro() {

    this.filtro = await this.storage.get(this.nombre) || null;

    if (!this.filtro) {

      console.log('Cargando filtro template');

      this.filtro = this.filtroTemplate;
      this.guardarFiltro();
    }

  }

  /*
  * Limpiamos todos los filtros excepto el del circuito que siempre queda estático.
  */
  async limpiarFiltro() {

    this.filtro.CIRCOM = null;
    this.filtro.NOMBRE = null;
    this.filtro.TRADES = null;
    this.filtro.TIPDES = null;
    this.filtro.NUBICA = null;
    this.filtro.SITDES = null;

    await this.storage.set(this.nombre, this.filtro);

  }


}


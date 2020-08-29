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
    ACTIVO: false,
    CIRCOM: '',
    FCHMOV: null,
    NOMBRE: null,
    TRADES: null,
    TIPDES: null,
    SITDES: null,

  };

  constructor(private storage: Storage) {

  }

  inicializarFiltro(nombre: string) {

    this.nombre = nombre;
    this.cargarFiltro();
    return this.filtro;

  }

  async guardarFiltro() {

    if (this.filtro.CIRCOM || this.filtro.SITDES || this.filtro.FCHMOV || this.filtro.NOMBRE || this.filtro.TRADES || this.filtro.TIPDES || this.filtro.ARTCOD || this.filtro.NUBICA || this.filtro.NROPAR ){
      this.filtro.ACTIVO =  true;
    }else{
      this.filtro.ACTIVO =  false;
    }

    await this.storage.set(this.nombre, this.filtro);

  }

  async cargarFiltro() {

    this.filtro = await this.storage.get(this.nombre) || null;

    if (!this.filtro) {

      //console.log('Cargando filtro template');

      this.filtro = this.filtroTemplate;
      this.guardarFiltro();
    }

  }

  /*
  * Limpiamos todos los filtros excepto el del circuito que siempre queda estático.
  */
  async limpiarFiltro() {

    this.filtro.ACTIVO = false;
    this.filtro.CIRCOM = null;
    this.filtro.NOMBRE = null;
    this.filtro.TRADES = null;
    this.filtro.TIPDES = null;
    this.filtro.NUBICA = null;
    this.filtro.SITDES = null;
    this.filtro.FCHMOV = null;

    await this.storage.set(this.nombre, this.filtro);

  }


}


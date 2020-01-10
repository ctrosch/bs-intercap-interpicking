import { Injectable } from '@angular/core';
import { Filtro } from '../model/filtro';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  filtro: Filtro = {};

  private filtroTemplate: Filtro = {
    CIRCOM: '0260'
  };

  constructor(private storage: Storage) {

  }

  inicializarFiltro() {

    this.cargarFiltro();

    return this.filtro;

  }

  async guardarFiltro() {

    await this.storage.set('filtro', this.filtro);

  }

  async cargarFiltro() {

    this.filtro = await this.storage.get('filtro') || null;

    if (!this.filtro) {

      console.log('Cargando filtro template');

      this.filtro = this.filtroTemplate;
      this.guardarFiltro();
    }

  }
}

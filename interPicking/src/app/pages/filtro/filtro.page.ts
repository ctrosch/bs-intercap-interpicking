import { Component, OnInit } from '@angular/core';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.page.html',
  styleUrls: ['./filtro.page.scss'],
})
export class FiltroPage implements OnInit {

  filtro: Filtro;
  circuito = '';

  constructor(public filtroService: FiltroService,
              private navCtrl: NavController) {

    this.filtro = this.filtroService.filtro;

  }

  ngOnInit() {

  }

  guardarFiltro() {

    console.log(this.filtroService.filtro);

    // this.filtroService.filtro.CIRCOM = this.circuito;

    this.filtroService.guardarFiltro();
    this.navCtrl.navigateRoot('/home', { animated: true });

  }

}

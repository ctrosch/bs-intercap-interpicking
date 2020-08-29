import { Component, OnInit, Input } from '@angular/core';
import { PackingService } from '../../services/packing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.scss'],
})
export class ItemProductoComponent implements OnInit {

  tituloAccion: string;
  @Input() item: any;
  @Input() tipo: string;

  constructor(private router: Router,
              private packingService: PackingService) { }

  ngOnInit() {

    if (this.tipo === 'picking') {
      this.tituloAccion = 'Reiniciar Picking';
    }

    if (this.tipo === 'packing') {
      this.tituloAccion = 'Enviar a Picking';
    }

    if (this.tipo === 'paacking') {
      this.tituloAccion = 'Enviar a Packing';
    }

  }

  

}

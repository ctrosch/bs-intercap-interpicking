import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  @Input() cargando?: boolean;
  @Input() filtro?: string;

  constructor(private router: Router) { }

  ngOnInit() { }
  

  verFiltro() {    

    if (!this.filtro) {
      
      return;
    }

    if (this.filtro === 'picking') {
        this.router.navigateByUrl('filtro-picking');  
    }

    if (this.filtro === 'packing') {
      this.router.navigateByUrl('filtro-packing');  
    }

    if (this.filtro === 'reposicion') {
      this.router.navigateByUrl('filtro-reposicion');  
    }

    if (this.filtro === 'recepcion') {
      this.router.navigateByUrl('filtro-recepcion');  
    }

    if (this.filtro === 'toma-inventario') {
      this.router.navigateByUrl('toma-inventario');  
    }

    
  }

}

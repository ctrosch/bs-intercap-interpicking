import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { IonToggle } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild(IonToggle, { static: true }) toggle: IonToggle;

  @Input() titulo: string;
  @Input() cargando?: boolean;
  @Input() filtro?: string;
  @Input() completados: boolean;
  @Input() ocultaToggle: boolean;
  

  @Output() changeToggle = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {

    this.toggle.checked = this.completados;
  }
  

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

  toggleChanged(event) {
    
    this.changeToggle.emit(this.toggle.checked);

  }

}

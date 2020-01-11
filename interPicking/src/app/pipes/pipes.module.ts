import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FiltroPendientesPipe } from './filtro-pendientes.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltroPendienteClientePipe } from './filtro-pendiente-cliente.pipe';



@NgModule({
  declarations: [DomSanitizerPipe, FiltroPendientesPipe, FiltroPendienteClientePipe],
  imports: [CommonModule],
  exports:[DomSanitizerPipe, FiltroPendientesPipe, FiltroPendienteClientePipe]
})
export class PipesModule { }

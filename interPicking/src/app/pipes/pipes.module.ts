import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FiltroPendientesPipe } from './filtro-pendientes.pipe';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [DomSanitizerPipe, FiltroPendientesPipe],
  imports: [CommonModule],
  exports:[DomSanitizerPipe, FiltroPendientesPipe]
})
export class PipesModule { }

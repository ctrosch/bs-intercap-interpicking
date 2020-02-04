import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FiltroPendientesPipe } from './filtro-pendientes.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltroPendienteClientePipe } from './filtro-pendiente-cliente.pipe';
import { FiltroPickingPipe } from './filtro-picking.pipe';
import { FiltroPackingClientePipe } from './filtro-packing-cliente.pipe';
import { FiltroPackingProductoPipe } from './filtro-packing-producto.pipe';
import { CapitalizePipe } from './capitalize.pipe';



@NgModule({
  declarations: [DomSanitizerPipe, FiltroPendientesPipe, FiltroPendienteClientePipe, FiltroPickingPipe, FiltroPackingClientePipe, FiltroPackingProductoPipe, CapitalizePipe],
  imports: [CommonModule],
  exports:[DomSanitizerPipe, FiltroPendientesPipe, FiltroPendienteClientePipe,FiltroPickingPipe,FiltroPackingClientePipe,FiltroPackingProductoPipe]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FiltroPackingClientePipe } from './filtro-packing-cliente.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { FiltroPipe } from './filtro.pipe';
import { FiltroReposicionPipe } from './filtro-reposicion.pipe';



@NgModule({
  declarations: [
    DomSanitizerPipe,    
    FiltroPackingClientePipe,     
    CapitalizePipe, 
    FiltroPipe,  
  FiltroReposicionPipe],
  imports: [CommonModule],
  exports: [DomSanitizerPipe, 
    FiltroPipe,     
    FiltroPackingClientePipe,
    FiltroReposicionPipe]
})
export class PipesModule { }

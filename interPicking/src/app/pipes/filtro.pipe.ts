import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPendiente'
})
export class FiltroPendientePipe implements PipeTransform {

  transform( arreglo: any[], tipoFiltro: string): any[] {

    if ( tipoFiltro === '' ) {
      return arreglo;
    }

    tipoFiltro = tipoFiltro.toUpperCase();


    return arreglo.filter( item => {
      
      if(tipoFiltro === 'P'){
        return item.CNTPCK < item.CANTID;
      }

      if(tipoFiltro === 'C'){
        return item.CANTID === item.CNTPCK;
      }

    });

  }

}

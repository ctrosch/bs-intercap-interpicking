import { Pipe, PipeTransform } from '@angular/core';
import { Filtro } from '../model/filtro';

@Pipe({
  name: 'filtroPendienteSitio'
})
export class FiltroPendienteSitioPipe implements PipeTransform {

  transform(arreglo: any[], pendientes: boolean, filtro: Filtro): any[] {

    if (!arreglo || !filtro) {
      return arreglo;
    }

    // console.log(filtro);

    return arreglo.filter(item => {

      return (((pendientes && item.CNTPCK < item.CANTID) || (!pendientes && item.CNTPCK === item.CANTID)));

    });
  }

}

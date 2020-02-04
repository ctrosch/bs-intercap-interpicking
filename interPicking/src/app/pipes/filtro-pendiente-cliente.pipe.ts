import { Pipe, PipeTransform } from '@angular/core';
import { Filtro } from '../model/filtro';

@Pipe({
  name: 'filtroPendienteCliente'
})
export class FiltroPendienteClientePipe implements PipeTransform {

  transform(arreglo: any[], pendientes: boolean, filtro: Filtro): any[] {

    if (!arreglo || !filtro) {
      return arreglo;
    }

    // console.log(filtro);

    return arreglo.filter(item => {

      return (((pendientes && item.CNTPK2 < item.CANTID)
        || (!pendientes && item.CNTPK2 === item.CANTID))
        && (!filtro.CIRCOM || filtro.CIRCOM && item['CIRCOM'].includes(filtro.CIRCOM) || filtro.CIRCOM.length === 0));

    });
  }

}

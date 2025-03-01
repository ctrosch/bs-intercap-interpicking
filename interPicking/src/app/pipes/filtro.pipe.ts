import { Pipe, PipeTransform } from '@angular/core';
import { Filtro } from '../model/filtro';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], pendientes: boolean, pipeTrigger: boolean, filtro: Filtro): any[] {

    //console.log("Filtro pipe");

    if (!arreglo || !filtro) {
      return arreglo;
    }

    return arreglo.filter(item => {

      return ((pendientes && item.CNTPCK + item.CNTFST < item.CANTID) || (!pendientes && item.CNTPCK + item.CNTFST === item.CANTID) || !filtro )
        && (!filtro.CIRCOM || filtro.CIRCOM && item['CIRCOM'].includes(filtro.CIRCOM) || filtro.CIRCOM.length === 0)
        && (!filtro.SITDES || filtro.SITDES && item['SITDES'].includes(filtro.SITDES) || filtro.SITDES.length === 0)
        && (!filtro.FCHMOV || filtro.FCHMOV && item['FCHMOV'].includes(filtro.FCHMOV) || filtro.FCHMOV === null)
        && (!filtro.NOMBRE || filtro.NOMBRE && item['NOMBRE'].includes(filtro.NOMBRE) || filtro.NOMBRE.length === 0)
        && (!filtro.TRADES || filtro.TRADES && item['TRADES'].includes(filtro.TRADES) || filtro.TRADES.length === 0)
        && (!filtro.TIPDES || filtro.TIPDES && item['TIPDES'].includes(filtro.TIPDES) || filtro.TIPDES.length === 0);

    });
  }

}

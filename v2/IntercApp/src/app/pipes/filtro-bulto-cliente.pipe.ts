import { Pipe, PipeTransform } from '@angular/core';
import { Filtro } from '../model/filtro';

@Pipe({
  name: 'filtroBultoCliente'
})
export class FiltroBultoClientePipe implements PipeTransform {

  transform(arreglo: any[], pendientes: boolean): any[] {

    if (!arreglo) {
      return arreglo;
    }

    return arreglo.filter(item => {

      return ((pendientes && item.ESTADO === 'A') || (!pendientes && item.ESTADO === 'B'));

    });
  }

}

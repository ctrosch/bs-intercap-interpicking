import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPackingProducto'
})
export class FiltroPackingProductoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}

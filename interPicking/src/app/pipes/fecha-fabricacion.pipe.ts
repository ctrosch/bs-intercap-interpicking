import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFabricacion'
})
export class FechaFabricacionPipe implements PipeTransform {

  transform(value: string): string {
    return value.substring(6,9)+"/"+value.substring(4,6)+"/"+value.substring(0,4);
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.scss'],
})
export class ItemProductoComponent implements OnInit {

  @Input() item: any;
  @Input() tipo: string;

  constructor() { }

  ngOnInit() {}

}

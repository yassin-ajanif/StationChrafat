import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { StockProduct } from '../../models/stock-product.model';

@Component({
  selector: 'app-stock-product-table',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stock-product-table.component.html',
  styleUrl: './stock-product-table.component.scss',
})
export class StockProductTableComponent {
  readonly products = input.required<StockProduct[]>();
}

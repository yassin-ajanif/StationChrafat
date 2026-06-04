import { Component, input } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n'
import { StockProduct } from '../../models/stock-product.model';

@Component({
  selector: 'app-stock-product-table',
  standalone: true,
  imports: [LocaleNumberPipe, TranslatePipe],
  templateUrl: './stock-product-table.component.html',
  styleUrl: './stock-product-table.component.scss',
})
export class StockProductTableComponent {
  readonly products = input.required<StockProduct[]>();
}

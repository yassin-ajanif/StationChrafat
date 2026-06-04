import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { StockGestionSummary } from '../../models/stock-gestion-summary.model';

@Component({
  selector: 'app-stock-gestion-kpi-cards',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stock-gestion-kpi-cards.component.html',
  styleUrl: './stock-gestion-kpi-cards.component.scss',
})
export class StockGestionKpiCardsComponent {
  readonly summaries = input.required<StockGestionSummary[]>();
}

import { Component, input } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { StockGestionSummary } from '../../models/stock-gestion-summary.model';

@Component({
  selector: 'app-stock-gestion-kpi-cards',
  standalone: true,
  imports: [LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './stock-gestion-kpi-cards.component.html',
  styleUrl: './stock-gestion-kpi-cards.component.scss',
})
export class StockGestionKpiCardsComponent {
  readonly summaries = input.required<StockGestionSummary[]>();

  summaryLabelKey(accent?: string): string {
    const map: Record<string, string> = {
      carburant: 'stock.gestion.kpiCarburant',
      vidange: 'stock.gestion.kpiVidange',
      lavage: 'stock.gestion.kpiLavage',
      total: 'stock.gestion.kpiTotal',
    };
    return map[accent ?? 'total'] ?? 'stock.gestion.kpiTotal';
  }
}

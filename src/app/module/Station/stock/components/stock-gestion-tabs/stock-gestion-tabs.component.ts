import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n'
import { StockGestionTab } from '../../models/stock-gestion-tab.model';

@Component({
  selector: 'app-stock-gestion-tabs',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './stock-gestion-tabs.component.html',
  styleUrl: './stock-gestion-tabs.component.scss',
})
export class StockGestionTabsComponent {
  readonly activeTab = input.required<StockGestionTab>();
  readonly tabChange = output<StockGestionTab>();
}

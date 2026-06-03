import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CONSUMABLE_STOCK_STATUS_LABELS,
  ConsumableStockStatus,
  stockStatusClass,
} from '../../models/stock-overview';
import { VidangeActions } from '../../state/vidange.actions';
import {
  selectStockError,
  selectStockLoading,
  selectStockOverview,
} from '../../state/vidange.selectors';

@Component({
  selector: 'app-Vidange-stock-overview-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stock-overview.page.html',
  styleUrl: './stock-overview.page.scss',
})
export class StockOverviewPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectStockLoading);
  readonly loadError = this.store.selectSignal(selectStockError);
  readonly overview = this.store.selectSignal(selectStockOverview);

  readonly statusLabels = CONSUMABLE_STOCK_STATUS_LABELS;
  readonly stockStatusClass = stockStatusClass;

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadStock());
  }

  statusLabel(status: ConsumableStockStatus): string {
    return this.statusLabels[status];
  }
}

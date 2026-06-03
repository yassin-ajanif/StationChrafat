import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { NozzleIconComponent } from '../../../../../shared/components/nozzle-icon/nozzle-icon.component';
import {
  NOZZLE_STATUS_LABELS,
  NozzleLiveStatus,
  TANK_STATUS_LABELS,
  computeTankFillPercent,
  groupNozzlesByLine,
  resolveFuelSignVariant,
} from '../../models/stock-overview';
import { CarburantActions } from '../../state/carburant.actions';
import {
  selectStockError,
  selectStockLoading,
  selectStockOverview,
} from '../../state/carburant.selectors';

@Component({
  selector: 'app-stock-overview-page',
  standalone: true,
  imports: [DecimalPipe, NozzleIconComponent],
  templateUrl: './stock-overview.page.html',
  styleUrl: './stock-overview.page.scss',
})
export class StockOverviewPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectStockLoading);
  readonly loadError = this.store.selectSignal(selectStockError);
  readonly overview = this.store.selectSignal(selectStockOverview);
  readonly expandedNozzleIds = signal<Set<number>>(new Set());

  readonly canopyLines = computed(() => {
    const data = this.overview();
    return data ? groupNozzlesByLine(data.nozzles, data.lineCount) : [];
  });

  readonly canopyName = computed(() => this.overview()?.canopyName ?? '');

  readonly tanks = computed(() => this.overview()?.tanks ?? []);

  readonly nozzleStatusLabels = NOZZLE_STATUS_LABELS;
  readonly tankStatusLabels = TANK_STATUS_LABELS;
  readonly computeTankFillPercent = computeTankFillPercent;

  ngOnInit(): void {
    this.store.dispatch(CarburantActions.loadStock());
  }

  isNozzleExpanded(id: number): boolean {
    return this.expandedNozzleIds().has(id);
  }

  toggleNozzleDetails(id: number): void {
    this.expandedNozzleIds.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  nozzleStatusAccentClass(status: NozzleLiveStatus): string {
    return `stock-overview__nozzle-accent--${status.replace('_', '-')}`;
  }

  nozzleStatusTextClass(status: NozzleLiveStatus): string {
    return `stock-overview__nozzle-status--${status.replace('_', '-')}`;
  }

  fuelLabelClass(fuelLabel: string): string {
    return `stock-overview__fuel-label--${resolveFuelSignVariant(fuelLabel)}`;
  }
}

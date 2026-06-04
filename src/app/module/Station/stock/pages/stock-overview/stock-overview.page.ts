import { CurrencyPipe, DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { NozzleIconComponent } from '../../../../../shared/components/nozzle-icon/nozzle-icon.component';
import { NozzleLiveStatus, NOZZLE_STATUS_LABELS, TANK_STATUS_LABELS, computeTankFillPercent, groupNozzlesByLine, resolveFuelSignVariant, StockOverview } from '../../models/stock.model';
import { StockActions } from '../../state/stock.actions';
import { selectError, selectLoading, selectOverview } from '../../state/stock.selectors';

@Component({
  selector: 'app-stock-overview-page',
  standalone: true,
  imports: [DecimalPipe, NozzleIconComponent],
  templateUrl: './stock-overview.page.html',
  styleUrl: './stock-overview.page.scss',
})
export class StockOverviewPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectLoading);
  readonly loadError = this.store.selectSignal(selectError);
  readonly overview = this.store.selectSignal(selectOverview);
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
    this.store.dispatch(StockActions.load());
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

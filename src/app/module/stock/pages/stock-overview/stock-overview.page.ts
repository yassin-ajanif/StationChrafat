import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NozzleIconComponent } from '../../../../shared/components/nozzle-icon/nozzle-icon.component';
import { StockApi } from '../../data-access/stock.api';
import {
  NOZZLE_STATUS_LABELS,
  NozzleLiveStatus,
  StockOverview,
  TANK_STATUS_LABELS,
  computeTankFillPercent,
  groupNozzlesByLine,
  resolveFuelSignVariant,
} from '../../models/stock.model';

@Component({
  selector: 'app-stock-overview-page',
  standalone: true,
  imports: [DecimalPipe, NozzleIconComponent],
  templateUrl: './stock-overview.page.html',
  styleUrl: './stock-overview.page.scss',
})
export class StockOverviewPage implements OnInit {
  private readonly stockApi = inject(StockApi);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly overview = signal<StockOverview | null>(null);
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
    this.stockApi.getStockOverview().subscribe({
      next: (overview) => {
        this.overview.set(overview);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Impossible de charger l\'état du stock.');
        this.loading.set(false);
      },
    });
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

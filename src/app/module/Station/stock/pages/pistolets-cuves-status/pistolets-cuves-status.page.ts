import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n'
import { Store } from '@ngrx/store';
import { NozzleIconComponent } from '../../../../../shared/components/nozzle-icon/nozzle-icon.component';
import { NozzleLiveStatus, NOZZLE_STATUS_KEYS, TANK_STATUS_KEYS, computeTankFillPercent, groupNozzlesByLine, resolveFuelSignVariant, StockOverview } from '../../models/stock.model';
import { StockActions } from '../../state/stock.actions';
import { selectError, selectLoading, selectOverview } from '../../state/stock.selectors';

@Component({
  selector: 'app-pistolets-cuves-status-page',
  standalone: true,
  imports: [NozzleIconComponent, LocaleNumberPipe, TranslatePipe],
  templateUrl: './pistolets-cuves-status.page.html',
  styleUrl: './pistolets-cuves-status.page.scss',
})
export class PistoletsCuvesStatusPage implements OnInit {
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

  readonly nozzleStatusKeys = NOZZLE_STATUS_KEYS;
  readonly tankStatusKeys = TANK_STATUS_KEYS;
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
    return `pistolets-cuves-status__nozzle-accent--${status.replace('_', '-')}`;
  }

  nozzleStatusTextClass(status: NozzleLiveStatus): string {
    return `pistolets-cuves-status__nozzle-status--${status.replace('_', '-')}`;
  }

  fuelLabelClass(fuelLabel: string): string {
    return `pistolets-cuves-status__fuel-label--${resolveFuelSignVariant(fuelLabel)}`;
  }
}

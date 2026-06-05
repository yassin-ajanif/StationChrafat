import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n'
import { Store } from '@ngrx/store';
import { NozzleIconComponent } from '../../../../../shared/components/nozzle-icon/nozzle-icon.component';
import type { CanopyFuelType, NozzleLiveStatus, TankLevelStatus, FuelSignVariant, NozzleLiveState, TankLiveState, CanopyLineGroup } from '../../state/store';
import { StockActions } from '../../state/actions';
import { selectStockLoading, selectStockError, selectOverview } from '../../state/selectors';

const CANOPY_FUEL_TYPES: readonly CanopyFuelType[] = ['GASOIL', 'SANS PLOMB', 'EXCELLIUM'];

const NOZZLE_STATUS_KEYS: Record<NozzleLiveStatus, string> = {
  libre: 'stock.pistolets.nozzleLibreStatus',
  en_cours: 'stock.pistolets.nozzleEnCoursStatus',
  attente: 'stock.pistolets.nozzleAttenteStatus',
  hors_service: 'stock.pistolets.nozzleHorsServiceStatus',
};

const TANK_STATUS_KEYS: Record<TankLevelStatus, string> = {
  optimal: 'stock.pistolets.tankOptimalStatus',
  alerte: 'stock.pistolets.tankAlerteStatus',
  critique: 'stock.pistolets.tankCritiqueStatus',
};

function computeTankFillPercent(tank: TankLiveState): number {
  if (tank.maxCapacityLiters <= 0) {
    return 0;
  }
  return Math.round((tank.currentLiters / tank.maxCapacityLiters) * 100);
}

function resolveFuelSignVariant(fuelLabel: CanopyFuelType | string): FuelSignVariant {
  const normalized = fuelLabel.toUpperCase();
  if (normalized.includes('GASOIL') || normalized.includes('DIESEL')) {
    return 'diesel';
  }
  if (normalized.includes('EXCELLIUM')) {
    return 'super-plus';
  }
  if (normalized.includes('SANS PLOMB') || normalized.includes('SUPER')) {
    return 'super';
  }
  return 'default';
}

function groupNozzlesByLine(nozzles: NozzleLiveState[], lineCount = 4): CanopyLineGroup[] {
  return Array.from({ length: lineCount }, (_, index) => {
    const lineNumber = index + 1;
    const lineNozzles = nozzles.filter((nozzle) => nozzle.lineNumber === lineNumber);
    const fuelGroups = CANOPY_FUEL_TYPES.map((fuelLabel) => ({
      fuelLabel,
      signVariant: resolveFuelSignVariant(fuelLabel),
      nozzles: lineNozzles.filter((nozzle) => nozzle.fuelLabel === fuelLabel),
    }));
    const orderedNozzles = CANOPY_FUEL_TYPES.flatMap((fuelLabel) =>
      lineNozzles.filter((nozzle) => nozzle.fuelLabel === fuelLabel),
    );
    return { lineNumber, fuelGroups, nozzles: orderedNozzles };
  });
}

@Component({
  selector: 'app-pistolets-cuves-status-page',
  standalone: true,
  imports: [NozzleIconComponent, LocaleNumberPipe, TranslatePipe],
  templateUrl: './pistolets-cuves-status.page.html',
  styleUrl: './pistolets-cuves-status.page.scss',
})
export class PistoletsCuvesStatusPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectStockLoading);
  readonly loadError = this.store.selectSignal(selectStockError);
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

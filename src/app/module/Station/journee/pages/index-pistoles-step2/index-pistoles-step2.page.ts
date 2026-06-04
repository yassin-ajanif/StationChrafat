import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  NozzleBombisteGroup,
  NozzleIndexLine,
  isLineValid,
} from '../../models/nozzle-index.model';
import { paymentDifferenceLabel as formatPaymentDifference } from '../../models/payment-split.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectAvailableNozzleBombistes,
  selectCanProceedNozzleStep,
  selectDraft,
  selectNozzleBombisteGroups,
  selectNozzleIndexesError,
  selectNozzleIndexesLoading,
  selectOperatorsLoading,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-index-pistoles-step2-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './index-pistoles-step2.page.html',
  styleUrl: './index-pistoles-step2.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPistolesStep2Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly title = 'Bon de livraison carburant';
  readonly description = 'Saisissez les index pistolets et les encaissements pour la livraison / vente carburant.';
  readonly backLink = ['/journees', 'nouvelle', 'configuration-step1'];
  private readonly nextLink = ['/journees', 'nouvelle', 'bons-step3'];
  private readonly guardRedirect = ['/journees', 'nouvelle', 'configuration-step1'];

  readonly draft = this.store.selectSignal(selectDraft);
  readonly bombisteGroups = this.store.selectSignal(selectNozzleBombisteGroups);
  readonly availableBombistes = this.store.selectSignal(selectAvailableNozzleBombistes);
  readonly loading = this.store.selectSignal(selectNozzleIndexesLoading);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly loadError = this.store.selectSignal(selectNozzleIndexesError);
  readonly canProceed = this.store.selectSignal(selectCanProceedNozzleStep);

  readonly pendingBombisteId = signal<number | null>(null);

  readonly sessionTotals = computed(() => {
    const groups = this.bombisteGroups();
    return {
      liters: groups.reduce((sum, group) => sum + group.totals.liters, 0),
      amount: groups.reduce((sum, group) => sum + group.totals.amount, 0),
    };
  });

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(this.guardRedirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadOperators());
    this.store.dispatch(JourneeActions.loadNozzleIndexes());
  }

  onBombisteSelect(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.pendingBombisteId.set(raw === '' ? null : Number(raw));
  }

  addBombiste(): void {
    const bombisteId = this.pendingBombisteId();
    if (bombisteId == null) {
      return;
    }
    this.store.dispatch(JourneeActions.addNozzleBombiste({ bombisteId }));
    this.pendingBombisteId.set(null);
  }

  onRemoveBombiste(bombisteId: number): void {
    this.store.dispatch(JourneeActions.removeNozzleBombiste({ bombisteId }));
  }

  onIndexInput(lineId: number, field: 'entree' | 'sortie', event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const value = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.store.dispatch(
      JourneeActions.updateNozzleIndex({
        lineId,
        ...(field === 'entree' ? { indexEntree: value } : { indexSortie: value }),
      }),
    );
  }

  onPaymentInput(bombisteId: number, field: 'cash' | 'tpe' | 'bons', event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const value = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.store.dispatch(
      JourneeActions.updateNozzleBombistePayment({
        bombisteId,
        [field]: value,
      }),
    );
  }

  onNext(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(this.nextLink);
  }

  paymentDifferenceLabel(difference: number): string {
    return formatPaymentDifference(difference);
  }

  lineInvalid(line: NozzleIndexLine): boolean {
    return !isLineValid(line);
  }

  exportCsv(): void {
    const header = [
      'Bombiste',
      'Ilot',
      'Pistolet',
      'Carburant',
      'Index entree',
      'Index sortie',
      'Remise cuve',
      'Quantite',
      'PU',
      'Total',
    ];
    const body = this.bombisteGroups().flatMap((group) =>
      group.rows.map(({ line, quantity, total }) =>
        [
          group.bombisteName,
          line.island,
          line.pumpLabel,
          line.fuelLabel,
          line.indexEntree ?? '',
          line.indexSortie ?? '',
          line.tankReturn,
          quantity.toFixed(2),
          line.unitPrice,
          total.toFixed(2),
        ].join(';'),
      ),
    );
    const csv = [header.join(';'), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bon-livraison-carburant-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  print(): void {
    window.print();
  }
}

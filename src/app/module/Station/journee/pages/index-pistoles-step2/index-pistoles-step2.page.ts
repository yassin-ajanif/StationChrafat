import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { LocaleNumberPipe, LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  WizardStepErrorsComponent,
  type WizardStepError,
} from '../../../../../shared/components/wizard-step-errors/wizard-step-errors.component';
import {
  isPaymentSplitBalanced,
  paymentDifferenceLabel as formatPaymentDifference,
} from '../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { roundMoney } from '../../../shared/components/document-lines-table/document-lines-table.component';
import {
  type BombisteNozzlePaymentEntry,
  type NozzleBombisteGroup,
  type NozzleIndexLine,
} from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectAvailableNozzleBombistes,
  selectIndexPistolesStep2,
  selectJourneeDraftId,
  selectNozzleIndexes,
  selectNozzleIndexesError,
  selectNozzleIndexesLoading,
  selectOperators,
  selectOperatorsLoading,
  selectSelectedNozzleBombisteIds,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-index-pistoles-step2-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    WizardStepErrorsComponent,
    LocaleNumberPipe,
    LocaleCurrencyPipe,
    TranslatePipe,
  ],
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

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly indexPistolesStep2 = this.store.selectSignal(selectIndexPistolesStep2);
  readonly lines = this.store.selectSignal(selectNozzleIndexes);
  readonly selectedBombisteIds = this.store.selectSignal(selectSelectedNozzleBombisteIds);
  readonly operators = this.store.selectSignal(selectOperators);
  readonly availableBombistes = this.store.selectSignal(selectAvailableNozzleBombistes);
  readonly loading = this.store.selectSignal(selectNozzleIndexesLoading);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly loadError = this.store.selectSignal(selectNozzleIndexesError);

  readonly pendingBombisteId = signal<number | null>(null);

  readonly bombisteGroups = computed(() =>
    buildNozzleBombisteGroups(
      this.lines(),
      this.selectedBombisteIds(),
      new Map(this.operators().map((operator) => [operator.id, operator.name])),
      new Map(this.indexPistolesStep2().bombistePayments.map((entry) => [entry.bombisteId, entry])),
    ),
  );

  readonly stepIsValid = computed(() => this.stepValidationErrors().length === 0);

  readonly stepValidationErrors = computed((): WizardStepError[] => {
    const errors: WizardStepError[] = [];
    const selectedIds = this.selectedBombisteIds();
    if (selectedIds.length === 0) {
      errors.push({ key: 'journee.validation.errors.step2.noBombiste' });
      return errors;
    }

    const relevant = this.lines().filter((line) => selectedIds.includes(line.bombisteId));
    if (relevant.length === 0) {
      errors.push({ key: 'journee.validation.errors.step2.noNozzleLines' });
    }

    const operatorNames = new Map(this.operators().map((operator) => [operator.id, operator.name]));
    for (const line of relevant) {
      if (!isNozzleIndexLineValid(line)) {
        errors.push({
          key: 'journee.validation.errors.step2.invalidIndex',
          params: {
            bombiste: operatorNames.get(line.bombisteId) ?? '',
            pump: line.pumpLabel,
            fuel: line.fuelLabel,
          },
        });
      }
    }

    for (const group of this.bombisteGroups()) {
      if (!isPaymentSplitBalanced(group.payments, group.totals.amount)) {
        errors.push({
          key: 'journee.validation.errors.step2.unbalancedPayment',
          params: { name: group.bombisteName },
        });
      }
    }

    return errors;
  });

  readonly sessionTotals = computed(() => {
    const groups = this.bombisteGroups();
    return {
      liters: groups.reduce((sum, group) => sum + group.totals.liters, 0),
      amount: groups.reduce((sum, group) => sum + group.totals.amount, 0),
    };
  });

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchIndexPistolesStep2({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    if (this.journeeId() == null) {
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
    void this.router.navigate(this.nextLink);
  }

  paymentDifferenceLabel(difference: number): string {
    return formatPaymentDifference(difference);
  }

  lineInvalid(line: NozzleIndexLine): boolean {
    if (line.status === 'offline') {
      return false;
    }
    return !isNozzleIndexLineValid(line);
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

function isNozzleIndexLineValid(line: NozzleIndexLine): boolean {
  if (line.status === 'offline') {
    return true;
  }
  if (line.indexEntree == null || line.indexSortie == null) {
    return false;
  }
  return line.indexEntree >= line.indexSortie;
}

function nozzleLineQuantity(line: NozzleIndexLine): number {
  if (line.status === 'offline') {
    return 0;
  }
  if (line.indexEntree == null || line.indexSortie == null) {
    return 0;
  }
  return Math.max(0, line.indexEntree - line.indexSortie - line.tankReturn);
}

function buildNozzleBombisteGroups(
  lines: NozzleIndexLine[],
  selectedBombisteIds: number[],
  operatorNames: Map<number, string>,
  paymentsByBombiste: Map<number, BombisteNozzlePaymentEntry>,
): NozzleBombisteGroup[] {
  return selectedBombisteIds.map((bombisteId) => {
    const bombisteLines = lines.filter((line) => line.bombisteId === bombisteId);
    const rows = bombisteLines.map((line) => {
      const quantity = nozzleLineQuantity(line);
      return { line, quantity, total: roundMoney(quantity * line.unitPrice) };
    });
    const totals = {
      liters: roundMoney(rows.reduce((sum, row) => sum + row.quantity, 0)),
      amount: roundMoney(rows.reduce((sum, row) => sum + row.total, 0)),
    };
    const payments = paymentsByBombiste.get(bombisteId) ?? {
      bombisteId,
      cash: 0,
      tpe: 0,
      bons: 0,
    };
    const paymentTotal = roundMoney(
      (payments.cash ?? 0) + (payments.tpe ?? 0) + (payments.bons ?? 0),
    );
    return {
      bombisteId,
      bombisteName: operatorNames.get(bombisteId) ?? '',
      rows,
      totals,
      payments,
      paymentTotal,
      paymentDifference: roundMoney(totals.amount - paymentTotal),
    };
  });
}

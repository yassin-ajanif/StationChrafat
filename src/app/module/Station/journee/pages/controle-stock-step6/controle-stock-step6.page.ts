import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { LocaleCurrencyPipe, LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { roundMoney } from '../../../shared/components/document-lines-table/document-lines-table.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  WizardStepErrorsComponent,
  type WizardStepError,
} from '../../../../../shared/components/wizard-step-errors/wizard-step-errors.component';
import { type StockControlLine } from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectJourneeDraftId,
  selectStockControlLines,
  selectStockControlLoading,
  selectStockControlError,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-controle-stock-step6-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    WizardStepErrorsComponent,
    LocaleNumberPipe,
    LocaleCurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './controle-stock-step6.page.html',
  styleUrl: './controle-stock-step6.page.scss',
})
export class ControleStockStep6Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly lines = this.store.selectSignal(selectStockControlLines);
  readonly loading = this.store.selectSignal(selectStockControlLoading);
  readonly loadError = this.store.selectSignal(selectStockControlError);

  readonly rows = computed(() =>
    this.lines().map((line) => ({
      line,
      gap: stockGap(line),
      lossValue: stockLossValue(line),
    })),
  );

  readonly totalLoss = computed(() =>
    roundMoney(this.rows().reduce((sum, row) => sum + row.lossValue, 0)),
  );

  readonly mismatchCount = computed(
    () => this.rows().filter((row) => row.line.measuredStock != null && row.gap !== 0).length,
  );

  readonly stepIsValid = computed(() => this.stepValidationErrors().length === 0);

  readonly stepValidationErrors = computed((): WizardStepError[] => {
    const errors: WizardStepError[] = [];
    const incomplete = this.lines().filter((line) => line.measuredStock == null);
    if (incomplete.length > 0) {
      errors.push({
        key: 'journee.validation.errors.step6.incompleteMeasurements',
        params: { count: incomplete.length },
      });
    }
    return errors;
  });

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchStockControlStep6({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    if (this.journeeId() == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadStockControl());
  }

  onMeasuredInput(lineId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const measuredStock = raw === '' ? null : Number(raw);
    this.store.dispatch(
      JourneeActions.updateStockControlMeasured({
        lineId,
        measuredStock: measuredStock != null && Number.isNaN(measuredStock) ? null : measuredStock,
      }),
    );
  }

  next(): void {
    void this.router.navigate(['/journees', 'nouvelle', 'validation-step7']);
  }
}

function stockGap(line: StockControlLine): number {
  if (line.measuredStock == null) {
    return 0;
  }
  return roundMoney(line.measuredStock - line.theoreticalStock);
}

function stockLossValue(line: StockControlLine): number {
  if (line.measuredStock == null) {
    return 0;
  }
  const shortage = Math.max(0, line.theoreticalStock - line.measuredStock);
  return roundMoney(shortage * line.unitPriceDh);
}

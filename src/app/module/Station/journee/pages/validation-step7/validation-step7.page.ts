import { Component, OnInit, computed, inject } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  computeDocumentLinesTotalTTC,
  roundMoney,
} from '../../../shared/components/document-lines-table/document-lines-table.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  ENCAISSEMENT_DIVERS_CLIENT_ID,
  type BonsStep3Livraison,
  type EncaissementLine,
  type JourneeDraft,
  type Operator,
  type PaymentMode,
  type StockControlLine,
} from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanSubmitJournee,
  selectDraft,
  selectInvalidWizardSteps,
  selectJourneeDraftId,
  selectOperators,
  selectSubmitJourneeError,
  selectSubmittingJournee,
} from '../../state/journee.selectors';

interface ValidationEncaissementRow {
  paymentTypeKey: string;
  referenceKey?: string;
  referenceParams?: Record<string, string | number>;
  referenceText?: string;
  amount: number;
}

interface ValidationSummary {
  revenue: {
    fuel: number;
    products: number;
    services: number;
    grossTotal: number;
  };
  cashMovements: {
    nonCashEncaissements: number;
    authorizedExpenses: number;
    debtSettlements: number;
    cardRecharges: number;
    stockLoss: number;
  };
  netRemittance: number;
  chefName: string;
  encaissementDetails: ValidationEncaissementRow[];
}

const PAYMENT_TYPE_KEYS: Record<PaymentMode, string> = {
  CMI: 'journee.validation.paymentTypes.cmi',
  TAQ: 'journee.validation.paymentTypes.taq',
  BON: 'journee.validation.paymentTypes.bon',
};

@Component({
  selector: 'app-validation-step7-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, TranslatePipe, LocaleCurrencyPipe],
  templateUrl: './validation-step7.page.html',
  styleUrl: './validation-step7.page.scss',
})
export class ValidationStep7Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly canSubmit = this.store.selectSignal(selectCanSubmitJournee);
  readonly invalidSteps = this.store.selectSignal(selectInvalidWizardSteps);
  readonly submitting = this.store.selectSignal(selectSubmittingJournee);
  readonly submitError = this.store.selectSignal(selectSubmitJourneeError);
  readonly draft = this.store.selectSignal(selectDraft);
  readonly operators = this.store.selectSignal(selectOperators);

  readonly summary = computed(() => buildValidationSummary(this.draft(), this.operators()));

  ngOnInit(): void {
    if (this.journeeId() == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.store.dispatch(JourneeActions.submitJournee());
  }
}

function buildValidationSummary(draft: JourneeDraft, operators: Operator[]): ValidationSummary {
  const fuel = roundMoney(
    draft.bonsStep3.items
      .filter((item) => item.fuelTransmittedFromNozzles)
      .reduce((sum, item) => sum + getBonTotal(item), 0),
  );

  const manualBons = draft.bonsStep3.items.filter((item) => !item.fuelTransmittedFromNozzles);
  const products = roundMoney(
    manualBons.reduce((sum, item) => sum + getBonProductsAmount(item), 0),
  );
  const services = roundMoney(
    manualBons.reduce((sum, item) => sum + getBonServicesAmount(item), 0),
  );
  const grossTotal = roundMoney(fuel + products + services);

  const filledEncaissements = draft.encaissementsStep4.lines.filter(isEncaissementLineFilled);
  const nonCashEncaissements = roundMoney(
    filledEncaissements.reduce((sum, line) => sum + line.amount, 0),
  );

  const authorizedExpenses = roundMoney(
    draft.depensesStep6.lines
      .filter(isDepenseLineFilled)
      .filter((line) => line.paymentMode === 'Espèces (Caisse)')
      .reduce((sum, line) => sum + line.amount, 0),
  );

  const debtSettlements = roundMoney(
    filledEncaissements
      .filter(
        (line) =>
          line.clientId != null && line.clientId !== ENCAISSEMENT_DIVERS_CLIENT_ID,
      )
      .reduce((sum, line) => sum + line.amount, 0),
  );

  const cardRecharges = roundMoney(
    filledEncaissements
      .filter(
        (line) =>
          line.clientId === ENCAISSEMENT_DIVERS_CLIENT_ID && line.paymentMode === 'TAQ',
      )
      .reduce((sum, line) => sum + line.amount, 0),
  );

  const stockLoss = roundMoney(
    draft.stockControlStep6.lines.reduce((sum, line) => sum + stockControlLossValue(line), 0),
  );

  const netRemittance = roundMoney(
    grossTotal -
      nonCashEncaissements -
      authorizedExpenses -
      stockLoss +
      debtSettlements +
      cardRecharges,
  );

  const chefId = draft.configurationStep1.chefDePisteId;
  const chefName =
    chefId == null ? '' : (operators.find((operator) => operator.id === chefId)?.name ?? '');

  return {
    revenue: { fuel, products, services, grossTotal },
    cashMovements: {
      nonCashEncaissements,
      authorizedExpenses,
      debtSettlements,
      cardRecharges,
      stockLoss,
    },
    netRemittance,
    chefName,
    encaissementDetails: buildEncaissementDetailRows(filledEncaissements),
  };
}

function buildEncaissementDetailRows(lines: EncaissementLine[]): ValidationEncaissementRow[] {
  const groups = new Map<PaymentMode, EncaissementLine[]>();

  for (const line of lines) {
    if (line.paymentMode === '') {
      continue;
    }
    const bucket = groups.get(line.paymentMode) ?? [];
    bucket.push(line);
    groups.set(line.paymentMode, bucket);
  }

  return (['CMI', 'TAQ', 'BON'] as const)
    .filter((mode) => groups.has(mode))
    .map((mode) => {
      const groupLines = groups.get(mode)!;
      const amount = roundMoney(groupLines.reduce((sum, line) => sum + line.amount, 0));
      return {
        paymentTypeKey: PAYMENT_TYPE_KEYS[mode],
        ...buildEncaissementReference(mode, groupLines),
        amount,
      };
    });
}

function buildEncaissementReference(
  mode: PaymentMode,
  lines: EncaissementLine[],
): Pick<ValidationEncaissementRow, 'referenceKey' | 'referenceParams' | 'referenceText'> {
  const notes = lines.map((line) => line.note.trim()).filter(Boolean);
  if (notes.length > 0) {
    return { referenceText: notes.join(' / ') };
  }
  if (mode === 'BON') {
    return {
      referenceKey: 'journee.validation.lineCount',
      referenceParams: { count: lines.length },
    };
  }
  return {
    referenceKey: 'journee.validation.transactionCount',
    referenceParams: { count: lines.length },
  };
}

function getBonServicesAmount(item: BonsStep3Livraison): number {
  return roundMoney(computeDocumentLinesTotalTTC(item.livraison.serviceLines));
}

function getBonProductsAmount(item: BonsStep3Livraison): number {
  return roundMoney(computeDocumentLinesTotalTTC(item.livraison.productLines));
}

function getBonTotal(item: BonsStep3Livraison): number {
  return roundMoney(getBonServicesAmount(item) + getBonProductsAmount(item));
}

function isEncaissementLineFilled(line: EncaissementLine): boolean {
  return line.clientId != null && line.paymentMode !== '' && line.amount > 0;
}

function isDepenseLineFilled(line: {
  expenseType: string;
  amount: number;
  paymentMode: string;
}): boolean {
  return line.expenseType !== '' && line.amount > 0 && line.paymentMode !== '';
}

function stockControlLossValue(line: StockControlLine): number {
  if (line.measuredStock == null) {
    return 0;
  }
  const shortage = Math.max(0, line.theoreticalStock - line.measuredStock);
  return roundMoney(shortage * line.unitPriceDh);
}

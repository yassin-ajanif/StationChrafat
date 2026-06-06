import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  computeDocumentLinesTotalTTC,
  roundMoney,
} from '../../../shared/components/document-lines-table/document-lines-table.component';
import {
  emptyPaymentSplit,
  isPaymentSplitBalanced,
} from '../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { LivraisonFormDialogComponent } from '../../../shared/components/dialogs/livraison-form-dialog/livraison-form-dialog.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeActions } from '../../state/journee.actions';
import {
  JOURNEE_BON_CONFIG,
  type BonsStep3Livraison,
  type BonsStep3LivraisonFormEdit,
  type BonsStep3LivraisonFormSave,
  type BonsStep3LivraisonSave,
  type IndexPistolesStep2,
  type NozzleIndexLine,
  type Operator,
} from '../../state/journee.store';
import {
  selectConfigurationStep1,
  selectFilteredStationBons,
  selectIndexPistolesStep2,
  selectJourneeDraftId,
  selectOperators,
  selectOperatorsLoading,
  selectStationBons,
  selectStationBonsChefId,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-bons-step3-page',
  standalone: true,
  imports: [ButtonComponent, LivraisonFormDialogComponent, RouterLink, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './bons-step3.page.html',
  styleUrl: './bons-step3.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonsStep3Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_CONFIG;

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly configurationStep1 = this.store.selectSignal(selectConfigurationStep1);
  readonly step2 = this.store.selectSignal(selectIndexPistolesStep2);
  readonly allBons = this.store.selectSignal(selectStationBons);
  readonly bons = this.store.selectSignal(selectFilteredStationBons);
  readonly selectedChefId = this.store.selectSignal(selectStationBonsChefId);
  readonly filteredTotal = computed(() => getStationBonsTotal(this.bons()));
  readonly operators = this.store.selectSignal(selectOperators);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);

  readonly stepIsValid = computed(() => {
    const items = this.allBons();
    if (items.length === 0) {
      return false;
    }
    const manualBons = items.filter((item) => !item.fuelTransmittedFromNozzles);
    if (manualBons.length > 0 && this.selectedChefId() == null) {
      return false;
    }
    return items.every(isBonsStep3LivraisonValid);
  });

  readonly dialogOpen = signal(false);
  readonly editingBonId = signal<number | null>(null);

  readonly editingBon = computed(() => {
    const id = this.editingBonId();
    if (id == null) {
      return null;
    }
    return this.allBons().find((item) => item.livraison.id === id) ?? null;
  });

  readonly editingBonValue = computed(() => {
    const item = this.editingBon();
    return item ? livraisonToFormEditValue(item) : null;
  });

  readonly defaultOperatorId = computed(() => {
    const item = this.editingBon();
    return item ? item.operatorId : null;
  });

  readonly suggestedBonNumber = computed(() =>
    suggestNextLivraisonNumber(this.allBons(), 'LAV', 8800),
  );

  getBonTotal = getBonTotal;
  getBonServicesAmount = getBonServicesAmount;
  getBonProductsAmount = getBonProductsAmount;

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchBonsStep3({ patch: { isValid: this.stepIsValid() } }),
      );
    });

    effect(() => {
      const step2 = this.step2();
      const operators = this.operators();
      const currentItems = this.allBons();
      if (operators.length === 0 || step2.selectedBombisteIds.length === 0) {
        return;
      }

      const dateLivraison = this.configurationStep1().openedAt.split('T')[0];
      const mergedItems = buildFuelLivraisonsFromStep2(
        step2,
        operators,
        currentItems,
        dateLivraison,
      );

      if (!sameBonsStep3Items(currentItems, mergedItems)) {
        this.store.dispatch(JourneeActions.patchBonsStep3({ patch: { items: mergedItems } }));
      }
    });
  }

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.journeeId() == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadOperators());
  }

  operatorName(operatorId: number): string {
    return this.operators().find((op) => op.id === operatorId)?.name ?? '';
  }

  onChefChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.dispatch(
      JourneeActions.setStationBonsChefId({ chefVidangeLavageId: value ? Number(value) : null }),
    );
  }

  openNewBonDialog(): void {
    this.editingBonId.set(null);
    this.dialogOpen.set(true);
  }

  openEditBonDialog(id: number): void {
    this.editingBonId.set(id);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingBonId.set(null);
  }

  onBonSaved(formSave: BonsStep3LivraisonFormSave): void {
    const chefVidangeLavageId = this.selectedChefId();
    if (chefVidangeLavageId == null) {
      return;
    }
    const save = formSaveToInput(formSave, chefVidangeLavageId);
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateLivraison({ id, livraison: save }));
    } else {
      this.store.dispatch(JourneeActions.addLivraison({ livraison: save }));
    }
    this.closeDialog();
  }

  removeBon(id: number): void {
    this.store.dispatch(JourneeActions.removeLivraison({ id }));
  }

  onNext(): void {
    void this.router.navigate(this.config.nextLink);
  }
}

const FUEL_BON_PREFIX = 'CAR';
const FUEL_VAT_PERCENT = 10;

function nozzleQuantity(line: NozzleIndexLine): number {
  if (line.indexEntree == null || line.indexSortie == null) {
    return 0;
  }
  return Math.max(0, line.indexEntree - line.indexSortie - line.tankReturn);
}

function unitPriceTtcToHt(ttc: number): number {
  return roundMoney(ttc / (1 + FUEL_VAT_PERCENT / 100));
}

function buildFuelLivraisonsFromStep2(
  step2: IndexPistolesStep2,
  operators: Operator[],
  currentItems: BonsStep3Livraison[],
  dateLivraison: string,
): BonsStep3Livraison[] {
  const manualItems = currentItems.filter((item) => !item.fuelTransmittedFromNozzles);
  const existingFuelByOperator = new Map(
    currentItems
      .filter((item) => item.fuelTransmittedFromNozzles)
      .map((item) => [item.operatorId, item]),
  );

  const operatorNames = new Map(operators.map((op) => [op.id, op.name]));
  const paymentsByBombiste = new Map(step2.bombistePayments.map((entry) => [entry.bombisteId, entry]));

  let nextId = currentItems.reduce((max, item) => Math.max(max, item.livraison.id), 0);
  let nextLineId =
    currentItems.reduce(
      (max, item) =>
        Math.max(
          max,
          ...item.livraison.serviceLines.map((line) => line.id),
          ...item.livraison.productLines.map((line) => line.id),
          0,
        ),
      0,
    ) + 1;

  const reservedNumeros = new Set(currentItems.map((item) => item.livraison.numero));
  const fuelItems: BonsStep3Livraison[] = [];

  for (const bombisteId of step2.selectedBombisteIds) {
    const nozzleLines = step2.lines.filter(
      (line) => line.bombisteId === bombisteId && nozzleQuantity(line) > 0,
    );
    if (nozzleLines.length === 0) {
      continue;
    }

    const fuels = new Map<
      string,
      { fuelCode: string; fuelLabel: string; quantity: number; unitPriceTtc: number }
    >();

    for (const line of nozzleLines) {
      const quantity = nozzleQuantity(line);
      const existing = fuels.get(line.fuelCode);
      if (existing) {
        existing.quantity = roundMoney(existing.quantity + quantity);
      } else {
        fuels.set(line.fuelCode, {
          fuelCode: line.fuelCode,
          fuelLabel: line.fuelLabel,
          quantity,
          unitPriceTtc: line.unitPrice,
        });
      }
    }

    const previous = existingFuelByOperator.get(bombisteId);
    let numero = previous?.livraison.numero ?? '';
    if (!numero) {
      do {
        numero = suggestNextFuelNumero([...currentItems, ...fuelItems]);
      } while (reservedNumeros.has(numero));
      reservedNumeros.add(numero);
    }

    const productLines = [...fuels.values()].map((fuel, index) => ({
      id: previous?.livraison.productLines[index]?.id ?? nextLineId++,
      reference: fuel.fuelCode,
      designation: fuel.fuelLabel,
      quantity: fuel.quantity,
      unit: 'L',
      unitPriceHT: unitPriceTtcToHt(fuel.unitPriceTtc),
      discountPercent: 0,
      vatPercent: FUEL_VAT_PERCENT,
    }));

    const payments = paymentsByBombiste.get(bombisteId) ?? emptyPaymentSplit();
    const montant = roundMoney(computeDocumentLinesTotalTTC(productLines));

    fuelItems.push({
      operatorId: bombisteId,
      chefVidangeLavageId: previous?.chefVidangeLavageId ?? 0,
      fuelTransmittedFromNozzles: true,
      livraison: {
        id: previous?.livraison.id ?? ++nextId,
        numero,
        client: operatorNames.get(bombisteId) ?? '',
        dateLivraison,
        statut: previous?.livraison.statut ?? 'planifiee',
        adresse: previous?.livraison.adresse ?? '',
        description: previous?.livraison.description ?? '',
        montant,
        serviceLines: [],
        productLines,
        payments: {
          cash: payments.cash ?? 0,
          tpe: payments.tpe ?? 0,
          bons: payments.bons ?? 0,
        },
      },
    });
  }

  return [...manualItems, ...fuelItems];
}

function suggestNextFuelNumero(existing: BonsStep3Livraison[], fallback = 8800): string {
  const max = existing.reduce((acc, item) => {
    const match = item.livraison.numero.match(new RegExp(`${FUEL_BON_PREFIX}-(\\d+)`, 'i'));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, fallback);
  return `${FUEL_BON_PREFIX}-${max + 1}`;
}

function sameBonsStep3Items(a: BonsStep3Livraison[], b: BonsStep3Livraison[]): boolean {
  const snapshot = (items: BonsStep3Livraison[]) =>
    items
      .map((item) => ({
        operatorId: item.operatorId,
        fuel: !!item.fuelTransmittedFromNozzles,
        numero: item.livraison.numero,
        montant: item.livraison.montant,
        productCount: item.livraison.productLines.length,
      }))
      .sort((left, right) => left.operatorId - right.operatorId);

  return JSON.stringify(snapshot(a)) === JSON.stringify(snapshot(b));
}

function isBonsStep3LivraisonValid(item: BonsStep3Livraison): boolean {
  const total = getBonTotal(item);
  return isPaymentSplitBalanced(item.livraison.payments ?? emptyPaymentSplit(), total);
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

function getStationBonsTotal(items: BonsStep3Livraison[]): number {
  return items.reduce((sum, item) => sum + getBonTotal(item), 0);
}

function suggestNextLivraisonNumber(
  existing: BonsStep3Livraison[],
  prefix: string,
  fallback: number,
): string {
  const max = existing.reduce((acc, item) => {
    const match = item.livraison.numero.match(new RegExp(`${prefix}-(\\d+)`, 'i'));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, fallback);
  return `${prefix}-${max + 1}`;
}

function livraisonToFormEditValue(item: BonsStep3Livraison): BonsStep3LivraisonFormEdit {
  return {
    numero: item.livraison.numero,
    operatorId: item.operatorId,
    livraison: {
      client: item.livraison.client,
      dateLivraison: item.livraison.dateLivraison,
      statut: item.livraison.statut,
      adresse: item.livraison.adresse,
      description: item.livraison.description,
      serviceLines: item.livraison.serviceLines,
      productLines: item.livraison.productLines,
      payments: item.livraison.payments,
    },
  };
}

function formSaveToInput(
  formSave: BonsStep3LivraisonFormSave,
  chefVidangeLavageId: number,
): BonsStep3LivraisonSave {
  return {
    numero: formSave.numero.trim(),
    operatorId: formSave.operatorId,
    chefVidangeLavageId,
    livraison: formSave.livraison,
  };
}

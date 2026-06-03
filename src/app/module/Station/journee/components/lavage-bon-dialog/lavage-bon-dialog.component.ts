import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  LavageBonDraftInput,
  LAVAGE_CONSUMABLE_PRODUCTS,
  LAVAGE_WASH_TYPES,
  LavageBon,
  buildLavageBonDraft,
  computeDraftBonTotal,
  computePaymentDifference,
  computePaymentTotal,
  emptyPaymentSplit,
  filledProductRows,
  filledServiceRows,
  isLavageBonTablesValid,
  paymentDifferenceLabel,
  productTableAmountTotal,
  productTableQtyTotal,
  serviceTableTotal,
} from '../../models/lavage-bon.model';
import { PaymentSplit, isPaymentSplitBalanced } from '../../models/payment-split.model';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

interface ServiceTableRow {
  id: number;
  washType: string;
  amount: number | null;
}

interface ProductTableRow {
  id: number;
  productName: string;
  quantity: number | null;
  unitPrice: number | null;
}

@Component({
  selector: 'app-lavage-bon-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe],
  templateUrl: './lavage-bon-dialog.component.html',
  styleUrl: './lavage-bon-dialog.component.scss',
})
export class LavageBonDialogComponent {
  readonly open = input(false);
  readonly suggestedBonNumber = input('');
  readonly editBon = input<LavageBon | null>(null);
  readonly defaultChefVidangeLavageId = input<number | null>(null);

  readonly saved = output<LavageBonDraftInput>();
  readonly closed = output<void>();

  readonly washTypes = LAVAGE_WASH_TYPES;
  readonly consumableProducts = LAVAGE_CONSUMABLE_PRODUCTS;

  readonly isEditMode = computed(() => this.editBon() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly clientRef = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<ServiceTableRow[]>([]);
  readonly productRows = signal<ProductTableRow[]>([]);

  readonly filledServiceCount = computed(() => filledServiceRows(this.serviceRows()).length);

  readonly filledProductCount = computed(() => filledProductRows(this.productRows()).length);

  readonly serviceTotal = computed(() => serviceTableTotal(this.serviceRows()));

  readonly productQtyTotal = computed(() => productTableQtyTotal(this.productRows()));

  readonly productAmountTotal = computed(() => productTableAmountTotal(this.productRows()));

  readonly bonTotal = computed(() =>
    computeDraftBonTotal(this.serviceRows(), this.productRows()),
  );

  readonly paymentTotal = computed(() => computePaymentTotal(this.payments()));

  readonly paymentDifference = computed(() =>
    computePaymentDifference(this.payments(), this.bonTotal()),
  );

  readonly paymentDifferenceLabel = paymentDifferenceLabel;

  readonly canSave = computed(() => {
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return false;
    }
    return (
      isLavageBonTablesValid({
        bonNumber: this.bonNumber(),
        chefVidangeLavageId,
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.bonTotal())
    );
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editBon();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm(this.suggestedBonNumber());
      }
    });
  }

  private loadEditForm(bon: LavageBon): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(bon.bonNumber);
    this.clientRef.set(bon.clientRef);
    this.payments.set({ ...(bon.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      bon.lines.length > 0
        ? bon.lines.map((line) => ({
            id: ++this.serviceSeq,
            washType: line.washType,
            amount: line.amount,
          }))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      bon.consumedProducts.length > 0
        ? bon.consumedProducts.map((product) => ({
            id: ++this.productSeq,
            productName: product.productName,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
          }))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(suggestedNumber: string): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(suggestedNumber);
    this.clientRef.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): ServiceTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): ProductTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): ServiceTableRow {
    return { id: ++this.serviceSeq, washType: '', amount: null };
  }

  private createEmptyProductRow(): ProductTableRow {
    return {
      id: ++this.productSeq,
      productName: '',
      quantity: null,
      unitPrice: null,
    };
  }

  updateServiceWashType(rowId: number, event: Event): void {
    const washType = (event.target as HTMLSelectElement).value;
    this.patchServiceRow(rowId, { washType });
  }

  updateServiceAmount(rowId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const amount = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.patchServiceRow(rowId, { amount });
  }

  updateProductName(rowId: number, event: Event): void {
    const productName = (event.target as HTMLSelectElement).value;
    this.patchProductRow(rowId, { productName });
  }

  updateProductQty(rowId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const quantity = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.patchProductRow(rowId, { quantity });
  }

  updateProductUnitPrice(rowId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const unitPrice = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.patchProductRow(rowId, { unitPrice });
  }

  onPaymentInput(field: keyof PaymentSplit, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const value = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.payments.update((current) => ({ ...current, [field]: value }));
  }

  private patchServiceRow(rowId: number, patch: Partial<ServiceTableRow>): void {
    this.serviceRows.update((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }

  private patchProductRow(rowId: number, patch: Partial<ProductTableRow>): void {
    this.productRows.update((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }

  addServiceRow(): void {
    this.serviceRows.update((rows) => [...rows, this.createEmptyServiceRow()]);
  }

  addProductRow(): void {
    this.productRows.update((rows) => [...rows, this.createEmptyProductRow()]);
  }

  clearServiceRow(rowId: number): void {
    this.patchServiceRow(rowId, { washType: '', amount: null });
  }

  clearProductRow(rowId: number): void {
    this.patchProductRow(rowId, {
      productName: '',
      quantity: null,
      unitPrice: null,
    });
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }
    const draft = buildLavageBonDraft(this.serviceRows(), this.productRows());
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return;
    }
    this.saved.emit({
      bonNumber: this.bonNumber(),
      clientRef: this.clientRef(),
      chefVidangeLavageId,
      lines: draft.lines,
      consumedProducts: draft.consumedProducts,
      payments: this.payments(),
    });
  }

  cancel(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }
}

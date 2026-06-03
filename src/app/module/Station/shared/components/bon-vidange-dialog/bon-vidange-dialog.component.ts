import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../components/document-lines-table/document-lines-table.component';
import {
  VidangeBon,
  VidangeBonDraftInput,
  VidangeBonLineTableRow,
  buildVidangeBonDraft,
  computeDraftBonTotal,
  computeDraftProductsTotal,
  computeDraftServicesTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isVidangeBonLinesValid,
} from '../../models/bon-vidange';
import { PaymentSplit, isPaymentSplitBalanced } from '../../models/common/payment-split.model';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-bon-vidange-dialog',
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './bon-vidange-dialog.component.html',
  styleUrl: './bon-vidange-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonVidangeDialogComponent {
  readonly open = input(false);
  readonly suggestedBonNumber = input('');
  readonly editBon = input<VidangeBon | null>(null);
  readonly defaultChefVidangeLavageId = input<number | null>(null);

  readonly saved = output<VidangeBonDraftInput>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editBon() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly vehicleRef = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<VidangeBonLineTableRow[]>([]);
  readonly productRows = signal<VidangeBonLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDraftServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftProductsTotal(this.productRows()));
  readonly bonTotal = computed(() =>
    computeDraftBonTotal(this.serviceRows(), this.productRows()),
  );

  readonly canSave = computed(() => {
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return false;
    }
    return (
      isVidangeBonLinesValid({
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

  private loadEditForm(bon: VidangeBon): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(bon.bonNumber);
    this.vehicleRef.set(bon.vehicleRef);
    this.payments.set({ ...(bon.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      bon.serviceLines.length > 0
        ? bon.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      bon.productLines.length > 0
        ? bon.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(suggestedNumber: string): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(suggestedNumber);
    this.vehicleRef.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): VidangeBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): VidangeBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): VidangeBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): VidangeBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof VidangeBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof VidangeBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof VidangeBonLineTableRow; value: string | number | null },
  ): void {
    rowsSignal.update((rows) =>
      rows.map((row) => (row.rowId === event.rowId ? { ...row, [event.field]: event.value } : row)),
    );
  }

  addServiceRow(): void {
    this.serviceRows.update((rows) => [...rows, this.createEmptyServiceRow()]);
  }

  addProductRow(): void {
    this.productRows.update((rows) => [...rows, this.createEmptyProductRow()]);
  }

  clearServiceRow(rowId: number): void {
    this.serviceRows.update((rows) =>
      rows.map((row) =>
        row.rowId === rowId ? { ...this.createEmptyServiceRow(), rowId: row.rowId } : row,
      ),
    );
  }

  clearProductRow(rowId: number): void {
    this.productRows.update((rows) =>
      rows.map((row) =>
        row.rowId === rowId ? { ...this.createEmptyProductRow(), rowId: row.rowId } : row,
      ),
    );
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }
    const draft = buildVidangeBonDraft(this.serviceRows(), this.productRows());
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return;
    }
    this.saved.emit({
      bonNumber: this.bonNumber(),
      vehicleRef: this.vehicleRef(),
      chefVidangeLavageId,
      serviceLines: draft.serviceLines,
      productLines: draft.productLines,
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

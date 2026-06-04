import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../components/document-lines-table/document-lines-table.component';
import {
  StationBon,
  StationBonDraftInput,
  StationBonLineTableRow,
  buildStationBonDraft,
  computeDraftBonTotal,
  computeDraftProductsTotal,
  computeDraftServicesTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isStationBonLinesValid,
} from '../../models/bon';
import { PaymentSplit, isPaymentSplitBalanced } from '../../models/common/payment-split.model';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-bon-dialog',
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './bon-dialog.component.html',
  styleUrl: './bon-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonDialogComponent {
  readonly open = input(false);
  readonly suggestedBonNumber = input('');
  readonly editBon = input<StationBon | null>(null);
  readonly defaultChefVidangeLavageId = input<number | null>(null);

  readonly saved = output<StationBonDraftInput>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editBon() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly partnerRef = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<StationBonLineTableRow[]>([]);
  readonly productRows = signal<StationBonLineTableRow[]>([]);

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
      isStationBonLinesValid({
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

  private loadEditForm(bon: StationBon): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(bon.bonNumber);
    this.partnerRef.set(bon.partnerRef);
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
    this.partnerRef.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): StationBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): StationBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): StationBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): StationBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof StationBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof StationBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof StationBonLineTableRow; value: string | number | null },
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
    const draft = buildStationBonDraft(this.serviceRows(), this.productRows());
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return;
    }
    this.saved.emit({
      bonNumber: this.bonNumber(),
      partnerRef: this.partnerRef(),
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

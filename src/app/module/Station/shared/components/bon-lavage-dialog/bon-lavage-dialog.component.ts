import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../components/document-lines-table/document-lines-table.component';
import {
  LavageBon,
  LavageBonDraftInput,
  LavageBonLineTableRow,
  buildLavageBonDraft,
  computeDraftBonTotal,
  computeDraftProductsTotal,
  computeDraftServicesTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isLavageBonLinesValid,
} from '../../models/bon-lavage';
import { PaymentSplit, isPaymentSplitBalanced } from '../../models/common/payment-split.model';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-bon-lavage-dialog',
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './bon-lavage-dialog.component.html',
  styleUrl: './bon-lavage-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonLavageDialogComponent {
  readonly open = input(false);
  readonly suggestedBonNumber = input('');
  readonly editBon = input<LavageBon | null>(null);
  readonly defaultChefVidangeLavageId = input<number | null>(null);

  readonly saved = output<LavageBonDraftInput>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editBon() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly clientRef = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<LavageBonLineTableRow[]>([]);
  readonly productRows = signal<LavageBonLineTableRow[]>([]);

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
      isLavageBonLinesValid({
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
    this.clientRef.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): LavageBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): LavageBonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): LavageBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): LavageBonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof LavageBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof LavageBonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof LavageBonLineTableRow; value: string | number | null },
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
    const draft = buildLavageBonDraft(this.serviceRows(), this.productRows());
    const chefVidangeLavageId = this.defaultChefVidangeLavageId();
    if (chefVidangeLavageId == null) {
      return;
    }
    this.saved.emit({
      bonNumber: this.bonNumber(),
      clientRef: this.clientRef(),
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

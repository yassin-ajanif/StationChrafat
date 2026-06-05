import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/models/common/document-line.model';
import { Avoir, AvoirDraft, AvoirLineTableRow, AvoirStatut } from '../../../../../state/store';

const AVOIR_STATUT_KEYS: Record<AvoirStatut, string> = {
  brouillon: 'ventes.avoir.statusBrouillon',
  emis: 'ventes.avoir.statusEmis',
  applique: 'ventes.avoir.statusApplique',
};

function rowsAreValid(rows: AvoirLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isAvoirFormValid(input: {
  client: string;
  serviceRows: AvoirLineTableRow[];
  productRows: AvoirLineTableRow[];
}): boolean {
  if (input.client.trim().length === 0) {
    return false;
  }
  const filledLines =
    filledDocumentLineTableRows(input.serviceRows).length +
    filledDocumentLineTableRows(input.productRows).length;
  if (filledLines === 0) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

function emptyPaymentSplit(): PaymentSplit {
  return { cash: 0, tpe: 0, bons: 0 };
}

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-avoir-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './avoir-form-dialog.component.html',
  styleUrl: './avoir-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvoirFormDialogComponent {
  readonly open = input(false);
  readonly editAvoir = input<Avoir | null>(null);
  readonly saved = output<AvoirDraft>();
  readonly closed = output<void>();

  readonly statutKeys = AVOIR_STATUT_KEYS;
  readonly statutOptions: AvoirStatut[] = ['brouillon', 'emis', 'applique'];

  readonly isEditMode = computed(() => this.editAvoir() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly factureLiee = signal('');
  readonly client = signal('');
  readonly statut = signal<AvoirStatut>('brouillon');
  readonly dateEmission = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<AvoirLineTableRow[]>([]);
  readonly productRows = signal<AvoirLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly avoirTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()) + computeDocumentLineTableTotalTTC(this.productRows()));

  readonly saveBlockers = computed(() => {
    const blockers: string[] = [];
    const client = this.client();
    const serviceRows = this.serviceRows();
    const productRows = this.productRows();

    if (client.trim().length === 0) {
      blockers.push('common.formValidation.clientRequired');
    }
    if (
      filledDocumentLineTableRows(serviceRows).length +
        filledDocumentLineTableRows(productRows).length ===
      0
    ) {
      blockers.push('common.formValidation.documentLineRequired');
    }
    if (!rowsAreValid(serviceRows) || !rowsAreValid(productRows)) {
      blockers.push('common.formValidation.incompleteLine');
    }
    if (!isPaymentSplitBalanced(this.payments(), this.avoirTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isAvoirFormValid({
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.avoirTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editAvoir();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(avoir: Avoir): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.factureLiee.set(avoir.factureLiee);
    this.client.set(avoir.client);
    this.statut.set(avoir.statut);
    this.dateEmission.set(avoir.dateEmission);
    this.payments.set({ ...(avoir.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      avoir.serviceLines.length > 0
        ? avoir.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      avoir.productLines.length > 0
        ? avoir.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.factureLiee.set('');
    this.client.set('');
    this.statut.set('brouillon');
    this.dateEmission.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): AvoirLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): AvoirLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): AvoirLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): AvoirLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof AvoirLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof AvoirLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof AvoirLineTableRow; value: string | number | null },
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

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }

  cancel(): void {
    this.closed.emit();
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }
    const lines = {
      serviceLines: parseDocumentLineDrafts(this.serviceRows()),
      productLines: parseDocumentLineDrafts(this.productRows()),
    };
    this.saved.emit({
      factureLiee: this.factureLiee().trim(),
      client: this.client().trim(),
      statut: this.statut(),
      dateEmission: this.dateEmission(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

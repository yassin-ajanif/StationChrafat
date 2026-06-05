import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/models/common/document-line.model';
import { Facture, FactureDraft, FactureLineTableRow, FactureStatut } from '../../../../../state/store';

const FACTURE_STATUT_KEYS: Record<FactureStatut, string> = {
  brouillon: 'ventes.facture.statusBrouillon',
  emise: 'ventes.facture.statusEmise',
  payee: 'ventes.facture.statusPayee',
  en_retard: 'ventes.facture.statusEnRetard',
};

function rowsAreValid(rows: FactureLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isFactureFormValid(input: {
  client: string;
  serviceRows: FactureLineTableRow[];
  productRows: FactureLineTableRow[];
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
  selector: 'app-facture-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './facture-form-dialog.component.html',
  styleUrl: './facture-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactureFormDialogComponent {
  readonly open = input(false);
  readonly editFacture = input<Facture | null>(null);
  readonly saved = output<FactureDraft>();
  readonly closed = output<void>();

  readonly statutKeys = FACTURE_STATUT_KEYS;
  readonly statutOptions: FactureStatut[] = ['brouillon', 'emise', 'payee', 'en_retard'];

  readonly isEditMode = computed(() => this.editFacture() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly client = signal('');
  readonly statut = signal<FactureStatut>('brouillon');
  readonly dateEmission = signal('');
  readonly dateEcheance = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<FactureLineTableRow[]>([]);
  readonly productRows = signal<FactureLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly factureTotal = computed(() =>
    computeDocumentLineTableTotalTTC(this.serviceRows()) + computeDocumentLineTableTotalTTC(this.productRows()),
  );

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
    if (!isPaymentSplitBalanced(this.payments(), this.factureTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isFactureFormValid({
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.factureTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editFacture();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(facture: Facture): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set(facture.client);
    this.statut.set(facture.statut);
    this.dateEmission.set(facture.dateEmission);
    this.dateEcheance.set(facture.dateEcheance);
    this.payments.set({ ...(facture.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      facture.serviceLines.length > 0
        ? facture.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      facture.productLines.length > 0
        ? facture.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set('');
    this.statut.set('brouillon');
    this.dateEmission.set('');
    this.dateEcheance.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): FactureLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): FactureLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): FactureLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): FactureLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof FactureLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof FactureLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof FactureLineTableRow; value: string | number | null },
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
      client: this.client().trim(),
      statut: this.statut(),
      dateEmission: this.dateEmission(),
      dateEcheance: this.dateEcheance(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

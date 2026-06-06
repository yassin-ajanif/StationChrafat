import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { Reception, ReceptionDraft, ReceptionLineTableRow, ReceptionStatut } from '../../../../../state/store';

const RECEPTION_STATUT_KEYS: Record<ReceptionStatut, string> = {
  planifiee: 'achat.reception.statusPlanifiee',
  en_cours: 'achat.reception.statusEnCours',
  recue: 'achat.reception.statusRecue',
  annulee: 'achat.reception.statusAnnulee',
};

function rowsAreValid(rows: ReceptionLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isReceptionFormValid(input: {
  fournisseur: string;
  serviceRows: ReceptionLineTableRow[];
  productRows: ReceptionLineTableRow[];
}): boolean {
  if (input.fournisseur.trim().length === 0) {
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
  selector: 'app-reception-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './reception-form-dialog.component.html',
  styleUrl: './reception-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionFormDialogComponent {
  readonly open = input(false);
  readonly editReception = input<Reception | null>(null);
  readonly saved = output<ReceptionDraft>();
  readonly closed = output<void>();

  readonly statutKeys = RECEPTION_STATUT_KEYS;
  readonly statutOptions: ReceptionStatut[] = ['planifiee', 'en_cours', 'recue', 'annulee'];

  readonly isEditMode = computed(() => this.editReception() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly dateReception = signal('');
  readonly statut = signal<ReceptionStatut>('planifiee');
  readonly reference = signal('');
  readonly description = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<ReceptionLineTableRow[]>([]);
  readonly productRows = signal<ReceptionLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly receptionTotal = computed(() =>
    computeDocumentLineTableTotalTTC(this.serviceRows()) + computeDocumentLineTableTotalTTC(this.productRows()),
  );

  readonly saveBlockers = computed(() => {
    const blockers: string[] = [];
    const fournisseur = this.fournisseur();
    const serviceRows = this.serviceRows();
    const productRows = this.productRows();

    if (fournisseur.trim().length === 0) {
      blockers.push('common.formValidation.supplierRequired');
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
    if (!isPaymentSplitBalanced(this.payments(), this.receptionTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isReceptionFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.receptionTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editReception();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(reception: Reception): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set(reception.fournisseur);
    this.dateReception.set(reception.dateReception);
    this.statut.set(reception.statut);
    this.reference.set(reception.reference);
    this.description.set(reception.description);
    this.payments.set({ ...(reception.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      reception.serviceLines.length > 0
        ? reception.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      reception.productLines.length > 0
        ? reception.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set('');
    this.dateReception.set('');
    this.statut.set('planifiee');
    this.reference.set('');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): ReceptionLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): ReceptionLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): ReceptionLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): ReceptionLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof ReceptionLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof ReceptionLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof ReceptionLineTableRow; value: string | number | null },
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
      fournisseur: this.fournisseur().trim(),
      dateReception: this.dateReception(),
      statut: this.statut(),
      reference: this.reference().trim(),
      description: this.description().trim(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

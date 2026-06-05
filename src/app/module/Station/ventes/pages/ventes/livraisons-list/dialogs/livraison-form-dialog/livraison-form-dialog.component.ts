import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/models/common/document-line.model';
import { Livraison, LivraisonDraft, LivraisonLineTableRow, LivraisonStatut } from '../../../../../state/store';

const LIVRAISON_STATUT_KEYS: Record<LivraisonStatut, string> = {
  planifiee: 'ventes.livraison.statusPlanifiee',
  en_cours: 'ventes.livraison.statusEnCours',
  livree: 'ventes.livraison.statusLivree',
  annulee: 'ventes.livraison.statusAnnulee',
};

function rowsAreValid(rows: LivraisonLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isLivraisonFormValid(input: {
  client: string;
  serviceRows: LivraisonLineTableRow[];
  productRows: LivraisonLineTableRow[];
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
  selector: 'app-livraison-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './livraison-form-dialog.component.html',
  styleUrl: './livraison-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivraisonFormDialogComponent {
  readonly open = input(false);
  readonly editLivraison = input<Livraison | null>(null);
  readonly saved = output<LivraisonDraft>();
  readonly closed = output<void>();

  readonly statutKeys = LIVRAISON_STATUT_KEYS;
  readonly statutOptions: LivraisonStatut[] = ['planifiee', 'en_cours', 'livree', 'annulee'];

  readonly isEditMode = computed(() => this.editLivraison() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly client = signal('');
  readonly dateLivraison = signal('');
  readonly statut = signal<LivraisonStatut>('planifiee');
  readonly adresse = signal('');
  readonly description = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<LivraisonLineTableRow[]>([]);
  readonly productRows = signal<LivraisonLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly livraisonTotal = computed(() =>
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
    if (!isPaymentSplitBalanced(this.payments(), this.livraisonTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isLivraisonFormValid({
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.livraisonTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editLivraison();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(livraison: Livraison): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set(livraison.client);
    this.dateLivraison.set(livraison.dateLivraison);
    this.statut.set(livraison.statut);
    this.adresse.set(livraison.adresse);
    this.description.set(livraison.description);
    this.payments.set({ ...(livraison.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      livraison.serviceLines.length > 0
        ? livraison.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      livraison.productLines.length > 0
        ? livraison.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set('');
    this.dateLivraison.set('');
    this.statut.set('planifiee');
    this.adresse.set('');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): LivraisonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): LivraisonLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): LivraisonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): LivraisonLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof LivraisonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof LivraisonLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof LivraisonLineTableRow; value: string | number | null },
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
      dateLivraison: this.dateLivraison(),
      statut: this.statut(),
      adresse: this.adresse().trim(),
      description: this.description().trim(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

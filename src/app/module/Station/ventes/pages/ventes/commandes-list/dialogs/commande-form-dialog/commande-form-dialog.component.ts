import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { Commande, CommandeDraft, CommandeLineTableRow, CommandeStatut } from '../../../../../state/store';

const COMMANDE_STATUT_KEYS: Record<CommandeStatut, string> = {
  en_attente: 'ventes.commande.statusEnAttente',
  confirmee: 'ventes.commande.statusConfirmee',
  en_cours: 'ventes.commande.statusEnCours',
  livree: 'ventes.commande.statusLivree',
  annulee: 'ventes.commande.statusAnnulee',
};

function rowsAreValid(rows: CommandeLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isCommandeFormValid(input: {
  client: string;
  serviceRows: CommandeLineTableRow[];
  productRows: CommandeLineTableRow[];
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
  selector: 'app-commande-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './commande-form-dialog.component.html',
  styleUrl: './commande-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandeFormDialogComponent {
  readonly open = input(false);
  readonly editCommande = input<Commande | null>(null);
  readonly saved = output<CommandeDraft>();
  readonly closed = output<void>();

  readonly statutKeys = COMMANDE_STATUT_KEYS;
  readonly statutOptions: CommandeStatut[] = [
    'en_attente',
    'confirmee',
    'en_cours',
    'livree',
    'annulee',
  ];

  readonly isEditMode = computed(() => this.editCommande() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly client = signal('');
  readonly statut = signal<CommandeStatut>('en_attente');
  readonly description = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<CommandeLineTableRow[]>([]);
  readonly productRows = signal<CommandeLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly commandeTotal = computed(() =>
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
    if (!isPaymentSplitBalanced(this.payments(), this.commandeTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isCommandeFormValid({
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.commandeTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editCommande();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(commande: Commande): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set(commande.client);
    this.statut.set(commande.statut);
    this.description.set(commande.description);
    this.payments.set({ ...(commande.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      commande.serviceLines.length > 0
        ? commande.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      commande.productLines.length > 0
        ? commande.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.client.set('');
    this.statut.set('en_attente');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): CommandeLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): CommandeLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): CommandeLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): CommandeLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof CommandeLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof CommandeLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof CommandeLineTableRow; value: string | number | null },
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
      description: this.description().trim(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

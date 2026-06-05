import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import { computeDocumentLineTableTotalTTC, createEmptyDocumentLineTableRow, documentLineToTableRow, filledDocumentLineTableRows, isDocumentLineTableRowEmpty, isDocumentLineTableRowFilled, parseDocumentLineDrafts } from '../../../../../../shared/models/common/document-line.model';
import { CommandeAchat, CommandeAchatDraft, CommandeAchatLineTableRow, CommandeAchatStatut } from '../../../../../state/store';

const COMMANDE_ACHAT_STATUT_KEYS: Record<CommandeAchatStatut, string> = {
  en_attente: 'achat.commande.statusEnAttente',
  confirmee: 'achat.commande.statusConfirmee',
  en_cours: 'achat.commande.statusEnCours',
  recue: 'achat.commande.statusRecue',
  annulee: 'achat.commande.statusAnnulee',
};

function rowsAreValid(rows: CommandeAchatLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isCommandeAchatFormValid(input: {
  fournisseur: string;
  serviceRows: CommandeAchatLineTableRow[];
  productRows: CommandeAchatLineTableRow[];
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
  selector: 'app-commande-achat-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './commande-achat-form-dialog.component.html',
  styleUrl: './commande-achat-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandeAchatFormDialogComponent {
  readonly open = input(false);
  readonly editCommandeAchat = input<CommandeAchat | null>(null);
  readonly saved = output<CommandeAchatDraft>();
  readonly closed = output<void>();

  readonly statutKeys = COMMANDE_ACHAT_STATUT_KEYS;
  readonly statutOptions: CommandeAchatStatut[] = [
    'en_attente',
    'confirmee',
    'en_cours',
    'recue',
    'annulee',
  ];

  readonly isEditMode = computed(() => this.editCommandeAchat() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly statut = signal<CommandeAchatStatut>('en_attente');
  readonly description = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<CommandeAchatLineTableRow[]>([]);
  readonly productRows = signal<CommandeAchatLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));
  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));
  readonly commandeTotal = computed(() =>
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
    if (!isPaymentSplitBalanced(this.payments(), this.commandeTotal())) {
      blockers.push('common.formValidation.paymentNotBalanced');
    }
    return blockers;
  });

  readonly canSave = computed(
    () =>
      isCommandeAchatFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.commandeTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editCommandeAchat();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(commande: CommandeAchat): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set(commande.fournisseur);
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
    this.fournisseur.set('');
    this.statut.set('en_attente');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): CommandeAchatLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): CommandeAchatLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): CommandeAchatLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): CommandeAchatLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof CommandeAchatLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof CommandeAchatLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof CommandeAchatLineTableRow; value: string | number | null },
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
      statut: this.statut(),
      description: this.description().trim(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

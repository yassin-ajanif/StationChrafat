import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  COMMANDE_ACHAT_STATUT_LABELS,
  CommandeAchat,
  CommandeAchatDraft,
  CommandeAchatLineTableRow,
  CommandeAchatStatut,
  buildCommandeAchatLineDrafts,
  computeDraftCommandeAchatProductsTotal,
  computeDraftCommandeAchatServicesTotal,
  computeDraftCommandeAchatTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isCommandeAchatFormValid,
} from '../../../../../models/achat';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-commande-achat-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './commande-achat-form-dialog.component.html',
  styleUrl: './commande-achat-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandeAchatFormDialogComponent {
  readonly open = input(false);
  readonly editCommandeAchat = input<CommandeAchat | null>(null);
  readonly saved = output<CommandeAchatDraft>();
  readonly closed = output<void>();

  readonly statutLabels = COMMANDE_ACHAT_STATUT_LABELS;
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

  readonly serviceTotal = computed(() => computeDraftCommandeAchatServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftCommandeAchatProductsTotal(this.productRows()));
  readonly commandeTotal = computed(() =>
    computeDraftCommandeAchatTotal(this.serviceRows(), this.productRows()),
  );

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
    const lines = buildCommandeAchatLineDrafts(this.serviceRows(), this.productRows());
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

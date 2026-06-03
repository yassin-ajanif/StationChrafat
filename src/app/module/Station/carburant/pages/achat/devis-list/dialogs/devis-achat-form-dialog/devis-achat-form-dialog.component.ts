import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  DEVIS_ACHAT_STATUT_LABELS,
  DevisAchat,
  DevisAchatDraft,
  DevisAchatLineTableRow,
  DevisAchatStatut,
  buildDevisAchatLineDrafts,
  computeDraftDevisAchatProductsTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isDevisAchatFormValid,
} from '../../../../../models/achat';

const DEFAULT_PRODUCT_ROWS = 1;
const DEFAULT_FUEL_UNIT = 'L';

@Component({
  selector: 'app-carburant-devis-achat-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './devis-achat-form-dialog.component.html',
  styleUrl: './devis-achat-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevisAchatFormDialogComponent {
  readonly open = input(false);
  readonly editDevisAchat = input<DevisAchat | null>(null);
  readonly saved = output<DevisAchatDraft>();
  readonly closed = output<void>();

  readonly statutLabels = DEVIS_ACHAT_STATUT_LABELS;
  readonly statutOptions: DevisAchatStatut[] = ['brouillon', 'envoye', 'accepte', 'refuse'];

  readonly isEditMode = computed(() => this.editDevisAchat() != null);

  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly statut = signal<DevisAchatStatut>('brouillon');
  readonly dateValidite = signal('');
  readonly notes = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly productRows = signal<DevisAchatLineTableRow[]>([]);

  readonly serviceTotal = computed(() => 0);
  readonly productTotal = computed(() => computeDraftDevisAchatProductsTotal(this.productRows()));
  readonly devisTotal = computed(() => this.productTotal());

  readonly canSave = computed(
    () =>
      isDevisAchatFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: [],
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.devisTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editDevisAchat();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(devis: DevisAchat): void {
    this.productSeq = 0;
    this.fournisseur.set(devis.fournisseur);
    this.statut.set(devis.statut);
    this.dateValidite.set(devis.dateValidite);
    this.notes.set(devis.notes);
    this.payments.set({ ...(devis.payments ?? emptyPaymentSplit()) });
    this.productRows.set(
      devis.productLines.length > 0
        ? devis.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.productSeq = 0;
    this.fournisseur.set('');
    this.statut.set('brouillon');
    this.dateValidite.set('');
    this.notes.set('');
    this.payments.set(emptyPaymentSplit());
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyProductRows(count: number): DevisAchatLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyProductRow(): DevisAchatLineTableRow {
    return { ...createEmptyDocumentLineTableRow(++this.productSeq), unit: DEFAULT_FUEL_UNIT };
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof DevisAchatLineTableRow;
    value: string | number | null;
  }): void {
    this.productRows.update((rows) =>
      rows.map((row) => (row.rowId === event.rowId ? { ...row, [event.field]: event.value } : row)),
    );
  }

  addProductRow(): void {
    this.productRows.update((rows) => [...rows, this.createEmptyProductRow()]);
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
    const lines = buildDevisAchatLineDrafts([], this.productRows());
    this.saved.emit({
      fournisseur: this.fournisseur().trim(),
      statut: this.statut(),
      dateValidite: this.dateValidite(),
      notes: this.notes(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

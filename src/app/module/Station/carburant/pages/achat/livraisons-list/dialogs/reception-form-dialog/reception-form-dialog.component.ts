import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  RECEPTION_STATUT_LABELS,
  Reception,
  ReceptionDraft,
  ReceptionLineTableRow,
  ReceptionStatut,
  buildReceptionLineDrafts,
  computeDraftReceptionProductsTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isReceptionFormValid,
} from '../../../../../models/achat';

const DEFAULT_PRODUCT_ROWS = 1;
const DEFAULT_FUEL_UNIT = 'L';

@Component({
  selector: 'app-carburant-reception-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './reception-form-dialog.component.html',
  styleUrl: './reception-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionFormDialogComponent {
  readonly open = input(false);
  readonly editReception = input<Reception | null>(null);
  readonly saved = output<ReceptionDraft>();
  readonly closed = output<void>();

  readonly statutLabels = RECEPTION_STATUT_LABELS;
  readonly statutOptions: ReceptionStatut[] = ['planifiee', 'en_cours', 'recue', 'annulee'];

  readonly isEditMode = computed(() => this.editReception() != null);

  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly statut = signal<ReceptionStatut>('planifiee');
  readonly dateReception = signal('');
  readonly reference = signal('');
  readonly description = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly productRows = signal<ReceptionLineTableRow[]>([]);

  readonly serviceTotal = computed(() => 0);
  readonly productTotal = computed(() => computeDraftReceptionProductsTotal(this.productRows()));
  readonly receptionTotal = computed(() => this.productTotal());

  readonly canSave = computed(
    () =>
      isReceptionFormValid({
        fournisseur: this.fournisseur(),
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
    this.productSeq = 0;
    this.fournisseur.set(reception.fournisseur);
    this.statut.set(reception.statut);
    this.dateReception.set(reception.dateReception);
    this.reference.set(reception.reference);
    this.description.set(reception.description);
    this.payments.set({ ...(reception.payments ?? emptyPaymentSplit()) });
    this.productRows.set(
      reception.productLines.length > 0
        ? reception.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.productSeq = 0;
    this.fournisseur.set('');
    this.statut.set('planifiee');
    this.dateReception.set('');
    this.reference.set('');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyProductRows(count: number): ReceptionLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyProductRow(): ReceptionLineTableRow {
    return { ...createEmptyDocumentLineTableRow(++this.productSeq), unit: DEFAULT_FUEL_UNIT };
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof ReceptionLineTableRow;
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
    const lines = buildReceptionLineDrafts([], this.productRows());
    this.saved.emit({
      fournisseur: this.fournisseur().trim(),
      statut: this.statut(),
      dateReception: this.dateReception(),
      reference: this.reference().trim(),
      description: this.description().trim(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  LIVRAISON_STATUT_LABELS,
  Livraison,
  LivraisonDraft,
  LivraisonLineTableRow,
  LivraisonStatut,
  buildLivraisonLineDrafts,
  computeDraftLivraisonProductsTotal,
  computeDraftLivraisonServicesTotal,
  computeDraftLivraisonTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isLivraisonFormValid,
} from '../../../../../models/ventes';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-livraison-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './livraison-form-dialog.component.html',
  styleUrl: './livraison-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivraisonFormDialogComponent {
  readonly open = input(false);
  readonly editLivraison = input<Livraison | null>(null);
  readonly saved = output<LivraisonDraft>();
  readonly closed = output<void>();

  readonly statutLabels = LIVRAISON_STATUT_LABELS;
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

  readonly serviceTotal = computed(() => computeDraftLivraisonServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftLivraisonProductsTotal(this.productRows()));
  readonly livraisonTotal = computed(() =>
    computeDraftLivraisonTotal(this.serviceRows(), this.productRows()),
  );

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
    const lines = buildLivraisonLineDrafts(this.serviceRows(), this.productRows());
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

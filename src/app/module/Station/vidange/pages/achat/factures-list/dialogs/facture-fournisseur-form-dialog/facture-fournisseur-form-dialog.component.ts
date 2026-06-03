import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  FACTURE_FOURNISSEUR_STATUT_LABELS,
  FactureFournisseur,
  FactureFournisseurDraft,
  FactureFournisseurLineTableRow,
  FactureFournisseurStatut,
  buildFactureFournisseurLineDrafts,
  computeDraftFactureFournisseurProductsTotal,
  computeDraftFactureFournisseurServicesTotal,
  computeDraftFactureFournisseurTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isFactureFournisseurFormValid,
} from '../../../../../models/achat';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-facture-fournisseur-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './facture-fournisseur-form-dialog.component.html',
  styleUrl: './facture-fournisseur-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactureFournisseurFormDialogComponent {
  readonly open = input(false);
  readonly editFactureFournisseur = input<FactureFournisseur | null>(null);
  readonly saved = output<FactureFournisseurDraft>();
  readonly closed = output<void>();

  readonly statutLabels = FACTURE_FOURNISSEUR_STATUT_LABELS;
  readonly statutOptions: FactureFournisseurStatut[] = ['brouillon', 'recue', 'payee', 'en_retard'];

  readonly isEditMode = computed(() => this.editFactureFournisseur() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly statut = signal<FactureFournisseurStatut>('brouillon');
  readonly dateReception = signal('');
  readonly dateEcheance = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<FactureFournisseurLineTableRow[]>([]);
  readonly productRows = signal<FactureFournisseurLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDraftFactureFournisseurServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftFactureFournisseurProductsTotal(this.productRows()));
  readonly factureTotal = computed(() =>
    computeDraftFactureFournisseurTotal(this.serviceRows(), this.productRows()),
  );

  readonly canSave = computed(
    () =>
      isFactureFournisseurFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.factureTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editFactureFournisseur();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(facture: FactureFournisseur): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set(facture.fournisseur);
    this.statut.set(facture.statut);
    this.dateReception.set(facture.dateReception);
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
    this.fournisseur.set('');
    this.statut.set('brouillon');
    this.dateReception.set('');
    this.dateEcheance.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): FactureFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): FactureFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): FactureFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): FactureFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof FactureFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof FactureFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof FactureFournisseurLineTableRow; value: string | number | null },
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
    const lines = buildFactureFournisseurLineDrafts(this.serviceRows(), this.productRows());
    this.saved.emit({
      fournisseur: this.fournisseur().trim(),
      statut: this.statut(),
      dateReception: this.dateReception(),
      dateEcheance: this.dateEcheance(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

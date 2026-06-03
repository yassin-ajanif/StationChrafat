import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  AVOIR_FOURNISSEUR_STATUT_LABELS,
  AvoirFournisseur,
  AvoirFournisseurDraft,
  AvoirFournisseurLineTableRow,
  AvoirFournisseurStatut,
  buildAvoirFournisseurLineDrafts,
  computeDraftAvoirFournisseurProductsTotal,
  computeDraftAvoirFournisseurServicesTotal,
  computeDraftAvoirFournisseurTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isAvoirFournisseurFormValid,
} from '../../../../../models/achat';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-avoir-fournisseur-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './avoir-fournisseur-form-dialog.component.html',
  styleUrl: './avoir-fournisseur-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvoirFournisseurFormDialogComponent {
  readonly open = input(false);
  readonly editAvoirFournisseur = input<AvoirFournisseur | null>(null);
  readonly saved = output<AvoirFournisseurDraft>();
  readonly closed = output<void>();

  readonly statutLabels = AVOIR_FOURNISSEUR_STATUT_LABELS;
  readonly statutOptions: AvoirFournisseurStatut[] = ['brouillon', 'recu', 'applique'];

  readonly isEditMode = computed(() => this.editAvoirFournisseur() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly factureLiee = signal('');
  readonly fournisseur = signal('');
  readonly statut = signal<AvoirFournisseurStatut>('brouillon');
  readonly dateReception = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<AvoirFournisseurLineTableRow[]>([]);
  readonly productRows = signal<AvoirFournisseurLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDraftAvoirFournisseurServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftAvoirFournisseurProductsTotal(this.productRows()));
  readonly avoirTotal = computed(() =>
    computeDraftAvoirFournisseurTotal(this.serviceRows(), this.productRows()),
  );

  readonly canSave = computed(
    () =>
      isAvoirFournisseurFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.avoirTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editAvoirFournisseur();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(avoir: AvoirFournisseur): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.factureLiee.set(avoir.factureLiee);
    this.fournisseur.set(avoir.fournisseur);
    this.statut.set(avoir.statut);
    this.dateReception.set(avoir.dateReception);
    this.payments.set({ ...(avoir.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      avoir.serviceLines.length > 0
        ? avoir.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      avoir.productLines.length > 0
        ? avoir.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.factureLiee.set('');
    this.fournisseur.set('');
    this.statut.set('brouillon');
    this.dateReception.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): AvoirFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): AvoirFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): AvoirFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): AvoirFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof AvoirFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof AvoirFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof AvoirFournisseurLineTableRow; value: string | number | null },
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
    const lines = buildAvoirFournisseurLineDrafts(this.serviceRows(), this.productRows());
    this.saved.emit({
      factureLiee: this.factureLiee().trim(),
      fournisseur: this.fournisseur().trim(),
      statut: this.statut(),
      dateReception: this.dateReception(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

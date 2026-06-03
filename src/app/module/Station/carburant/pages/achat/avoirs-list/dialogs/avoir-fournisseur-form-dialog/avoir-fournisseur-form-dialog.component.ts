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
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isAvoirFournisseurFormValid,
} from '../../../../../models/achat';

const DEFAULT_PRODUCT_ROWS = 1;
const DEFAULT_FUEL_UNIT = 'L';

@Component({
  selector: 'app-carburant-avoir-fournisseur-form-dialog',
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

  private productSeq = 0;

  readonly factureLiee = signal('');
  readonly fournisseur = signal('');
  readonly statut = signal<AvoirFournisseurStatut>('brouillon');
  readonly dateReception = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly productRows = signal<AvoirFournisseurLineTableRow[]>([]);

  readonly serviceTotal = computed(() => 0);
  readonly productTotal = computed(() => computeDraftAvoirFournisseurProductsTotal(this.productRows()));
  readonly avoirTotal = computed(() => this.productTotal());

  readonly canSave = computed(
    () =>
      isAvoirFournisseurFormValid({
        fournisseur: this.fournisseur(),
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
    this.productSeq = 0;
    this.factureLiee.set(avoir.factureLiee);
    this.fournisseur.set(avoir.fournisseur);
    this.statut.set(avoir.statut);
    this.dateReception.set(avoir.dateReception);
    this.payments.set({ ...(avoir.payments ?? emptyPaymentSplit()) });
    this.productRows.set(
      avoir.productLines.length > 0
        ? avoir.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.productSeq = 0;
    this.factureLiee.set('');
    this.fournisseur.set('');
    this.statut.set('brouillon');
    this.dateReception.set('');
    this.payments.set(emptyPaymentSplit());
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyProductRows(count: number): AvoirFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyProductRow(): AvoirFournisseurLineTableRow {
    return { ...createEmptyDocumentLineTableRow(++this.productSeq), unit: DEFAULT_FUEL_UNIT };
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof AvoirFournisseurLineTableRow;
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
    const lines = buildAvoirFournisseurLineDrafts([], this.productRows());
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

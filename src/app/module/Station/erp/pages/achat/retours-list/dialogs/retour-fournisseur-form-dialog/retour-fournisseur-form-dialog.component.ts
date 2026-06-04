import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  RETOUR_FOURNISSEUR_STATUT_LABELS,
  RetourFournisseur,
  RetourFournisseurDraft,
  RetourFournisseurLineTableRow,
  RetourFournisseurStatut,
  buildRetourFournisseurLineDrafts,
  computeDraftRetourFournisseurProductsTotal,
  computeDraftRetourFournisseurServicesTotal,
  computeDraftRetourFournisseurTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isRetourFournisseurFormValid,
} from '../../../../../models/achat';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-retour-fournisseur-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe, BonRecapPaymentsComponent, DocumentLinesTableComponent],
  templateUrl: './retour-fournisseur-form-dialog.component.html',
  styleUrl: './retour-fournisseur-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetourFournisseurFormDialogComponent {
  readonly open = input(false);
  readonly editRetour = input<RetourFournisseur | null>(null);
  readonly saved = output<RetourFournisseurDraft>();
  readonly closed = output<void>();

  readonly statutLabels = RETOUR_FOURNISSEUR_STATUT_LABELS;
  readonly statutOptions: RetourFournisseurStatut[] = ['en_attente', 'envoye', 'recu', 'refuse'];

  readonly isEditMode = computed(() => this.editRetour() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly fournisseur = signal('');
  readonly factureLiee = signal('');
  readonly motif = signal('');
  readonly statut = signal<RetourFournisseurStatut>('en_attente');
  readonly dateCreation = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<RetourFournisseurLineTableRow[]>([]);
  readonly productRows = signal<RetourFournisseurLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDraftRetourFournisseurServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftRetourFournisseurProductsTotal(this.productRows()));
  readonly retourTotal = computed(() => computeDraftRetourFournisseurTotal(this.serviceRows(), this.productRows()));

  readonly canSave = computed(
    () =>
      isRetourFournisseurFormValid({
        fournisseur: this.fournisseur(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.retourTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editRetour();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(retour: RetourFournisseur): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set(retour.fournisseur);
    this.factureLiee.set(retour.factureLiee);
    this.motif.set(retour.motif);
    this.statut.set(retour.statut);
    this.dateCreation.set(retour.dateCreation);
    this.payments.set({ ...(retour.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      retour.serviceLines.length > 0
        ? retour.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      retour.productLines.length > 0
        ? retour.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.fournisseur.set('');
    this.factureLiee.set('');
    this.motif.set('');
    this.statut.set('en_attente');
    this.dateCreation.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): RetourFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): RetourFournisseurLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): RetourFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): RetourFournisseurLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof RetourFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof RetourFournisseurLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof RetourFournisseurLineTableRow; value: string | number | null },
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
    const lines = buildRetourFournisseurLineDrafts(this.serviceRows(), this.productRows());
    this.saved.emit({
      fournisseur: this.fournisseur().trim(),
      factureLiee: this.factureLiee().trim(),
      motif: this.motif().trim(),
      statut: this.statut(),
      dateCreation: this.dateCreation(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

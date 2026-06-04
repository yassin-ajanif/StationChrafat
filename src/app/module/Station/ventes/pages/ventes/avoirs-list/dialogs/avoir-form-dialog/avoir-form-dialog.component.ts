import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../../../core/i18n'
import { ButtonComponent } from '../../../../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../../../../../../shared/components/bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../../../../../shared/components/document-lines-table/document-lines-table.component';
import { PaymentSplit, isPaymentSplitBalanced } from '../../../../../../shared/models/common/payment-split.model';
import {
  AVOIR_STATUT_KEYS,
  Avoir,
  AvoirDraft,
  AvoirLineTableRow,
  AvoirStatut,
  buildAvoirLineDrafts,
  computeDraftAvoirProductsTotal,
  computeDraftAvoirServicesTotal,
  computeDraftAvoirTotal,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  emptyPaymentSplit,
  isAvoirFormValid,
} from '../../../../../models/ventes';

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-avoir-form-dialog',
  standalone: true,
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './avoir-form-dialog.component.html',
  styleUrl: './avoir-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvoirFormDialogComponent {
  readonly open = input(false);
  readonly editAvoir = input<Avoir | null>(null);
  readonly saved = output<AvoirDraft>();
  readonly closed = output<void>();

  readonly statutKeys = AVOIR_STATUT_KEYS;
  readonly statutOptions: AvoirStatut[] = ['brouillon', 'emis', 'applique'];

  readonly isEditMode = computed(() => this.editAvoir() != null);

  private serviceSeq = 0;
  private productSeq = 0;

  readonly factureLiee = signal('');
  readonly client = signal('');
  readonly statut = signal<AvoirStatut>('brouillon');
  readonly dateEmission = signal('');
  readonly payments = signal<PaymentSplit>(emptyPaymentSplit());
  readonly serviceRows = signal<AvoirLineTableRow[]>([]);
  readonly productRows = signal<AvoirLineTableRow[]>([]);

  readonly serviceTotal = computed(() => computeDraftAvoirServicesTotal(this.serviceRows()));
  readonly productTotal = computed(() => computeDraftAvoirProductsTotal(this.productRows()));
  readonly avoirTotal = computed(() => computeDraftAvoirTotal(this.serviceRows(), this.productRows()));

  readonly canSave = computed(
    () =>
      isAvoirFormValid({
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.avoirTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const editing = this.editAvoir();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(avoir: Avoir): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.factureLiee.set(avoir.factureLiee);
    this.client.set(avoir.client);
    this.statut.set(avoir.statut);
    this.dateEmission.set(avoir.dateEmission);
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
    this.client.set('');
    this.statut.set('brouillon');
    this.dateEmission.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): AvoirLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): AvoirLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): AvoirLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): AvoirLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof AvoirLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof AvoirLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof AvoirLineTableRow; value: string | number | null },
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
    const lines = buildAvoirLineDrafts(this.serviceRows(), this.productRows());
    this.saved.emit({
      factureLiee: this.factureLiee().trim(),
      client: this.client().trim(),
      statut: this.statut(),
      dateEmission: this.dateEmission(),
      serviceLines: lines.serviceLines,
      productLines: lines.productLines,
      payments: this.payments(),
    });
  }
}

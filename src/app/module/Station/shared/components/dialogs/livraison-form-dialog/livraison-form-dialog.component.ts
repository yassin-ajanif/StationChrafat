import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../../core/i18n';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  emptyPaymentSplit,
  isPaymentSplitBalanced,
  type PaymentSplit,
} from '../../bon-recap-payments/bon-recap-payments.component';
import {
  computeDocumentLineTableTotalTTC,
  createEmptyDocumentLineTableRow,
  documentLineToTableRow,
  filledDocumentLineTableRows,
  isDocumentLineTableRowEmpty,
  isDocumentLineTableRowFilled,
  parseDocumentLineDrafts,
  type DocumentLineTableRow,
} from '../../document-lines-table/document-lines-table.component';
import type {
  StationBonFormDraft,
  StationBonFormEditValue,
  StationBonStatut,
} from '../../../../journee/state/journee.store';
import type { Livraison, LivraisonDraft, LivraisonStatut } from '../../../../ventes/state/store';
import { BonRecapPaymentsComponent } from '../../bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../../document-lines-table/document-lines-table.component';

export type LivraisonFormVariant = 'ventes' | 'station';

const LIVRAISON_STATUT_KEYS: Record<LivraisonStatut, string> = {
  planifiee: 'ventes.livraison.statusPlanifiee',
  en_cours: 'ventes.livraison.statusEnCours',
  livree: 'ventes.livraison.statusLivree',
  annulee: 'ventes.livraison.statusAnnulee',
};

const LIVRAISON_STATUT_OPTIONS: LivraisonStatut[] = ['planifiee', 'en_cours', 'livree', 'annulee'];

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

function rowsAreValid(rows: DocumentLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

function isFormValid(input: {
  variant: LivraisonFormVariant;
  bonNumber: string;
  operatorId: number | null;
  client: string;
  serviceRows: DocumentLineTableRow[];
  productRows: DocumentLineTableRow[];
}): boolean {
  if (input.variant === 'station') {
    if (input.bonNumber.trim().length === 0 || input.operatorId == null) {
      return false;
    }
  }
  if (input.client.trim().length === 0) {
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

function collectSaveBlockers(input: {
  variant: LivraisonFormVariant;
  bonNumber: string;
  operatorId: number | null;
  client: string;
  serviceRows: DocumentLineTableRow[];
  productRows: DocumentLineTableRow[];
  payments: PaymentSplit;
  total: number;
}): string[] {
  const blockers: string[] = [];
  if (input.variant === 'station' && input.bonNumber.trim().length === 0) {
    blockers.push('common.formValidation.bonNumberRequired');
  }
  if (input.variant === 'station' && input.operatorId == null) {
    blockers.push('common.formValidation.operatorRequired');
  }
  if (input.client.trim().length === 0) {
    blockers.push(
      input.variant === 'station'
        ? 'common.formValidation.clientPlateRequired'
        : 'common.formValidation.clientRequired',
    );
  }
  if (
    filledDocumentLineTableRows(input.serviceRows).length +
      filledDocumentLineTableRows(input.productRows).length ===
    0
  ) {
    blockers.push('common.formValidation.documentLineRequired');
  }
  if (!rowsAreValid(input.serviceRows) || !rowsAreValid(input.productRows)) {
    blockers.push('common.formValidation.incompleteLine');
  }
  if (!isPaymentSplitBalanced(input.payments, input.total)) {
    blockers.push('common.formValidation.paymentNotBalanced');
  }
  return blockers;
}

@Component({
  selector: 'app-livraison-form-dialog',
  standalone: true,
  imports: [
    ButtonComponent,
    BonRecapPaymentsComponent,
    DocumentLinesTableComponent,
    LocaleCurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './livraison-form-dialog.component.html',
  styleUrl: './livraison-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivraisonFormDialogComponent {
  readonly open = input(false);
  readonly variant = input<LivraisonFormVariant>('station');
  readonly editVentes = input<Livraison | null>(null);
  readonly editStation = input<StationBonFormEditValue | null>(null);
  readonly suggestedBonNumber = input('');
  readonly defaultOperatorId = input<number | null>(null);
  readonly operators = input<{ id: number; name: string }[]>([]);
  readonly operatorsLoading = input(false);

  readonly ventesSaved = output<LivraisonDraft>();
  readonly stationSaved = output<StationBonFormDraft>();
  readonly closed = output<void>();

  readonly statutKeys = LIVRAISON_STATUT_KEYS;
  readonly statutOptions = LIVRAISON_STATUT_OPTIONS;

  readonly isEditMode = computed(
    () => (this.variant() === 'ventes' ? this.editVentes() : this.editStation()) != null,
  );
  readonly isStation = computed(() => this.variant() === 'station');

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly operatorId = signal<number | null>(null);
  readonly client = signal('');
  readonly dateLivraison = signal('');
  readonly statut = signal<LivraisonStatut>('planifiee');
  readonly adresse = signal('');
  readonly description = signal('');
  readonly payments = signal(emptyPaymentSplit());
  readonly serviceRows = signal<DocumentLineTableRow[]>([]);
  readonly productRows = signal<DocumentLineTableRow[]>([]);

  readonly formTotal = computed(
    () =>
      computeDocumentLineTableTotalTTC(this.serviceRows()) +
      computeDocumentLineTableTotalTTC(this.productRows()),
  );

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));

  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));

  readonly saveBlockers = computed(() =>
    collectSaveBlockers({
      variant: this.variant(),
      bonNumber: this.bonNumber(),
      operatorId: this.operatorId(),
      client: this.client(),
      serviceRows: this.serviceRows(),
      productRows: this.productRows(),
      payments: this.payments(),
      total: this.formTotal(),
    }),
  );

  readonly canSave = computed(
    () =>
      isFormValid({
        variant: this.variant(),
        bonNumber: this.bonNumber(),
        operatorId: this.operatorId(),
        client: this.client(),
        serviceRows: this.serviceRows(),
        productRows: this.productRows(),
      }) && isPaymentSplitBalanced(this.payments(), this.formTotal()),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      if (this.variant() === 'ventes') {
        const editing = this.editVentes();
        if (editing) {
          this.loadVentesEditForm(editing);
        } else {
          this.resetForm();
        }
        return;
      }
      const editing = this.editStation();
      if (editing) {
        this.loadStationEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadVentesEditForm(livraison: Livraison): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set('');
    this.operatorId.set(null);
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

  private loadStationEditForm(value: StationBonFormEditValue): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(value.bonNumber);
    this.operatorId.set(value.operatorId);
    this.client.set(value.client);
    this.dateLivraison.set(value.dateLivraison);
    this.statut.set(value.statut);
    this.adresse.set(value.adresse);
    this.description.set(value.description);
    this.payments.set({ ...(value.payments ?? emptyPaymentSplit()) });
    this.serviceRows.set(
      value.serviceLines.length > 0
        ? value.serviceLines.map((line) => documentLineToTableRow(line, ++this.serviceSeq))
        : this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS),
    );
    this.productRows.set(
      value.productLines.length > 0
        ? value.productLines.map((line) => documentLineToTableRow(line, ++this.productSeq))
        : this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS),
    );
  }

  private resetForm(): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(this.isStation() ? this.suggestedBonNumber() : '');
    this.operatorId.set(this.defaultOperatorId());
    this.client.set('');
    this.dateLivraison.set('');
    this.statut.set('planifiee');
    this.adresse.set('');
    this.description.set('');
    this.payments.set(emptyPaymentSplit());
    this.serviceRows.set(this.createEmptyServiceRows(DEFAULT_SERVICE_ROWS));
    this.productRows.set(this.createEmptyProductRows(DEFAULT_PRODUCT_ROWS));
  }

  private createEmptyServiceRows(count: number): DocumentLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyServiceRow());
  }

  private createEmptyProductRows(count: number): DocumentLineTableRow[] {
    return Array.from({ length: count }, () => this.createEmptyProductRow());
  }

  private createEmptyServiceRow(): DocumentLineTableRow {
    return createEmptyDocumentLineTableRow(++this.serviceSeq);
  }

  private createEmptyProductRow(): DocumentLineTableRow {
    return createEmptyDocumentLineTableRow(++this.productSeq);
  }

  onOperatorChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.operatorId.set(raw === '' ? null : Number(raw));
  }

  onServiceRowChange(event: {
    rowId: number;
    field: keyof DocumentLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.serviceRows, event);
  }

  onProductRowChange(event: {
    rowId: number;
    field: keyof DocumentLineTableRow;
    value: string | number | null;
  }): void {
    this.patchRow(this.productRows, event);
  }

  private patchRow(
    rowsSignal: typeof this.serviceRows,
    event: { rowId: number; field: keyof DocumentLineTableRow; value: string | number | null },
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
    const serviceLines = parseDocumentLineDrafts(this.serviceRows());
    const productLines = parseDocumentLineDrafts(this.productRows());
    const shared = {
      client: this.client().trim(),
      dateLivraison: this.dateLivraison(),
      adresse: this.adresse().trim(),
      description: this.description().trim(),
      serviceLines,
      productLines,
      payments: this.payments(),
    };

    if (this.variant() === 'ventes') {
      this.ventesSaved.emit({
        ...shared,
        statut: this.statut(),
      });
      return;
    }

    this.stationSaved.emit({
      bonNumber: this.bonNumber().trim(),
      operatorId: this.operatorId()!,
      statut: this.statut() as StationBonStatut,
      ...shared,
    });
  }
}

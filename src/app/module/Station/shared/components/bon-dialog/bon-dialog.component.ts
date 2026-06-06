import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonRecapPaymentsComponent } from '../bon-recap-payments/bon-recap-payments.component';
import { DocumentLinesTableComponent } from '../document-lines-table/document-lines-table.component';

// ---------------------------------------------------------------------------
// PaymentSplit
// ---------------------------------------------------------------------------

export interface PaymentSplit {
  cash: number;
  tpe: number;
  bons: number;
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function emptyPaymentSplit(): PaymentSplit {
  return { cash: 0, tpe: 0, bons: 0 };
}

export function computePaymentTotal(payments: PaymentSplit): number {
  return roundMoney(payments.cash + payments.tpe + payments.bons);
}

export function computePaymentDifference(payments: PaymentSplit, expectedAmount: number): number {
  return roundMoney(computePaymentTotal(payments) - roundMoney(expectedAmount));
}

export function paymentDifferenceLabel(difference: number): string {
  if (roundMoney(difference) === 0) {
    return 'Équilibré';
  }
  return difference > 0 ? 'Surplus' : 'Manque';
}

export function isPaymentSplitBalanced(
  payments: PaymentSplit,
  expectedAmount: number,
): boolean {
  return computePaymentDifference(payments, expectedAmount) === 0;
}

// ---------------------------------------------------------------------------
// DocumentLine
// ---------------------------------------------------------------------------

export type DocumentLineColumnKey =
  | 'reference'
  | 'designation'
  | 'quantity'
  | 'unit'
  | 'unitPriceHT'
  | 'discountPercent'
  | 'vatPercent'
  | 'amountHT'
  | 'amountTTC';

export interface DocumentLineColumnDef {
  key: DocumentLineColumnKey;
  labelKey: string;
  editable: boolean;
  align: 'left' | 'right';
}

export const DOCUMENT_LINE_COLUMNS: DocumentLineColumnDef[] = [
  { key: 'reference', labelKey: 'common.documentLines.reference', editable: true, align: 'left' },
  { key: 'designation', labelKey: 'common.documentLines.designation', editable: true, align: 'left' },
  { key: 'quantity', labelKey: 'common.documentLines.quantity', editable: true, align: 'right' },
  { key: 'unit', labelKey: 'common.documentLines.unit', editable: true, align: 'left' },
  { key: 'unitPriceHT', labelKey: 'common.documentLines.unitPriceHt', editable: true, align: 'right' },
  { key: 'discountPercent', labelKey: 'common.documentLines.discount', editable: true, align: 'right' },
  { key: 'vatPercent', labelKey: 'common.documentLines.vat', editable: true, align: 'right' },
  { key: 'amountHT', labelKey: 'common.documentLines.amountHt', editable: false, align: 'right' },
  { key: 'amountTTC', labelKey: 'common.documentLines.amountTtc', editable: false, align: 'right' },
];

export const DEFAULT_DOCUMENT_LINE_VAT = 20;
export const DEFAULT_DOCUMENT_LINE_UNIT = 'u';

export interface DocumentLine {
  id: number;
  reference: string;
  designation: string;
  quantity: number;
  unit: string;
  unitPriceHT: number;
  discountPercent: number;
  vatPercent: number;
}

export type DocumentLineDraft = Omit<DocumentLine, 'id'>;

export interface DocumentLineTableRow {
  rowId: number;
  reference: string;
  designation: string;
  quantity: number | null;
  unit: string;
  unitPriceHT: number | null;
  discountPercent: number | null;
  vatPercent: number | null;
}

export type DocumentLineVisibility = Record<DocumentLineColumnKey, boolean>;

export function defaultDocumentLineVisibility(): DocumentLineVisibility {
  return DOCUMENT_LINE_COLUMNS.reduce(
    (acc, column) => ({ ...acc, [column.key]: true }),
    {} as DocumentLineVisibility,
  );
}

export function createEmptyDocumentLineTableRow(rowId: number): DocumentLineTableRow {
  return {
    rowId,
    reference: '',
    designation: '',
    quantity: null,
    unit: DEFAULT_DOCUMENT_LINE_UNIT,
    unitPriceHT: null,
    discountPercent: 0,
    vatPercent: DEFAULT_DOCUMENT_LINE_VAT,
  };
}

export function computeLineAmountHT(
  line: Pick<DocumentLineTableRow, 'quantity' | 'unitPriceHT' | 'discountPercent'>,
): number {
  if (
    line.quantity == null ||
    line.unitPriceHT == null ||
    line.quantity <= 0 ||
    line.unitPriceHT < 0
  ) {
    return 0;
  }
  const discount = line.discountPercent ?? 0;
  const base = line.quantity * line.unitPriceHT;
  return roundMoney(base * (1 - discount / 100));
}

export function computeLineAmountTTC(
  line: Pick<
    DocumentLineTableRow,
    'quantity' | 'unitPriceHT' | 'discountPercent' | 'vatPercent'
  >,
): number {
  const ht = computeLineAmountHT(line);
  const vat = line.vatPercent ?? 0;
  return roundMoney(ht * (1 + vat / 100));
}

export function isDocumentLineTableRowFilled(row: DocumentLineTableRow): boolean {
  return (
    row.designation.trim().length > 0 &&
    row.quantity != null &&
    row.quantity > 0 &&
    !Number.isNaN(row.quantity) &&
    row.unitPriceHT != null &&
    row.unitPriceHT >= 0 &&
    !Number.isNaN(row.unitPriceHT)
  );
}

export function isDocumentLineTableRowEmpty(row: DocumentLineTableRow): boolean {
  return (
    row.reference.trim().length === 0 &&
    row.designation.trim().length === 0 &&
    (row.quantity == null || row.quantity === 0) &&
    (row.unitPriceHT == null || row.unitPriceHT === 0)
  );
}

export function filledDocumentLineTableRows(rows: DocumentLineTableRow[]): DocumentLineTableRow[] {
  return rows.filter(isDocumentLineTableRowFilled);
}

export function parseDocumentLineDrafts(rows: DocumentLineTableRow[]): DocumentLineDraft[] {
  return filledDocumentLineTableRows(rows).map((row) => ({
    reference: row.reference.trim(),
    designation: row.designation.trim(),
    quantity: row.quantity!,
    unit: row.unit.trim() || DEFAULT_DOCUMENT_LINE_UNIT,
    unitPriceHT: row.unitPriceHT!,
    discountPercent: row.discountPercent ?? 0,
    vatPercent: row.vatPercent ?? DEFAULT_DOCUMENT_LINE_VAT,
  }));
}

export function computeDocumentLinesTotalHT(
  lines: Pick<
    DocumentLine,
    'quantity' | 'unitPriceHT' | 'discountPercent'
  >[],
): number {
  return roundMoney(lines.reduce((sum, line) => sum + computeLineAmountHT(line), 0));
}

export function computeDocumentLinesTotalTTC(
  lines: Pick<
    DocumentLine,
    'quantity' | 'unitPriceHT' | 'discountPercent' | 'vatPercent'
  >[],
): number {
  return roundMoney(lines.reduce((sum, line) => sum + computeLineAmountTTC(line), 0));
}

export function computeDocumentLineTableTotalHT(rows: DocumentLineTableRow[]): number {
  return roundMoney(
    filledDocumentLineTableRows(rows).reduce(
      (sum, row) => sum + computeLineAmountHT(row),
      0,
    ),
  );
}

export function computeDocumentLineTableTotalTTC(rows: DocumentLineTableRow[]): number {
  return roundMoney(
    filledDocumentLineTableRows(rows).reduce(
      (sum, row) => sum + computeLineAmountTTC(row),
      0,
    ),
  );
}

export function documentLineTableRowToDraft(row: DocumentLineTableRow): DocumentLineDraft | null {
  if (!isDocumentLineTableRowFilled(row)) {
    return null;
  }
  return parseDocumentLineDrafts([row])[0] ?? null;
}

export function documentLineToTableRow(line: DocumentLine, rowId: number): DocumentLineTableRow {
  return {
    rowId,
    reference: line.reference,
    designation: line.designation,
    quantity: line.quantity,
    unit: line.unit,
    unitPriceHT: line.unitPriceHT,
    discountPercent: line.discountPercent,
    vatPercent: line.vatPercent,
  };
}

// ---------------------------------------------------------------------------
// LivraisonForm
// ---------------------------------------------------------------------------

export type LivraisonFormStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';

export const LIVRAISON_FORM_STATUT_KEYS: Record<LivraisonFormStatut, string> = {
  planifiee: 'ventes.livraison.statusPlanifiee',
  en_cours: 'ventes.livraison.statusEnCours',
  livree: 'ventes.livraison.statusLivree',
  annulee: 'ventes.livraison.statusAnnulee',
};

export const LIVRAISON_FORM_STATUT_OPTIONS: LivraisonFormStatut[] = [
  'planifiee',
  'en_cours',
  'livree',
  'annulee',
];

export interface LivraisonFormDraft {
  bonNumber?: string;
  operatorId?: number | null;
  client: string;
  dateLivraison: string;
  statut: LivraisonFormStatut;
  adresse: string;
  description: string;
  serviceLines: DocumentLineDraft[];
  productLines: DocumentLineDraft[];
  payments: PaymentSplit;
}

export interface LivraisonFormEditValue {
  bonNumber?: string;
  operatorId?: number | null;
  client: string;
  dateLivraison: string;
  statut: LivraisonFormStatut;
  adresse: string;
  description: string;
  serviceLines: DocumentLine[];
  productLines: DocumentLine[];
  payments: PaymentSplit;
}

export type LivraisonFormVariant = 'ventes' | 'station';

function rowsAreValid(rows: DocumentLineTableRow[]): boolean {
  return rows.every(
    (row) => isDocumentLineTableRowEmpty(row) || isDocumentLineTableRowFilled(row),
  );
}

export function isLivraisonFormValid(input: {
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

export function collectLivraisonFormSaveBlockers(input: {
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

export function computeLivraisonFormTotal(
  serviceRows: DocumentLineTableRow[],
  productRows: DocumentLineTableRow[],
): number {
  return (
    computeDocumentLineTableTotalTTC(serviceRows) +
    computeDocumentLineTableTotalTTC(productRows)
  );
}

// ---------------------------------------------------------------------------
// StationBon
// ---------------------------------------------------------------------------

export type StationBonLine = DocumentLine;
export type StationBonLineDraft = DocumentLineDraft;
export type StationBonLineTableRow = DocumentLineTableRow;

export interface StationBon {
  id: number;
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  operatorId: number;
  dateLivraison: string;
  statut: LivraisonFormStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLine[];
  productLines: StationBonLine[];
  payments: PaymentSplit;
  fuelTransmittedFromNozzles?: boolean;
}

export interface StationBonDraftInput {
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  operatorId: number;
  dateLivraison: string;
  statut: LivraisonFormStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLineDraft[];
  productLines: StationBonLineDraft[];
  payments: PaymentSplit;
}

export function computeBonServicesAmountHT(bon: StationBon): number {
  return roundMoney(computeDocumentLinesTotalHT(bon.serviceLines));
}

export function computeBonProductsAmountHT(bon: StationBon): number {
  return roundMoney(computeDocumentLinesTotalHT(bon.productLines));
}

export function computeBonServicesAmount(bon: StationBon): number {
  return roundMoney(computeDocumentLinesTotalTTC(bon.serviceLines));
}

export function computeBonProductsAmount(bon: StationBon): number {
  return roundMoney(computeDocumentLinesTotalTTC(bon.productLines));
}

export function computeBonTotalHT(bon: StationBon): number {
  return roundMoney(computeBonServicesAmountHT(bon) + computeBonProductsAmountHT(bon));
}

export function computeBonTotal(bon: StationBon): number {
  return roundMoney(computeBonServicesAmount(bon) + computeBonProductsAmount(bon));
}

export function computeBonConsumedQty(bon: StationBon): number {
  return bon.productLines.reduce((sum, line) => sum + line.quantity, 0);
}

export function computeStationBonsTotal(bons: StationBon[]): number {
  return bons.reduce((sum, bon) => sum + computeBonTotal(bon), 0);
}

export function canProceedBonsStep(_bons: StationBon[]): boolean {
  return true;
}

export function suggestNextStationBonNumber(
  existing: Pick<StationBon, 'bonNumber'>[],
  prefix: string,
  fallback: number,
): string {
  const max = existing.reduce((acc, bon) => {
    const match = bon.bonNumber.match(new RegExp(`${prefix}-(\\d+)`, 'i'));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, fallback);
  return `${prefix}-${max + 1}`;
}

export function computeDraftBonTotal(
  serviceRows: StationBonLineTableRow[],
  productRows: StationBonLineTableRow[],
): number {
  return roundMoney(
    computeDocumentLineTableTotalTTC(serviceRows) +
      computeDocumentLineTableTotalTTC(productRows),
  );
}

export function computeDraftServicesTotal(
  serviceRows: StationBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(serviceRows);
}

export function computeDraftProductsTotal(
  productRows: StationBonLineTableRow[],
): number {
  return computeDocumentLineTableTotalTTC(productRows);
}

export function buildStationBonDraft(
  serviceRows: StationBonLineTableRow[],
  productRows: StationBonLineTableRow[],
): Pick<StationBonDraftInput, 'serviceLines' | 'productLines'> {
  return {
    serviceLines: parseDocumentLineDrafts(serviceRows),
    productLines: parseDocumentLineDrafts(productRows),
  };
}

export function isStationBonLinesValid(input: {
  bonNumber: string;
  chefVidangeLavageId: number | null;
  operatorId: number | null;
  serviceRows: StationBonLineTableRow[];
  productRows: StationBonLineTableRow[];
}): boolean {
  if (
    input.bonNumber.trim().length === 0 ||
    input.chefVidangeLavageId == null ||
    input.operatorId == null
  ) {
    return false;
  }
  return rowsAreValid(input.serviceRows) && rowsAreValid(input.productRows);
}

export function stationBonToFormEditValue(bon: StationBon): LivraisonFormEditValue {
  return {
    bonNumber: bon.bonNumber,
    operatorId: bon.operatorId,
    client: bon.partnerRef,
    dateLivraison: bon.dateLivraison,
    statut: bon.statut,
    adresse: bon.adresse,
    description: bon.description,
    serviceLines: bon.serviceLines,
    productLines: bon.productLines,
    payments: bon.payments,
  };
}

export function livraisonFormDraftToStationBonDraftInput(
  draft: LivraisonFormDraft,
  chefVidangeLavageId: number,
): StationBonDraftInput {
  return {
    bonNumber: draft.bonNumber?.trim() ?? '',
    partnerRef: draft.client.trim(),
    chefVidangeLavageId,
    operatorId: draft.operatorId!,
    dateLivraison: draft.dateLivraison,
    statut: draft.statut,
    adresse: draft.adresse.trim(),
    description: draft.description.trim(),
    serviceLines: draft.serviceLines,
    productLines: draft.productLines,
    payments: draft.payments,
  };
}

// ---------------------------------------------------------------------------
// BonConfig
// ---------------------------------------------------------------------------

export interface BonConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  guardRedirectIfNoDraft?: readonly string[];
  chefSelectLabel: string;
  headerIcon: string;
}

export const JOURNEE_BON_CONFIG: BonConfig = {
  title: 'Bons station',
  description:
    'Consultez et gérez les bons de la station. Le bon carburant est généré automatiquement depuis les index pistolets.',
  backLink: ['/journees', 'nouvelle', 'index-pistoles-step2'],
  nextLink: ['/journees', 'nouvelle', 'encaissements-step5'],
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
  chefSelectLabel: 'Responsable vidange / lavage',
  headerIcon: '📋',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DEFAULT_SERVICE_ROWS = 1;
const DEFAULT_PRODUCT_ROWS = 1;

@Component({
  selector: 'app-bon-dialog',
  imports: [ButtonComponent, BonRecapPaymentsComponent, DocumentLinesTableComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './bon-dialog.component.html',
  styleUrl: './bon-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonDialogComponent {
  readonly open = input(false);
  readonly variant = input<LivraisonFormVariant>('station');
  readonly editValue = input<LivraisonFormEditValue | null>(null);
  readonly suggestedBonNumber = input('');
  readonly defaultOperatorId = input<number | null>(null);
  readonly operators = input<{ id: number; name: string }[]>([]);
  readonly operatorsLoading = input(false);

  readonly saved = output<LivraisonFormDraft>();
  readonly closed = output<void>();

  readonly statutKeys = LIVRAISON_FORM_STATUT_KEYS;
  readonly statutOptions = LIVRAISON_FORM_STATUT_OPTIONS;

  readonly isEditMode = computed(() => this.editValue() != null);
  readonly isStation = computed(() => this.variant() === 'station');

  private serviceSeq = 0;
  private productSeq = 0;

  readonly bonNumber = signal('');
  readonly operatorId = signal<number | null>(null);
  readonly client = signal('');
  readonly dateLivraison = signal('');
  readonly statut = signal<LivraisonFormStatut>('planifiee');
  readonly adresse = signal('');
  readonly description = signal('');
  readonly payments = signal(emptyPaymentSplit());
  readonly serviceRows = signal<DocumentLineTableRow[]>([]);
  readonly productRows = signal<DocumentLineTableRow[]>([]);

  readonly formTotal = computed(() =>
    computeLivraisonFormTotal(this.serviceRows(), this.productRows()),
  );

  readonly serviceTotal = computed(() => computeDocumentLineTableTotalTTC(this.serviceRows()));

  readonly productTotal = computed(() => computeDocumentLineTableTotalTTC(this.productRows()));

  readonly saveBlockers = computed(() =>
    collectLivraisonFormSaveBlockers({
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
      isLivraisonFormValid({
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
      const editing = this.editValue();
      if (editing) {
        this.loadEditForm(editing);
      } else {
        this.resetForm();
      }
    });
  }

  private loadEditForm(value: LivraisonFormEditValue): void {
    this.serviceSeq = 0;
    this.productSeq = 0;
    this.bonNumber.set(value.bonNumber ?? '');
    this.operatorId.set(value.operatorId ?? null);
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
    this.saved.emit({
      bonNumber: this.isStation() ? this.bonNumber().trim() : undefined,
      operatorId: this.isStation() ? this.operatorId() : undefined,
      client: this.client().trim(),
      dateLivraison: this.dateLivraison(),
      statut: this.statut(),
      adresse: this.adresse().trim(),
      description: this.description().trim(),
      serviceLines: parseDocumentLineDrafts(this.serviceRows()),
      productLines: parseDocumentLineDrafts(this.productRows()),
      payments: this.payments(),
    });
  }
}

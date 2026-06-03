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
  label: string;
  editable: boolean;
  align: 'left' | 'right';
}

export const DOCUMENT_LINE_COLUMNS: DocumentLineColumnDef[] = [
  { key: 'reference', label: 'Réf.', editable: true, align: 'left' },
  { key: 'designation', label: 'Désignation', editable: true, align: 'left' },
  { key: 'quantity', label: 'Qté', editable: true, align: 'right' },
  { key: 'unit', label: 'Unité', editable: true, align: 'left' },
  { key: 'unitPriceHT', label: 'P.U. HT', editable: true, align: 'right' },
  { key: 'discountPercent', label: 'Rem. %', editable: true, align: 'right' },
  { key: 'vatPercent', label: 'TVA %', editable: true, align: 'right' },
  { key: 'amountHT', label: 'Montant HT', editable: false, align: 'right' },
  { key: 'amountTTC', label: 'Montant TTC', editable: false, align: 'right' },
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
  return base * (1 - discount / 100);
}

export function computeLineAmountTTC(
  line: Pick<
    DocumentLineTableRow,
    'quantity' | 'unitPriceHT' | 'discountPercent' | 'vatPercent'
  >,
): number {
  const ht = computeLineAmountHT(line);
  const vat = line.vatPercent ?? 0;
  return ht * (1 + vat / 100);
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
  return lines.reduce((sum, line) => sum + computeLineAmountHT(line), 0);
}

export function computeDocumentLinesTotalTTC(
  lines: Pick<
    DocumentLine,
    'quantity' | 'unitPriceHT' | 'discountPercent' | 'vatPercent'
  >[],
): number {
  return lines.reduce((sum, line) => sum + computeLineAmountTTC(line), 0);
}

export function computeDocumentLineTableTotalHT(rows: DocumentLineTableRow[]): number {
  return filledDocumentLineTableRows(rows).reduce(
    (sum, row) => sum + computeLineAmountHT(row),
    0,
  );
}

export function computeDocumentLineTableTotalTTC(rows: DocumentLineTableRow[]): number {
  return filledDocumentLineTableRows(rows).reduce(
    (sum, row) => sum + computeLineAmountTTC(row),
    0,
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

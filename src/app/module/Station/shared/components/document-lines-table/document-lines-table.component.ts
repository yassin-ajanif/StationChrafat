import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n';

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

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

export type EditableDocumentLineColumnKey = Exclude<DocumentLineColumnKey, 'amountHT' | 'amountTTC'>;

export interface DocumentLineColumnDef {
  key: DocumentLineColumnKey;
  labelKey: string;
  editable: boolean;
  align: 'left' | 'right';
}

export interface EditableDocumentLineColumnDef extends Omit<DocumentLineColumnDef, 'key' | 'editable'> {
  key: EditableDocumentLineColumnKey;
  editable: true;
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
  lines: Pick<DocumentLine, 'quantity' | 'unitPriceHT' | 'discountPercent'>[],
): number {
  return roundMoney(lines.reduce((sum, line) => sum + computeLineAmountHT(line), 0));
}

export function computeDocumentLinesTotalTTC(
  lines: Pick<DocumentLine, 'quantity' | 'unitPriceHT' | 'discountPercent' | 'vatPercent'>[],
): number {
  return roundMoney(lines.reduce((sum, line) => sum + computeLineAmountTTC(line), 0));
}

export function computeDocumentLineTableTotalHT(rows: DocumentLineTableRow[]): number {
  return roundMoney(
    filledDocumentLineTableRows(rows).reduce((sum, row) => sum + computeLineAmountHT(row), 0),
  );
}

export function computeDocumentLineTableTotalTTC(rows: DocumentLineTableRow[]): number {
  return roundMoney(
    filledDocumentLineTableRows(rows).reduce((sum, row) => sum + computeLineAmountTTC(row), 0),
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

@Component({
  selector: 'app-document-lines-table',
  imports: [LocaleNumberPipe, TranslatePipe],
  templateUrl: './document-lines-table.component.html',
  styleUrl: './document-lines-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentLinesTableComponent {
  readonly titleKey = input<string>('common.documentLines.services');
  readonly addRowLabelKey = input<string>('common.documentLines.addService');
  readonly rows = input.required<DocumentLineTableRow[]>();

  readonly sectionKind = computed((): 'services' | 'products' | 'returnedProducts' => {
    const key = this.titleKey();
    if (key.includes('returnedProducts')) {
      return 'returnedProducts';
    }
    if (key.includes('products')) {
      return 'products';
    }
    return 'services';
  });

  readonly rowChange = output<{ rowId: number; field: keyof DocumentLineTableRow; value: string | number | null }>();
  readonly addRowRequested = output<void>();
  readonly clearRowRequested = output<number>();

  readonly columns = DOCUMENT_LINE_COLUMNS;
  readonly editableColumns = DOCUMENT_LINE_COLUMNS.filter(
    (column): column is EditableDocumentLineColumnDef => column.editable,
  );
  readonly columnVisibility = signal<DocumentLineVisibility>(defaultDocumentLineVisibility());
  private readonly expandedRowIds = signal<ReadonlySet<number>>(new Set());

  readonly filledCount = () => filledDocumentLineTableRows(this.rows()).length;
  readonly totalHT = () => computeDocumentLineTableTotalHT(this.rows());
  readonly totalTTC = () => computeDocumentLineTableTotalTTC(this.rows());

  isColumnVisible(key: DocumentLineColumnKey): boolean {
    return this.columnVisibility()[key];
  }

  toggleColumn(key: DocumentLineColumnKey, checked: boolean): void {
    this.columnVisibility.update((current) => ({ ...current, [key]: checked }));
  }

  visibleColumnCount(): number {
    return this.columns.filter((column) => this.isColumnVisible(column.key)).length;
  }

  lineAmountHT(row: DocumentLineTableRow): number {
    return computeLineAmountHT(row);
  }

  lineAmountTTC(row: DocumentLineTableRow): number {
    return computeLineAmountTTC(row);
  }

  onTextInput(rowId: number, field: EditableDocumentLineColumnKey, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rowChange.emit({ rowId, field, value });
  }

  onNumberInput(rowId: number, field: EditableDocumentLineColumnKey, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const value = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.rowChange.emit({ rowId, field, value });
  }

  onColumnInput(rowId: number, column: DocumentLineColumnDef, event: Event): void {
    if (!column.editable) {
      return;
    }
    if (this.isTextColumn(column.key as EditableDocumentLineColumnKey)) {
      this.onTextInput(rowId, column.key as EditableDocumentLineColumnKey, event);
    } else {
      this.onNumberInput(rowId, column.key as EditableDocumentLineColumnKey, event);
    }
  }

  cellValue(row: DocumentLineTableRow, key: DocumentLineColumnKey): string | number | null {
    switch (key) {
      case 'reference':
        return row.reference;
      case 'designation':
        return row.designation;
      case 'quantity':
        return row.quantity;
      case 'unit':
        return row.unit;
      case 'unitPriceHT':
        return row.unitPriceHT;
      case 'discountPercent':
        return row.discountPercent;
      case 'vatPercent':
        return row.vatPercent;
      default:
        return null;
    }
  }

  isTextColumn(key: EditableDocumentLineColumnKey): boolean {
    return key === 'reference' || key === 'designation' || key === 'unit';
  }

  isRowExpanded(rowId: number): boolean {
    return this.expandedRowIds().has(rowId);
  }

  toggleRowExpanded(rowId: number): void {
    this.expandedRowIds.update((current) => {
      const next = new Set(current);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }

  rowSummary(row: DocumentLineTableRow): string {
    const designation = row.designation.trim();
    if (designation.length > 0) {
      return designation;
    }
    const reference = row.reference.trim();
    if (reference.length > 0) {
      return reference;
    }
    return '';
  }

  isRowSummaryEmpty(row: DocumentLineTableRow): boolean {
    return this.rowSummary(row).length === 0;
  }

  onAddRowRequested(): void {
    this.expandedRowIds.set(new Set());
    this.addRowRequested.emit();
  }
}

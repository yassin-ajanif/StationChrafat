import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n';
import {
  DOCUMENT_LINE_COLUMNS,
  DocumentLineColumnKey,
  DocumentLineTableRow,
  DocumentLineVisibility,
  computeDocumentLineTableTotalHT,
  computeDocumentLineTableTotalTTC,
  computeLineAmountHT,
  computeLineAmountTTC,
  defaultDocumentLineVisibility,
  filledDocumentLineTableRows,
} from '../../models/common/document-line.model';

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

  readonly rowChange = output<{ rowId: number; field: keyof DocumentLineTableRow; value: string | number | null }>();
  readonly addRowRequested = output<void>();
  readonly clearRowRequested = output<number>();

  readonly columns = DOCUMENT_LINE_COLUMNS;
  readonly columnVisibility = signal<DocumentLineVisibility>(defaultDocumentLineVisibility());

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

  onTextInput(rowId: number, field: keyof DocumentLineTableRow, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rowChange.emit({ rowId, field, value });
  }

  onNumberInput(rowId: number, field: keyof DocumentLineTableRow, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const value = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.rowChange.emit({ rowId, field, value });
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
}

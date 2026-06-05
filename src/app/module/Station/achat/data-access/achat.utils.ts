import { computeDocumentLinesTotalHT, computeDocumentLinesTotalTTC } from '../../shared/models/common/document-line.model';
import type { DocumentLine, DocumentLineDraft } from '../../shared/models/common/document-line.model';

export const DEFAULT_TVA_ACHAT = 20;

export function computeEffectiveTva(montantHT: number, montantTTC: number): number {
  if (montantHT <= 0) {
    return DEFAULT_TVA_ACHAT;
  }
  return Math.round(((montantTTC / montantHT - 1) * 100 + Number.EPSILON) * 100) / 100;
}

export function computeMontant(input: { serviceLines: DocumentLine[]; productLines: DocumentLine[] }): number {
  return (
    computeDocumentLinesTotalTTC(input.serviceLines) +
    computeDocumentLinesTotalTTC(input.productLines)
  );
}

export function computeMontantHT(input: { serviceLines: DocumentLine[]; productLines: DocumentLine[] }): number {
  return (
    computeDocumentLinesTotalHT(input.serviceLines) +
    computeDocumentLinesTotalHT(input.productLines)
  );
}

export function computeMontantTTC(input: { serviceLines: DocumentLine[]; productLines: DocumentLine[] }): number {
  return (
    computeDocumentLinesTotalTTC(input.serviceLines) +
    computeDocumentLinesTotalTTC(input.productLines)
  );
}

export function assignLineIds(lines: DocumentLineDraft[], startId = 1): DocumentLine[] {
  return lines.map((line, index) => ({ ...line, id: startId + index }));
}

export function nextNumber(existing: { numero: string }[], prefix: string): string {
  const nums = existing
    .filter((d) => d.numero.startsWith(prefix))
    .map((d) => parseInt(d.numero.replace(`${prefix}-`, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}

import {
  PaymentSplit,
  computePaymentDifference,
  computePaymentTotal,
  emptyPaymentSplit,
} from './payment-split.model';

export type NozzleStatus = 'active' | 'offline';

export type BombisteNozzlePayment = PaymentSplit;

export function emptyBombisteNozzlePayment(): BombisteNozzlePayment {
  return emptyPaymentSplit();
}

export function computeBombistePaymentTotal(payments: BombisteNozzlePayment): number {
  return computePaymentTotal(payments);
}

export function computeBombistePaymentDifference(
  payments: BombisteNozzlePayment,
  expectedAmount: number,
): number {
  return computePaymentDifference(payments, expectedAmount);
}

export interface NozzleIndexLine {
  id: number;
  nozzleId: number;
  bombisteId: number;
  island: string;
  pumpLabel: string;
  fuelCode: string;
  fuelLabel: string;
  fuelColor: string;
  indexEntree: number | null;
  indexSortie: number | null;
  tankReturn: number;
  unitPrice: number;
  status: NozzleStatus;
}

export interface NozzleIndexSessionSummary {
  totalLiters: number;
  totalAmount: number;
  offlinePumpLabels: string[];
  revenueCurrent: number;
  revenueGoal: number;
}

export function computeLineQuantity(line: NozzleIndexLine): number {
  if (line.status === 'offline' || line.indexEntree == null || line.indexSortie == null) {
    return 0;
  }
  const raw = line.indexEntree - line.indexSortie - line.tankReturn;
  return Math.max(0, raw);
}

export function computeLineTotal(line: NozzleIndexLine): number {
  return computeLineQuantity(line) * line.unitPrice;
}

export function computeSessionSummary(lines: NozzleIndexLine[]): NozzleIndexSessionSummary {
  const activeLines = lines.filter((l) => l.status === 'active');
  const totalLiters = activeLines.reduce((sum, l) => sum + computeLineQuantity(l), 0);
  const totalAmount = activeLines.reduce((sum, l) => sum + computeLineTotal(l), 0);
  const offlinePumpLabels = lines.filter((l) => l.status === 'offline').map((l) => l.pumpLabel);

  return {
    totalLiters,
    totalAmount,
    offlinePumpLabels,
    revenueCurrent: totalAmount,
    revenueGoal: 120_000,
  };
}

export function isLineValid(line: NozzleIndexLine): boolean {
  if (line.status === 'offline') {
    return true;
  }
  if (
    line.indexEntree == null ||
    line.indexSortie == null ||
    Number.isNaN(line.indexEntree) ||
    Number.isNaN(line.indexSortie)
  ) {
    return false;
  }
  return line.indexEntree >= line.indexSortie + line.tankReturn;
}

export interface NozzleLineWithTotals {
  line: NozzleIndexLine;
  quantity: number;
  total: number;
}

export interface NozzleBombisteGroup {
  bombisteId: number;
  bombisteName: string;
  rows: NozzleLineWithTotals[];
  totals: { liters: number; amount: number };
  payments: BombisteNozzlePayment;
  paymentTotal: number;
  paymentDifference: number;
}

export function mapLinesWithTotals(lines: NozzleIndexLine[]): NozzleLineWithTotals[] {
  return lines.map((line) => ({
    line,
    quantity: computeLineQuantity(line),
    total: computeLineTotal(line),
  }));
}

export function buildNozzleBombisteGroups(
  lines: NozzleIndexLine[],
  selectedBombisteIds: number[],
  operatorNameById: Map<number, string>,
  paymentsByBombisteId: Map<number, BombisteNozzlePayment> = new Map(),
): NozzleBombisteGroup[] {
  return selectedBombisteIds.map((bombisteId) => {
    const groupLines = lines.filter((line) => line.bombisteId === bombisteId);
    const rows = mapLinesWithTotals(groupLines);
    const active = rows.filter(({ line }) => line.status === 'active');
    const amount = active.reduce((sum, row) => sum + row.total, 0);
    const payments = paymentsByBombisteId.get(bombisteId) ?? emptyBombisteNozzlePayment();

    return {
      bombisteId,
      bombisteName: operatorNameById.get(bombisteId) ?? `Bombiste #${bombisteId}`,
      rows,
      totals: {
        liters: active.reduce((sum, row) => sum + row.quantity, 0),
        amount,
      },
      payments,
      paymentTotal: computeBombistePaymentTotal(payments),
      paymentDifference: computeBombistePaymentDifference(payments, amount),
    };
  });
}

export function canProceedNozzleStep(
  lines: NozzleIndexLine[],
  selectedBombisteIds: number[],
): boolean {
  if (selectedBombisteIds.length === 0) {
    return false;
  }
  const relevant = lines.filter((line) => selectedBombisteIds.includes(line.bombisteId));
  return relevant.length > 0 && relevant.every(isLineValid);
}

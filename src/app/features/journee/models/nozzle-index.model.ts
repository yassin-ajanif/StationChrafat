export type NozzleStatus = 'active' | 'offline';

export interface NozzleIndexLine {
  id: number;
  nozzleId: number;
  island: string;
  pumpLabel: string;
  fuelCode: string;
  fuelLabel: string;
  fuelColor: string;
  /** Index entrée (début). */
  indexEntree: number | null;
  /** Index sortie (fin). */
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

/** Quantité vendue (L) = index entrée − index sortie − remise cuve. */
export function computeLineQuantity(line: NozzleIndexLine): number {
  if (line.status === 'offline' || line.indexEntree == null || line.indexSortie == null) {
    return 0;
  }
  const raw = line.indexEntree - line.indexSortie - line.tankReturn;
  return Math.max(0, raw);
}

/** Montant (DH) = quantité × prix unitaire du carburant. */
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

export function canProceedNozzleStep(lines: NozzleIndexLine[]): boolean {
  return lines.every(isLineValid);
}

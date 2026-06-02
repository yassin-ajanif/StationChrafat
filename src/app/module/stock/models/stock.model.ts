export type NozzleLiveStatus = 'libre' | 'en_cours' | 'attente' | 'hors_service';

export type TankLevelStatus = 'optimal' | 'alerte' | 'critique';

export type FuelSignVariant = 'diesel' | 'super' | 'super-plus' | 'default';

export type CanopyFuelType = 'GASOIL' | 'SANS PLOMB' | 'EXCELLIUM';

export const CANOPY_FUEL_TYPES: readonly CanopyFuelType[] = [
  'GASOIL',
  'SANS PLOMB',
  'EXCELLIUM',
];

export interface NozzleLiveState {
  id: number;
  pumpLabel: string;
  lineNumber: number;
  fuelLabel: CanopyFuelType;
  currentIndexLiters: number;
  indexEntree: number | null;
  indexSortie: number | null;
  status: NozzleLiveStatus;
}

export interface TankLiveState {
  id: number;
  name: string;
  subtitle: string;
  currentLiters: number;
  maxCapacityLiters: number;
  sales24hLiters: number;
  status: TankLevelStatus;
}

export interface StockOverview {
  canopyName: string;
  lineCount: number;
  nozzles: NozzleLiveState[];
  tanks: TankLiveState[];
}

export interface CanopyLineFuelGroup {
  fuelLabel: CanopyFuelType;
  signVariant: FuelSignVariant;
  nozzles: NozzleLiveState[];
}

export interface CanopyLineGroup {
  lineNumber: number;
  fuelGroups: CanopyLineFuelGroup[];
  nozzles: NozzleLiveState[];
}

export const NOZZLE_STATUS_LABELS: Record<NozzleLiveStatus, string> = {
  libre: 'Libre',
  en_cours: 'En cours',
  attente: 'Attente Paiement',
  hors_service: 'Maintenance',
};

export const TANK_STATUS_LABELS: Record<TankLevelStatus, string> = {
  optimal: 'Statut Optimal',
  alerte: 'État d\'Alerte',
  critique: 'Statut Critique',
};

export function computeTankFillPercent(tank: TankLiveState): number {
  if (tank.maxCapacityLiters <= 0) {
    return 0;
  }
  return Math.round((tank.currentLiters / tank.maxCapacityLiters) * 100);
}

export function resolveFuelSignVariant(fuelLabel: CanopyFuelType | string): FuelSignVariant {
  const normalized = fuelLabel.toUpperCase();
  if (normalized.includes('GASOIL') || normalized.includes('DIESEL')) {
    return 'diesel';
  }
  if (normalized.includes('EXCELLIUM')) {
    return 'super-plus';
  }
  if (normalized.includes('SANS PLOMB') || normalized.includes('SUPER')) {
    return 'super';
  }
  return 'default';
}

export function groupNozzlesByLine(nozzles: NozzleLiveState[], lineCount = 4): CanopyLineGroup[] {
  return Array.from({ length: lineCount }, (_, index) => {
    const lineNumber = index + 1;
    const lineNozzles = nozzles.filter((nozzle) => nozzle.lineNumber === lineNumber);

    const fuelGroups = CANOPY_FUEL_TYPES.map((fuelLabel) => ({
      fuelLabel,
      signVariant: resolveFuelSignVariant(fuelLabel),
      nozzles: lineNozzles.filter((nozzle) => nozzle.fuelLabel === fuelLabel),
    }));

    const orderedNozzles = CANOPY_FUEL_TYPES.flatMap((fuelLabel) =>
      lineNozzles.filter((nozzle) => nozzle.fuelLabel === fuelLabel),
    );

    return { lineNumber, fuelGroups, nozzles: orderedNozzles };
  });
}

export function resolveTankStatusFromPercent(percent: number): TankLevelStatus {
  if (percent < 20) {
    return 'critique';
  }
  if (percent < 40) {
    return 'alerte';
  }
  return 'optimal';
}

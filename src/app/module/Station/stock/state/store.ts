export type NozzleLiveStatus = 'libre' | 'en_cours' | 'attente' | 'hors_service';

export type TankLevelStatus = 'optimal' | 'alerte' | 'critique';

export type FuelSignVariant = 'diesel' | 'super' | 'super-plus' | 'default';

export type CanopyFuelType = 'GASOIL' | 'SANS PLOMB' | 'EXCELLIUM';

export type StockGestionTab = 'carburant' | 'vidange' | 'lavage';

export type StockGestionSummaryAccent = 'carburant' | 'vidange' | 'lavage' | 'total';

export type StockProductStatus = 'optimal' | 'critique';

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

export interface StockGestionSummary {
  id: number;
  label: string;
  valueDh: number;
  trendPercent: number;
  accent?: StockGestionSummaryAccent;
}

export interface StockProduct {
  id: number;
  name: string;
  subtitle: string;
  categoryLabel: string;
  currentStock: number;
  unit: string;
  threshold: number;
  stockStatus: StockProductStatus;
  tab: StockGestionTab;
}


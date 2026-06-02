import { DepenseLine } from './depense.model';
import { EncaissementLine } from './encaissement.model';
import { LavageBon } from './lavage-bon.model';
import { NozzleIndexLine } from './nozzle-index.model';
import { VidangeBon } from './vidange-bon.model';

export type JourneeStatus = 'brouillon' | 'en_cours' | 'soumise' | 'cloturee';

export type ShiftSlot = 'Matin' | 'Apres-midi' | 'Nuit';

export interface Operator {
  id: number;
  name: string;
  avatarUrl?: string;
}

export interface JourneeSummary {
  id: number;
  date: string;
  dateLabel: string;
  status: JourneeStatus;
  caTotal: number;
  chefDePiste: Operator;
}

export interface JourneeKpis {
  closedCount: number;
  monthlyRevenue: number;
  monthlyRevenueDeltaPercent: number;
  avgCashDiscrepancy: number;
  cashDiscrepancyThreshold: number;
}

export interface JourneeDraftConfig {
  chefDePisteId: number | null;
  bombisteId: number | null;
  shiftSlot: ShiftSlot | null;
  openedAt: string;
}

export interface JourneeDraft {
  id: number | null;
  config: JourneeDraftConfig;
  nozzleIndexes: NozzleIndexLine[];
  lavageBons: LavageBon[];
  vidangeBons: VidangeBon[];
  encaissements: EncaissementLine[];
  depenses: DepenseLine[];
}

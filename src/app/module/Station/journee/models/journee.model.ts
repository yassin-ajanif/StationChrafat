import { DepenseLine } from './depense.model';
import { EncaissementLine } from './encaissement.model';
import { LavageBon } from './lavage-bon.model';
import { NozzleIndexLine, BombisteNozzlePayment } from './nozzle-index.model';
import { VidangeBon } from './vidange-bon.model';

export type JourneeStatus = 'brouillon' | 'en_cours' | 'soumise' | 'cloturee';

export type ShiftSlot = 'Matin' | 'Apres-midi' | 'Nuit';

export interface Operator {
  id: number;
  name: string;
  avatarUrl?: string;
}

export function resolveOperatorName(operators: Operator[], operatorId: number | null): string {
  if (operatorId == null) {
    return '—';
  }
  return operators.find((operator) => operator.id === operatorId)?.name ?? '—';
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
  shiftSlot: ShiftSlot | null;
  openedAt: string;
}

export interface JourneeDraft {
  id: number | null;
  config: JourneeDraftConfig;
  /** Bombistes sélectionnés à l'étape index pistolets (ordre d'ajout). */
  selectedNozzleBombisteIds: number[];
  /** Répartition espèces / TPE / bons par bombiste (étape index pistolets). */
  nozzleBombistePayments: BombisteNozzlePaymentEntry[];
  /** Chef vidange / lavage sélectionné à l'étape bons lavage. */
  lavageChefVidangeLavageId: number | null;
  /** Chef vidange / lavage sélectionné à l'étape bons vidange. */
  vidangeChefVidangeLavageId: number | null;
  nozzleIndexes: NozzleIndexLine[];
  lavageBons: LavageBon[];
  vidangeBons: VidangeBon[];
  encaissements: EncaissementLine[];
  depenses: DepenseLine[];
}

export interface BombisteNozzlePaymentEntry extends BombisteNozzlePayment {
  bombisteId: number;
}

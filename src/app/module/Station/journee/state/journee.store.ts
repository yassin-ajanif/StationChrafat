import type { DocumentLine, DocumentLineDraft, DocumentLineTableRow } from '../../shared/components/document-lines-table/document-lines-table.component';
import type { PaymentSplit } from '../../shared/components/bon-recap-payments/bon-recap-payments.component';

export type { PaymentSplit };

// ---------------------------------------------------------------------------
// Station bon (bons-step3)
// ---------------------------------------------------------------------------

export type StationBonStatut = 'planifiee' | 'en_cours' | 'livree' | 'annulee';

export type StationBonLine = DocumentLine;
export type StationBonLineDraft = DocumentLineDraft;
export type StationBonLineTableRow = DocumentLineTableRow;

export interface StationBon {
  id: number;
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  operatorId: number;
  dateLivraison: string;
  statut: StationBonStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLine[];
  productLines: StationBonLine[];
  payments: PaymentSplit;
  fuelTransmittedFromNozzles?: boolean;
}

export interface StationBonDraftInput {
  bonNumber: string;
  partnerRef: string;
  chefVidangeLavageId: number;
  operatorId: number;
  dateLivraison: string;
  statut: StationBonStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLineDraft[];
  productLines: StationBonLineDraft[];
  payments: PaymentSplit;
}

/** Dialog edit payload for the station (journee) variant. */
export interface StationBonFormEditValue {
  bonNumber: string;
  operatorId: number;
  client: string;
  dateLivraison: string;
  statut: StationBonStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLine[];
  productLines: StationBonLine[];
  payments: PaymentSplit;
}

/** Dialog save payload for the station (journee) variant — chef is attached by the page. */
export interface StationBonFormDraft {
  bonNumber: string;
  operatorId: number;
  client: string;
  dateLivraison: string;
  statut: StationBonStatut;
  adresse: string;
  description: string;
  serviceLines: StationBonLineDraft[];
  productLines: StationBonLineDraft[];
  payments: PaymentSplit;
}

// ---------------------------------------------------------------------------
// Shared — list & KPIs (outside wizard draft)
// ---------------------------------------------------------------------------

export type JourneeStatus = 'brouillon' | 'en_cours' | 'soumise' | 'cloturee';

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

// ---------------------------------------------------------------------------
// Part 1 — configuration-step1
// ---------------------------------------------------------------------------

export interface ConfigurationStep1 {
  isValid: boolean;
  journeeId: number | null;
  chefDePisteId: number | null;
  shiftSlot: ShiftSlot | null;
  openedAt: string;
}

export const initialConfigurationStep1 = (): ConfigurationStep1 => ({
  isValid: false,
  journeeId: null,
  chefDePisteId: null,
  shiftSlot: null,
  openedAt: new Date().toISOString(),
});

export type ShiftSlot = 'Matin' | 'Apres-midi' | 'Nuit';

// ---------------------------------------------------------------------------
// Part 2 — index-pistoles-step2
// ---------------------------------------------------------------------------

export interface IndexPistolesStep2 {
  isValid: boolean;
  selectedBombisteIds: number[];
  bombistePayments: BombisteNozzlePaymentEntry[];
  lines: NozzleIndexLine[];
}

export const initialIndexPistolesStep2 = (): IndexPistolesStep2 => ({
  isValid: false,
  selectedBombisteIds: [],
  bombistePayments: [],
  lines: [],
});

export type NozzleStatus = 'active' | 'offline';

export type BombisteNozzlePayment = PaymentSplit;

export interface BombisteNozzlePaymentEntry extends BombisteNozzlePayment {
  bombisteId: number;
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

// ---------------------------------------------------------------------------
// Part 3 — bons-step3
// ---------------------------------------------------------------------------

export interface BonsStep3 {
  isValid: boolean;
  chefId: number | null;
  items: StationBon[];
}

export const initialBonsStep3 = (): BonsStep3 => ({
  isValid: false,
  chefId: null,
  items: [],
});

export interface JourneeBonsStepConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  guardRedirectIfNoDraft?: readonly string[];
  chefSelectLabel: string;
  headerIcon: string;
}

export const JOURNEE_BON_CONFIG: JourneeBonsStepConfig = {
  title: 'journee.bons.title',
  description: 'journee.bons.description',
  backLink: ['/journees', 'nouvelle', 'index-pistoles-step2'],
  nextLink: ['/journees', 'nouvelle', 'encaissements-step5'],
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
  chefSelectLabel: 'journee.bons.chefLabel',
  headerIcon: '📋',
};

// ---------------------------------------------------------------------------
// Part 4 — encaissements-step4
// ---------------------------------------------------------------------------

export interface EncaissementsStep4 {
  isValid: boolean;
  lines: EncaissementLine[];
}

export const initialEncaissementsStep4 = (): EncaissementsStep4 => ({
  isValid: true,
  lines: [],
});

export const ENCAISSEMENT_DIVERS_CLIENT_ID = 0;

export const PAYMENT_MODES = ['CMI', 'TAQ', 'BON'] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

export interface EncaissementClientOption {
  id: number;
  label: string;
  currentBalance: number | null;
}

export interface EncaissementLine {
  id: number;
  clientId: number | null;
  paymentMode: PaymentMode | '';
  amount: number;
  note: string;
}

export interface EncaissementLinePatch {
  clientId?: number | null;
  paymentMode?: PaymentMode | '';
  amount?: number;
  note?: string;
}

// ---------------------------------------------------------------------------
// Part 5 — depenses-step6
// ---------------------------------------------------------------------------

export interface DepensesStep6 {
  isValid: boolean;
  lines: DepenseLine[];
}

export const initialDepensesStep6 = (): DepensesStep6 => ({
  isValid: true,
  lines: [],
});

export const EXPENSE_TYPES = [
  'Achat Fournitures',
  'Entretien station',
  'Carburant véhicule',
  'Frais divers',
  'Autre',
] as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export const DEPENSE_PAYMENT_MODES = [
  'Espèces (Caisse)',
  'Chèque',
  'Virement',
] as const;

export type DepensePaymentMode = (typeof DEPENSE_PAYMENT_MODES)[number];

export const DEFAULT_DEPENSE_PAYMENT_MODE: DepensePaymentMode = 'Espèces (Caisse)';

export interface DepenseLine {
  id: number;
  expenseType: ExpenseType | '';
  description: string;
  amount: number;
  paymentMode: DepensePaymentMode | '';
  note: string;
}

export interface DepenseLinePatch {
  expenseType?: ExpenseType | '';
  description?: string;
  amount?: number;
  paymentMode?: DepensePaymentMode | '';
  note?: string;
}

// ---------------------------------------------------------------------------
// Wizard draft root
// ---------------------------------------------------------------------------

export interface JourneeDraft {
  configurationStep1: ConfigurationStep1;
  indexPistolesStep2: IndexPistolesStep2;
  bonsStep3: BonsStep3;
  encaissementsStep4: EncaissementsStep4;
  depensesStep6: DepensesStep6;
}

export const initialJourneeDraft = (): JourneeDraft => ({
  configurationStep1: initialConfigurationStep1(),
  indexPistolesStep2: initialIndexPistolesStep2(),
  bonsStep3: initialBonsStep3(),
  encaissementsStep4: initialEncaissementsStep4(),
  depensesStep6: initialDepensesStep6(),
});

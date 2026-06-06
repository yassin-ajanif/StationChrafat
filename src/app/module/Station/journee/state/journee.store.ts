import { StationBon, computeBonServicesAmount, computeBonProductsAmount } from '../../shared/models/bon';
import { PaymentSplit, emptyPaymentSplit, computePaymentTotal, computePaymentDifference } from '../../shared/models/common/payment-split.model';
export type { PaymentSplit };
export { emptyPaymentSplit, computePaymentTotal, computePaymentDifference };

/* ───── Journee model ───── */

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
  selectedNozzleBombisteIds: number[];
  nozzleBombistePayments: BombisteNozzlePaymentEntry[];
  stationBonsChefId: number | null;
  nozzleIndexes: NozzleIndexLine[];
  stationBons: StationBon[];
  encaissements: EncaissementLine[];
  depenses: DepenseLine[];
}

export interface BombisteNozzlePaymentEntry extends BombisteNozzlePayment {
  bombisteId: number;
}

/* ───── Nozzle index model ───── */

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

/* ───── Journee validation model ───── */

export interface ValidationExtras {
  shopProducts: number;
  debtSettlements: number;
  cardRecharges: number;
}

export interface NonCashDetailRow {
  paymentType: string;
  reference: string;
  amount: number;
}

export interface FuelSalesBombisteDetail {
  bombisteId: number;
  bombisteName: string;
  liters: number;
  salesTotal: number;
  payments: PaymentSplit;
}

export interface ChefSalesDetail {
  chefId: number;
  chefName: string;
  salesTotal: number;
  payments: PaymentSplit;
}

export interface JourneeValidationSummary {
  revenue: {
    fuelSales: number;
    fuelSalesByBombiste: FuelSalesBombisteDetail[];
    shopProducts: number;
    shopProductsByChef: ChefSalesDetail[];
    services: number;
    servicesByChef: ChefSalesDetail[];
    grossTotal: number;
  };
  cashMovements: {
    nonCashCollections: number;
    authorizedExpenses: number;
    debtSettlements: number;
    cardRecharges: number;
  };
  netCashToRemit: number;
  remittanceOperatorName: string;
  nonCashDetails: NonCashDetailRow[];
}

const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CMI: 'Cartes Bancaires (TPE)',
  TAQ: 'Cartes Flotte (Total/Shell)',
  BON: 'Bons Carburant (Secteur Public)',
};

export function formatRemittanceOperatorName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return name;
  }
  const initial = parts[0][0]?.toUpperCase() ?? '';
  const last = parts[parts.length - 1].toUpperCase();
  return `${initial}. ${last}`;
}

export function resolveRemittanceOperator(
  operators: Operator[],
  chefDePisteId: number | null,
): string {
  const operator = operators.find((o) => o.id === chefDePisteId);
  return operator ? formatRemittanceOperatorName(operator.name) : '—';
}

function buildNonCashReference(mode: PaymentMode, count: number, refs: string[]): string {
  if (refs.length > 0) {
    return refs.join(' / ');
  }
  if (mode === 'BON') {
    return count === 1 ? '1 Bon' : `${count} Bons`;
  }
  return count === 1 ? '1 Transaction' : `${count} Transactions`;
}

export function buildNonCashDetails(lines: EncaissementLine[]): NonCashDetailRow[] {
  const filled = lines.filter(isEncaissementLineFilled);
  const grouped = new Map<PaymentMode, { count: number; amount: number; refs: string[] }>();

  for (const line of filled) {
    if (line.paymentMode === '') {
      continue;
    }
    const mode = line.paymentMode as PaymentMode;
    const existing = grouped.get(mode) ?? { count: 0, amount: 0, refs: [] };
    existing.count += 1;
    existing.amount += line.amount;
    if (line.note.trim()) {
      existing.refs.push(line.note.trim());
    }
    grouped.set(mode, existing);
  }

  return Array.from(grouped.entries()).map(([mode, data]) => ({
    paymentType: PAYMENT_MODE_LABELS[mode],
    reference: buildNonCashReference(mode, data.count, data.refs),
    amount: data.amount,
  }));
}

function sumPaymentSplits(a: PaymentSplit, b: PaymentSplit): PaymentSplit {
  return {
    cash: a.cash + b.cash,
    tpe: a.tpe + b.tpe,
    bons: a.bons + b.bons,
  };
}

function scalePaymentSplit(payments: PaymentSplit, ratio: number): PaymentSplit {
  return {
    cash: payments.cash * ratio,
    tpe: payments.tpe * ratio,
    bons: payments.bons * ratio,
  };
}

function accumulateChefSales(
  byChef: Map<number, { total: number; payments: PaymentSplit }>,
  chefId: number,
  amount: number,
  payments: PaymentSplit,
): void {
  if (amount <= 0) {
    return;
  }
  const existing = byChef.get(chefId) ?? { total: 0, payments: emptyPaymentSplit() };
  byChef.set(chefId, {
    total: existing.total + amount,
    payments: sumPaymentSplits(existing.payments, payments),
  });
}

function processBonForChefSales(
  byChef: Map<number, { total: number; payments: PaymentSplit }>,
  chefId: number,
  servicesAmount: number,
  productsAmount: number,
  payments: PaymentSplit,
  kind: 'services' | 'products',
): void {
  const amount = kind === 'services' ? servicesAmount : productsAmount;
  if (amount <= 0) {
    return;
  }
  const bonTotal = servicesAmount + productsAmount;
  const ratio = bonTotal > 0 ? amount / bonTotal : 0;
  accumulateChefSales(byChef, chefId, amount, scalePaymentSplit(payments, ratio));
}

export function buildChefSalesDetailsFromBons(
  stationBons: StationBon[],
  operators: Operator[],
  kind: 'services' | 'products',
): ChefSalesDetail[] {
  const byChef = new Map<number, { total: number; payments: PaymentSplit }>();

  for (const bon of stationBons) {
    processBonForChefSales(
      byChef,
      bon.chefVidangeLavageId,
      computeBonServicesAmount(bon),
      computeBonProductsAmount(bon),
      bon.payments ?? emptyPaymentSplit(),
      kind,
    );
  }

  return Array.from(byChef.entries())
    .map(([chefId, data]) => ({
      chefId,
      chefName: resolveOperatorName(operators, chefId),
      salesTotal: data.total,
      payments: data.payments,
    }))
    .filter((detail) => detail.salesTotal > 0)
    .sort((a, b) => a.chefName.localeCompare(b.chefName, 'fr'));
}

export function buildJourneeValidationSummary(input: {
  fuelSales: number;
  fuelSalesByBombiste: FuelSalesBombisteDetail[];
  stationBons: StationBon[];
  servicesTotal: number;
  encaissementsTotal: number;
  depensesTotal: number;
  encaissements: EncaissementLine[];
  extras: ValidationExtras;
  operators: Operator[];
  chefDePisteId: number | null;
}): JourneeValidationSummary {
  const servicesByChef = buildChefSalesDetailsFromBons(
    input.stationBons,
    input.operators,
    'services',
  );
  const shopProductsByChef = buildChefSalesDetailsFromBons(
    input.stationBons,
    input.operators,
    'products',
  );

  const grossTotal =
    input.fuelSales + input.extras.shopProducts + input.servicesTotal;

  const netCashToRemit =
    grossTotal -
    input.encaissementsTotal -
    input.depensesTotal +
    input.extras.debtSettlements +
    input.extras.cardRecharges;

  return {
    revenue: {
      fuelSales: input.fuelSales,
      fuelSalesByBombiste: input.fuelSalesByBombiste,
      shopProducts: input.extras.shopProducts,
      shopProductsByChef,
      services: input.servicesTotal,
      servicesByChef,
      grossTotal,
    },
    cashMovements: {
      nonCashCollections: input.encaissementsTotal,
      authorizedExpenses: input.depensesTotal,
      debtSettlements: input.extras.debtSettlements,
      cardRecharges: input.extras.cardRecharges,
    },
    netCashToRemit,
    remittanceOperatorName: resolveRemittanceOperator(
      input.operators,
      input.chefDePisteId,
    ),
    nonCashDetails: buildNonCashDetails(input.encaissements),
  };
}

/* ───── Depense model ───── */

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

export function isDepenseLineFilled(line: DepenseLine): boolean {
  return line.expenseType !== '' && line.amount > 0;
}

export function isDepenseLineEmpty(line: DepenseLine): boolean {
  return (
    line.expenseType === '' &&
    line.description.trim() === '' &&
    line.amount === 0 &&
    line.note.trim() === ''
  );
}

export function computeDepensesTotal(lines: DepenseLine[]): number {
  return lines.filter(isDepenseLineFilled).reduce((sum, line) => sum + line.amount, 0);
}

export function canProceedDepensesStep(_lines: DepenseLine[]): boolean {
  return true;
}

export function createEmptyDepenseLine(id: number): DepenseLine {
  return {
    id,
    expenseType: '',
    description: '',
    amount: 0,
    paymentMode: DEFAULT_DEPENSE_PAYMENT_MODE,
    note: '',
  };
}

export function parseExpenseType(value: string): ExpenseType | '' {
  return (EXPENSE_TYPES as readonly string[]).includes(value) ? (value as ExpenseType) : '';
}

export function parseDepensePaymentMode(value: string): DepensePaymentMode | '' {
  return (DEPENSE_PAYMENT_MODES as readonly string[]).includes(value)
    ? (value as DepensePaymentMode)
    : '';
}

/* ───── Encaissement model ───── */

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

export function resolveClientLabel(
  clientId: number | null,
  clients: EncaissementClientOption[],
): string {
  if (clientId == null) {
    return '';
  }
  return clients.find((c) => c.id === clientId)?.label ?? '';
}

export function resolveClientBalance(
  clientId: number | null,
  clients: EncaissementClientOption[],
): number | null {
  if (clientId == null) {
    return null;
  }
  return clients.find((c) => c.id === clientId)?.currentBalance ?? null;
}

export function isEncaissementLineFilled(line: EncaissementLine): boolean {
  return line.clientId != null && line.paymentMode !== '' && line.amount > 0;
}

export function isEncaissementLineEmpty(line: EncaissementLine): boolean {
  return (
    line.clientId == null &&
    line.paymentMode === '' &&
    line.amount === 0 &&
    line.note.trim() === ''
  );
}

export function computeEncaissementsTotal(lines: EncaissementLine[]): number {
  return lines
    .filter(isEncaissementLineFilled)
    .reduce((sum, line) => sum + line.amount, 0);
}

export function canProceedEncaissementsStep(_lines: EncaissementLine[]): boolean {
  return true;
}

export function createEmptyEncaissementLine(id: number): EncaissementLine {
  return {
    id,
    clientId: null,
    paymentMode: '',
    amount: 0,
    note: '',
  };
}

export function parsePaymentMode(value: string): PaymentMode | '' {
  return (PAYMENT_MODES as readonly string[]).includes(value)
    ? (value as PaymentMode)
    : '';
}

export function isDiversClient(clientId: number | null): boolean {
  return clientId === ENCAISSEMENT_DIVERS_CLIENT_ID;
}

import { EncaissementLine, PaymentMode, isEncaissementLineFilled } from './encaissement.model';
import { Operator, resolveOperatorName } from './journee.model';
import { LavageBon, computeBonProductsAmount as computeLavageBonProductsAmount, computeBonServicesAmount as computeLavageBonServicesAmount } from './lavage-bon.model';
import { PaymentSplit, emptyPaymentSplit } from './payment-split.model';
import { VidangeBon, computeBonProductsAmount as computeVidangeBonProductsAmount, computeBonServicesAmount as computeVidangeBonServicesAmount } from './vidange-bon.model';

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
  lavageBons: LavageBon[],
  vidangeBons: VidangeBon[],
  operators: Operator[],
  kind: 'services' | 'products',
): ChefSalesDetail[] {
  const byChef = new Map<number, { total: number; payments: PaymentSplit }>();

  for (const bon of lavageBons) {
    processBonForChefSales(
      byChef,
      bon.chefVidangeLavageId,
      computeLavageBonServicesAmount(bon),
      computeLavageBonProductsAmount(bon),
      bon.payments ?? emptyPaymentSplit(),
      kind,
    );
  }
  for (const bon of vidangeBons) {
    processBonForChefSales(
      byChef,
      bon.chefVidangeLavageId,
      computeVidangeBonServicesAmount(bon),
      computeVidangeBonProductsAmount(bon),
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
  lavageBons: LavageBon[];
  vidangeBons: VidangeBon[];
  servicesTotal: number;
  encaissementsTotal: number;
  depensesTotal: number;
  encaissements: EncaissementLine[];
  extras: ValidationExtras;
  operators: Operator[];
  chefDePisteId: number | null;
}): JourneeValidationSummary {
  const servicesByChef = buildChefSalesDetailsFromBons(
    input.lavageBons,
    input.vidangeBons,
    input.operators,
    'services',
  );
  const shopProductsByChef = buildChefSalesDetailsFromBons(
    input.lavageBons,
    input.vidangeBons,
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

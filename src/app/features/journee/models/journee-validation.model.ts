import { EncaissementLine, PaymentMode, isEncaissementLineFilled } from './encaissement.model';
import { Operator } from './journee.model';

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

export interface JourneeValidationSummary {
  revenue: {
    fuelSales: number;
    shopProducts: number;
    services: number;
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
  bombisteId: number | null,
): string {
  const operator =
    operators.find((o) => o.id === bombisteId) ??
    operators.find((o) => o.id === chefDePisteId);
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

export function buildJourneeValidationSummary(input: {
  fuelSales: number;
  servicesTotal: number;
  encaissementsTotal: number;
  depensesTotal: number;
  encaissements: EncaissementLine[];
  extras: ValidationExtras;
  operators: Operator[];
  chefDePisteId: number | null;
  bombisteId: number | null;
}): JourneeValidationSummary {
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
      shopProducts: input.extras.shopProducts,
      services: input.servicesTotal,
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
      input.bombisteId,
    ),
    nonCashDetails: buildNonCashDetails(input.encaissements),
  };
}

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

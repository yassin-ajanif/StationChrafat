/** Special client id for miscellaneous non-client collections. */
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

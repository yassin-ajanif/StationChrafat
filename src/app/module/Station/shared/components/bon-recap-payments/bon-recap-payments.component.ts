import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LocaleCurrencyPipe, LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n';
import { roundMoney } from '../document-lines-table/document-lines-table.component';

export interface PaymentSplit {
  cash: number;
  tpe: number;
  bons: number;
}

export function emptyPaymentSplit(): PaymentSplit {
  return { cash: 0, tpe: 0, bons: 0 };
}

export function computePaymentTotal(payments: PaymentSplit): number {
  return roundMoney(payments.cash + payments.tpe + payments.bons);
}

export function computePaymentDifference(payments: PaymentSplit, expectedAmount: number): number {
  return roundMoney(computePaymentTotal(payments) - roundMoney(expectedAmount));
}

export function paymentDifferenceLabel(difference: number): string {
  if (roundMoney(difference) === 0) {
    return 'Équilibré';
  }
  return difference > 0 ? 'Surplus' : 'Manque';
}

export function isPaymentSplitBalanced(payments: PaymentSplit, expectedAmount: number): boolean {
  return computePaymentDifference(payments, expectedAmount) === 0;
}

@Component({
  selector: 'app-bon-recap-payments',
  imports: [LocaleCurrencyPipe, LocaleNumberPipe, TranslatePipe],
  templateUrl: './bon-recap-payments.component.html',
  styleUrl: './bon-recap-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonRecapPaymentsComponent {
  readonly serviceTotal = input(0);
  readonly productTotal = input(0);
  readonly bonTotal = input(0);
  readonly payments = input.required<PaymentSplit>();
  /** Prefix for input ids (e.g. lavage, vidange) to avoid duplicates when multiple dialogs exist. */
  readonly inputIdPrefix = input('bon');

  readonly paymentsChange = output<PaymentSplit>();

  readonly paymentTotal = computed(() => computePaymentTotal(this.payments()));

  readonly paymentDifference = computed(() =>
    computePaymentDifference(this.payments(), this.bonTotal()),
  );

  paymentDifferenceLabelKey(difference: number): string {
    if (difference === 0) {
      return 'common.payment.balanced';
    }
    return difference > 0 ? 'common.payment.surplus' : 'common.payment.shortage';
  }

  onPaymentInput(field: keyof PaymentSplit, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const value = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.paymentsChange.emit({ ...this.payments(), [field]: value });
  }
}

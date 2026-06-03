import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  PaymentSplit,
  computePaymentDifference,
  computePaymentTotal,
  paymentDifferenceLabel,
} from '../../models/common/payment-split.model';

@Component({
  selector: 'app-bon-recap-payments',
  imports: [DecimalPipe],
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

  readonly paymentDifferenceLabel = paymentDifferenceLabel;

  onPaymentInput(field: keyof PaymentSplit, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const value = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.paymentsChange.emit({ ...this.payments(), [field]: value });
  }
}

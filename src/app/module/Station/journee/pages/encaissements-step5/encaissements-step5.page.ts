import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  PAYMENT_MODES,
  PaymentMode,
  isEncaissementLineEmpty,
  parsePaymentMode,
  resolveClientBalance,
} from '../../models/encaissement.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedEncaissementsStep,
  selectDraft,
  selectEncaissementClients,
  selectEncaissementClientsError,
  selectEncaissementClientsLoading,
  selectEncaissements,
  selectEncaissementsError,
  selectEncaissementsLoading,
  selectEncaissementsTotal,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-encaissements-step5-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './encaissements-step5.page.html',
  styleUrl: './encaissements-step5.page.scss',
})
export class EncaissementsStep5Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly lines = this.store.selectSignal(selectEncaissements);
  readonly clients = this.store.selectSignal(selectEncaissementClients);
  readonly total = this.store.selectSignal(selectEncaissementsTotal);
  readonly loading = this.store.selectSignal(selectEncaissementsLoading);
  readonly clientsLoading = this.store.selectSignal(selectEncaissementClientsLoading);
  readonly loadError = this.store.selectSignal(selectEncaissementsError);
  readonly clientsError = this.store.selectSignal(selectEncaissementClientsError);
  readonly canProceed = this.store.selectSignal(selectCanProceedEncaissementsStep);

  readonly paymentModes = PAYMENT_MODES;

  readonly resolveClientBalance = resolveClientBalance;

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadEncaissementClients());
    this.store.dispatch(JourneeActions.loadEncaissements());
  }

  addLine(): void {
    this.store.dispatch(JourneeActions.addEncaissementLine());
  }

  updateClientId(lineId: number, event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const clientId = raw === '' ? null : Number(raw);
    this.store.dispatch(
      JourneeActions.updateEncaissementLine({
        id: lineId,
        patch: { clientId: Number.isNaN(clientId) ? null : clientId },
      }),
    );
  }

  updatePaymentMode(lineId: number, event: Event): void {
    const paymentMode = parsePaymentMode((event.target as HTMLSelectElement).value);
    this.store.dispatch(
      JourneeActions.updateEncaissementLine({ id: lineId, patch: { paymentMode } }),
    );
  }

  updateAmount(lineId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const amount = Number.isNaN(parsed) ? 0 : parsed;
    this.store.dispatch(
      JourneeActions.updateEncaissementLine({ id: lineId, patch: { amount } }),
    );
  }

  updateNote(lineId: number, event: Event): void {
    const note = (event.target as HTMLInputElement).value;
    this.store.dispatch(
      JourneeActions.updateEncaissementLine({ id: lineId, patch: { note } }),
    );
  }

  removeLine(lineId: number): void {
    this.store.dispatch(JourneeActions.removeEncaissementLine({ id: lineId }));
  }

  canRemoveLine(line: { id: number; clientId: number | null; paymentMode: PaymentMode | ''; amount: number; note: string }): boolean {
    return !isEncaissementLineEmpty(line);
  }

  next(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(['/journees', 'nouvelle', 'depenses-step6']);
  }
}

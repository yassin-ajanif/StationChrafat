import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { LocaleNumberPipe, TranslatePipe } from '../../../../../core/i18n'
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  WizardStepErrorsComponent,
  type WizardStepError,
} from '../../../../../shared/components/wizard-step-errors/wizard-step-errors.component';
import {
  EncaissementClientOption,
  EncaissementLine,
  PAYMENT_MODES,
  PaymentMode,
} from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectEncaissementClients,
  selectEncaissementClientsError,
  selectEncaissementClientsLoading,
  selectEncaissements,
  selectEncaissementsError,
  selectEncaissementsLoading,
  selectJourneeDraftId,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-encaissements-step4-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, WizardStepErrorsComponent, LocaleNumberPipe, TranslatePipe],
  templateUrl: './encaissements-step4.page.html',
  styleUrl: './encaissements-step4.page.scss',
})
export class EncaissementsStep5Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly lines = this.store.selectSignal(selectEncaissements);
  readonly clients = this.store.selectSignal(selectEncaissementClients);
  readonly total = computed(() =>
    this.lines()
      .filter(isEncaissementLineFilled)
      .reduce((sum, line) => sum + line.amount, 0),
  );
  readonly loading = this.store.selectSignal(selectEncaissementsLoading);
  readonly clientsLoading = this.store.selectSignal(selectEncaissementClientsLoading);
  readonly loadError = this.store.selectSignal(selectEncaissementsError);
  readonly clientsError = this.store.selectSignal(selectEncaissementClientsError);

  readonly paymentModes = PAYMENT_MODES;

  readonly stepIsValid = computed(() => this.stepValidationErrors().length === 0);

  readonly stepValidationErrors = computed((): WizardStepError[] => {
    const errors: WizardStepError[] = [];
    this.lines().forEach((line, index) => {
      if (!isEncaissementLineFilled(line) && !isEncaissementLineEmpty(line)) {
        errors.push({
          key: 'journee.validation.errors.incompleteLine',
          params: { line: index + 1 },
        });
      }
    });
    return errors;
  });

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchEncaissementsStep4({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    if (this.journeeId() == null) {
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

  canRemoveLine(line: EncaissementLine): boolean {
    return !isEncaissementLineEmpty(line);
  }

  resolveClientBalance(clientId: number | null, clients: EncaissementClientOption[]): number | null {
    if (clientId == null) {
      return null;
    }
    return clients.find((client) => client.id === clientId)?.currentBalance ?? null;
  }

  next(): void {
    void this.router.navigate(['/journees', 'nouvelle', 'depenses-step5']);
  }
}

function isEncaissementLineFilled(line: EncaissementLine): boolean {
  return line.clientId != null && line.paymentMode !== '' && line.amount > 0;
}

function isEncaissementLineEmpty(line: EncaissementLine): boolean {
  return (
    line.clientId == null &&
    line.paymentMode === '' &&
    line.amount === 0 &&
    line.note.trim() === ''
  );
}

function parsePaymentMode(value: string): PaymentMode | '' {
  return (PAYMENT_MODES as readonly string[]).includes(value) ? (value as PaymentMode) : '';
}

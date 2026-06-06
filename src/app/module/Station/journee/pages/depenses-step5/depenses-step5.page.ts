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
  DEPENSE_PAYMENT_MODES,
  DepenseLine,
  EXPENSE_TYPES,
} from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectDepenses,
  selectDepensesError,
  selectDepensesLoading,
  selectJourneeDraftId,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-depenses-step5-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, WizardStepErrorsComponent, LocaleNumberPipe, TranslatePipe],
  templateUrl: './depenses-step5.page.html',
  styleUrl: './depenses-step5.page.scss',
})
export class DepensesStep5Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly lines = this.store.selectSignal(selectDepenses);
  readonly total = computed(() =>
    this.lines()
      .filter(isDepenseLineFilled)
      .reduce((sum, line) => sum + line.amount, 0),
  );
  readonly loading = this.store.selectSignal(selectDepensesLoading);
  readonly loadError = this.store.selectSignal(selectDepensesError);

  readonly expenseTypes = EXPENSE_TYPES;
  readonly paymentModes = DEPENSE_PAYMENT_MODES;

  readonly stepIsValid = computed(() => this.stepValidationErrors().length === 0);

  readonly stepValidationErrors = computed((): WizardStepError[] => {
    const errors: WizardStepError[] = [];
    this.lines().forEach((line, index) => {
      if (!isDepenseLineFilled(line) && !isDepenseLineEmpty(line)) {
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
        JourneeActions.patchDepensesStep6({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    if (this.journeeId() == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadDepenses());
  }

  addLine(): void {
    this.store.dispatch(JourneeActions.addDepenseLine());
  }

  updateExpenseType(lineId: number, event: Event): void {
    const expenseType = parseExpenseType((event.target as HTMLSelectElement).value);
    this.store.dispatch(
      JourneeActions.updateDepenseLine({ id: lineId, patch: { expenseType } }),
    );
  }

  updateDescription(lineId: number, event: Event): void {
    const description = (event.target as HTMLInputElement).value;
    this.store.dispatch(
      JourneeActions.updateDepenseLine({ id: lineId, patch: { description } }),
    );
  }

  updateAmount(lineId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const amount = Number.isNaN(parsed) ? 0 : parsed;
    this.store.dispatch(
      JourneeActions.updateDepenseLine({ id: lineId, patch: { amount } }),
    );
  }

  updatePaymentMode(lineId: number, event: Event): void {
    const paymentMode = parseDepensePaymentMode((event.target as HTMLSelectElement).value);
    this.store.dispatch(
      JourneeActions.updateDepenseLine({ id: lineId, patch: { paymentMode } }),
    );
  }

  updateNote(lineId: number, event: Event): void {
    const note = (event.target as HTMLInputElement).value;
    this.store.dispatch(
      JourneeActions.updateDepenseLine({ id: lineId, patch: { note } }),
    );
  }

  removeLine(lineId: number): void {
    this.store.dispatch(JourneeActions.removeDepenseLine({ id: lineId }));
  }

  canRemoveLine(line: DepenseLine): boolean {
    return !isDepenseLineEmpty(line);
  }

  next(): void {
    void this.router.navigate(['/journees', 'nouvelle', 'validation-step6']);
  }
}

function isDepenseLineFilled(line: DepenseLine): boolean {
  return line.expenseType !== '' && line.amount > 0 && line.paymentMode !== '';
}

function isDepenseLineEmpty(line: DepenseLine): boolean {
  return (
    line.expenseType === '' &&
    line.description.trim() === '' &&
    line.amount === 0 &&
    line.note.trim() === ''
  );
}

function parseExpenseType(value: string): DepenseLine['expenseType'] {
  return (EXPENSE_TYPES as readonly string[]).includes(value)
    ? (value as DepenseLine['expenseType'])
    : '';
}

function parseDepensePaymentMode(value: string): DepenseLine['paymentMode'] {
  return (DEPENSE_PAYMENT_MODES as readonly string[]).includes(value)
    ? (value as DepenseLine['paymentMode'])
    : '';
}

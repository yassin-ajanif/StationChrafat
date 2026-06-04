import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  DEPENSE_PAYMENT_MODES,
  EXPENSE_TYPES,
  DepenseLine,
  isDepenseLineEmpty,
  parseDepensePaymentMode,
  parseExpenseType,
} from '../../models/depense.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedDepensesStep,
  selectDepenses,
  selectDepensesError,
  selectDepensesLoading,
  selectDepensesTotal,
  selectDraft,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-depenses-step6-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './depenses-step6.page.html',
  styleUrl: './depenses-step6.page.scss',
})
export class DepensesStep6Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly lines = this.store.selectSignal(selectDepenses);
  readonly total = this.store.selectSignal(selectDepensesTotal);
  readonly loading = this.store.selectSignal(selectDepensesLoading);
  readonly loadError = this.store.selectSignal(selectDepensesError);
  readonly canProceed = this.store.selectSignal(selectCanProceedDepensesStep);

  readonly expenseTypes = EXPENSE_TYPES;
  readonly paymentModes = DEPENSE_PAYMENT_MODES;

  ngOnInit(): void {
    if (this.draft().id == null) {
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
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(['/journees', 'nouvelle', 'validation-step6']);
  }
}

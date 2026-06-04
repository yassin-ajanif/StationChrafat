import { Component, OnInit, inject } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectDraft,
  selectJourneeValidationSummary,
  selectSubmitJourneeError,
  selectSubmittingJournee,
  selectValidationExtrasError,
  selectValidationExtrasLoading,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-validation-step6-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './validation-step6.page.html',
  styleUrl: './validation-step6.page.scss',
})
export class ValidationStep7Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly summary = this.store.selectSignal(selectJourneeValidationSummary);
  readonly loading = this.store.selectSignal(selectValidationExtrasLoading);
  readonly loadError = this.store.selectSignal(selectValidationExtrasError);
  readonly submitting = this.store.selectSignal(selectSubmittingJournee);
  readonly submitError = this.store.selectSignal(selectSubmitJourneeError);

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadValidationExtras());
    this.store.dispatch(JourneeActions.loadOperators());
  }

  submit(): void {
    this.store.dispatch(JourneeActions.submitJournee());
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n'
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanSubmitJournee,
  selectInvalidWizardSteps,
  selectJourneeDraftId,
  selectSubmitJourneeError,
  selectSubmittingJournee,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-validation-step6-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './validation-step6.page.html',
  styleUrl: './validation-step6.page.scss',
})
export class ValidationStep6Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly canSubmit = this.store.selectSignal(selectCanSubmitJournee);
  readonly invalidSteps = this.store.selectSignal(selectInvalidWizardSteps);
  readonly submitting = this.store.selectSignal(selectSubmittingJournee);
  readonly submitError = this.store.selectSignal(selectSubmitJourneeError);

  ngOnInit(): void {
    if (this.journeeId() == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.store.dispatch(JourneeActions.submitJournee());
  }
}

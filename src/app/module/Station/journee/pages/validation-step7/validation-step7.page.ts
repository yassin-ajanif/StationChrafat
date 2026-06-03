import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
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
  selector: 'app-validation-step7-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './validation-step7.page.html',
  styleUrl: './validation-step7.page.scss',
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

  readonly fuelDetailsExpanded = signal(false);
  readonly shopDetailsExpanded = signal(false);
  readonly servicesDetailsExpanded = signal(false);

  toggleFuelDetails(): void {
    this.fuelDetailsExpanded.update((expanded) => !expanded);
  }

  toggleShopDetails(): void {
    this.shopDetailsExpanded.update((expanded) => !expanded);
  }

  toggleServicesDetails(): void {
    this.servicesDetailsExpanded.update((expanded) => !expanded);
  }

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadValidationExtras());
    this.store.dispatch(JourneeActions.loadOperators());
    this.store.dispatch(JourneeActions.loadLavageBons());
    this.store.dispatch(JourneeActions.loadVidangeBons());
  }

  submit(): void {
    this.store.dispatch(JourneeActions.submitJournee());
  }
}

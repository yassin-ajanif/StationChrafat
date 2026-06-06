import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../../../../core/i18n'
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ShiftSlotPickerComponent } from '../../components/shift-slot-picker/shift-slot-picker.component';
import { ShiftSlot } from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectConfigurationStep1,
  selectOperators,
  selectOperatorsLoading,
  selectStartError,
  selectStartingJournee,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-configuration-step1-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, ShiftSlotPickerComponent, DatePipe, TranslatePipe],
  templateUrl: './configuration-step1.page.html',
  styleUrl: './configuration-step1.page.scss',
})
export class ConfigurationStep1Page implements OnInit {
  private readonly store = inject(Store);

  readonly configurationStep1 = this.store.selectSignal(selectConfigurationStep1);
  readonly operators = this.store.selectSignal(selectOperators);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly startingJournee = this.store.selectSignal(selectStartingJournee);
  readonly startError = this.store.selectSignal(selectStartError);

  readonly chefId = computed(() => this.configurationStep1().chefDePisteId);
  readonly shiftSlot = computed(() => this.configurationStep1().shiftSlot);
  readonly openedAt = computed(() => this.configurationStep1().openedAt);

  readonly canStart = computed(
    () =>
      this.chefId() != null &&
      this.shiftSlot() != null &&
      !this.startingJournee(),
  );

  readonly stepIsValid = computed(
    () =>
      this.configurationStep1().journeeId != null &&
      this.chefId() != null &&
      this.shiftSlot() != null,
  );

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchConfigurationStep1({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    if (this.operators().length === 0) {
      this.store.dispatch(JourneeActions.loadOperators());
    }
  }

  onChefChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.dispatch(
      JourneeActions.patchConfigurationStep1({
        patch: { chefDePisteId: value ? Number(value) : null },
      }),
    );
  }

  onSlotChange(slot: ShiftSlot): void {
    this.store.dispatch(JourneeActions.patchConfigurationStep1({ patch: { shiftSlot: slot } }));
  }

  start(): void {
    const chefDePisteId = this.chefId();
    const shiftSlot = this.shiftSlot();
    if (chefDePisteId == null || shiftSlot == null) {
      return;
    }
    this.store.dispatch(JourneeActions.startJournee({ chefDePisteId, shiftSlot }));
  }
}

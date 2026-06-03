import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ShiftSlotPickerComponent } from '../../components/shift-slot-picker/shift-slot-picker.component';
import { ShiftSlot } from '../../models/journee.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectDraft,
  selectOperators,
  selectOperatorsLoading,
  selectStartError,
  selectStartingJournee,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-configuration-step1-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, ShiftSlotPickerComponent, DatePipe],
  templateUrl: './configuration-step1.page.html',
  styleUrl: './configuration-step1.page.scss',
})
export class ConfigurationStep1Page implements OnInit {
  private readonly store = inject(Store);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly operators = this.store.selectSignal(selectOperators);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly startingJournee = this.store.selectSignal(selectStartingJournee);
  readonly startError = this.store.selectSignal(selectStartError);

  readonly chefId = computed(() => this.draft().config.chefDePisteId);
  readonly shiftSlot = computed(() => this.draft().config.shiftSlot);
  readonly openedAt = computed(() => this.draft().config.openedAt);

  readonly canStart = computed(
    () =>
      this.chefId() != null &&
      this.shiftSlot() != null &&
      !this.startingJournee(),
  );

  ngOnInit(): void {
    this.store.dispatch(JourneeActions.loadOperators());
    this.store.dispatch(JourneeActions.resetDraft());
  }

  onChefChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.dispatch(
      JourneeActions.setDraftConfig({
        config: { chefDePisteId: value ? Number(value) : null },
      }),
    );
  }

  onSlotChange(slot: ShiftSlot): void {
    this.store.dispatch(JourneeActions.setDraftConfig({ config: { shiftSlot: slot } }));
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

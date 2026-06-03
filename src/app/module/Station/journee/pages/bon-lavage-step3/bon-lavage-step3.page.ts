import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { LavageBonDialogComponent } from '../../components/lavage-bon-dialog/lavage-bon-dialog.component';
import {
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
  computeLavageBonsTotal,
  suggestNextLavageBonNumber,
} from '../../models/lavage-bon.model';
import { LavageBonDraftInput } from '../../models/lavage-bon.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedLavageStep,
  selectDraft,
  selectFilteredLavageBons,
  selectLavageBons,
  selectLavageBonsError,
  selectLavageBonsLoading,
  selectLavageChefVidangeLavageId,
  selectOperators,
  selectOperatorsLoading,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-bon-lavage-step3-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe, LavageBonDialogComponent],
  templateUrl: './bon-lavage-step3.page.html',
  styleUrl: './bon-lavage-step3.page.scss',
})
export class BonLavageStep3Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly allBons = this.store.selectSignal(selectLavageBons);
  readonly bons = this.store.selectSignal(selectFilteredLavageBons);
  readonly selectedChefId = this.store.selectSignal(selectLavageChefVidangeLavageId);
  readonly filteredTotal = computed(() => computeLavageBonsTotal(this.bons()));
  readonly loading = this.store.selectSignal(selectLavageBonsLoading);
  readonly loadError = this.store.selectSignal(selectLavageBonsError);
  readonly canProceed = this.store.selectSignal(selectCanProceedLavageStep);
  readonly operators = this.store.selectSignal(selectOperators);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);

  readonly dialogOpen = signal(false);
  readonly editingBonId = signal<number | null>(null);

  readonly editingBon = computed(() => {
    const id = this.editingBonId();
    if (id == null) {
      return null;
    }
    return this.allBons().find((bon) => bon.id === id) ?? null;
  });

  readonly suggestedBonNumber = computed(() => suggestNextLavageBonNumber(this.allBons()));

  readonly computeBonTotal = computeBonTotal;
  readonly computeBonServicesAmount = computeBonServicesAmount;
  readonly computeBonConsumedQty = computeBonConsumedQty;

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadLavageBons());
    this.store.dispatch(JourneeActions.loadOperators());
  }

  openNewBonDialog(): void {
    if (this.selectedChefId() == null) {
      return;
    }
    this.editingBonId.set(null);
    this.dialogOpen.set(true);
  }

  onChefChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const chefVidangeLavageId = raw === '' ? null : Number(raw);
    this.store.dispatch(JourneeActions.setLavageChefVidangeLavage({ chefVidangeLavageId }));
  }

  openEditBonDialog(id: number): void {
    this.editingBonId.set(id);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingBonId.set(null);
  }

  onBonSaved(bon: LavageBonDraftInput): void {
    const chefVidangeLavageId = this.selectedChefId();
    if (chefVidangeLavageId == null) {
      return;
    }
    const bonWithChef = { ...bon, chefVidangeLavageId };
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateLavageBon({ id, bon: bonWithChef }));
    } else {
      this.store.dispatch(JourneeActions.addLavageBon({ bon: bonWithChef }));
    }
    this.closeDialog();
  }

  removeBon(id: number): void {
    this.store.dispatch(JourneeActions.removeLavageBon({ id }));
  }

  next(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(['/journees', 'nouvelle', 'bon-vidange-step4']);
  }
}

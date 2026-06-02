import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LavageBonDialogComponent } from '../../components/lavage-bon-dialog/lavage-bon-dialog.component';
import {
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
  suggestNextLavageBonNumber,
} from '../../models/lavage-bon.model';
import { LavageBonDraftInput } from '../../models/lavage-bon.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedLavageStep,
  selectDraft,
  selectLavageBons,
  selectLavageBonsError,
  selectLavageBonsLoading,
  selectLavageBonsTotal,
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
  readonly bons = this.store.selectSignal(selectLavageBons);
  readonly total = this.store.selectSignal(selectLavageBonsTotal);
  readonly loading = this.store.selectSignal(selectLavageBonsLoading);
  readonly loadError = this.store.selectSignal(selectLavageBonsError);
  readonly canProceed = this.store.selectSignal(selectCanProceedLavageStep);

  readonly dialogOpen = signal(false);
  readonly editingBonId = signal<number | null>(null);

  readonly editingBon = computed(() => {
    const id = this.editingBonId();
    if (id == null) {
      return null;
    }
    return this.bons().find((bon) => bon.id === id) ?? null;
  });

  readonly suggestedBonNumber = computed(() => suggestNextLavageBonNumber(this.bons()));

  readonly computeBonTotal = computeBonTotal;
  readonly computeBonServicesAmount = computeBonServicesAmount;
  readonly computeBonConsumedQty = computeBonConsumedQty;

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadLavageBons());
  }

  openNewBonDialog(): void {
    this.editingBonId.set(null);
    this.dialogOpen.set(true);
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
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateLavageBon({ id, bon }));
    } else {
      this.store.dispatch(JourneeActions.addLavageBon({ bon }));
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

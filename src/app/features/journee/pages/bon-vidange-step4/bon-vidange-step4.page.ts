import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { VidangeBonDialogComponent } from '../../components/vidange-bon-dialog/vidange-bon-dialog.component';
import {
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
  suggestNextVidangeBonNumber,
} from '../../models/vidange-bon.model';
import { VidangeBonDraftInput } from '../../models/vidange-bon.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedVidangeStep,
  selectDraft,
  selectVidangeBons,
  selectVidangeBonsError,
  selectVidangeBonsLoading,
  selectVidangeBonsTotal,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-bon-vidange-step4-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe, VidangeBonDialogComponent],
  templateUrl: './bon-vidange-step4.page.html',
  styleUrl: './bon-vidange-step4.page.scss',
})
export class BonVidangeStep4Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly bons = this.store.selectSignal(selectVidangeBons);
  readonly total = this.store.selectSignal(selectVidangeBonsTotal);
  readonly loading = this.store.selectSignal(selectVidangeBonsLoading);
  readonly loadError = this.store.selectSignal(selectVidangeBonsError);
  readonly canProceed = this.store.selectSignal(selectCanProceedVidangeStep);

  readonly dialogOpen = signal(false);
  readonly editingBonId = signal<number | null>(null);

  readonly editingBon = computed(() => {
    const id = this.editingBonId();
    if (id == null) {
      return null;
    }
    return this.bons().find((bon) => bon.id === id) ?? null;
  });

  readonly suggestedBonNumber = computed(() => suggestNextVidangeBonNumber(this.bons()));

  readonly computeBonTotal = computeBonTotal;
  readonly computeBonServicesAmount = computeBonServicesAmount;
  readonly computeBonConsumedQty = computeBonConsumedQty;

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadVidangeBons());
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

  onBonSaved(bon: VidangeBonDraftInput): void {
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateVidangeBon({ id, bon }));
    } else {
      this.store.dispatch(JourneeActions.addVidangeBon({ bon }));
    }
    this.closeDialog();
  }

  removeBon(id: number): void {
    this.store.dispatch(JourneeActions.removeVidangeBon({ id }));
  }

  next(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(['/journees', 'nouvelle', 'encaissements-step5']);
  }
}

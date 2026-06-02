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
  computeVidangeBonsTotal,
  suggestNextVidangeBonNumber,
} from '../../models/vidange-bon.model';
import { VidangeBonDraftInput } from '../../models/vidange-bon.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedVidangeStep,
  selectDraft,
  selectFilteredVidangeBons,
  selectOperators,
  selectOperatorsLoading,
  selectVidangeBons,
  selectVidangeBonsError,
  selectVidangeBonsLoading,
  selectVidangeChefVidangeLavageId,
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
  readonly allBons = this.store.selectSignal(selectVidangeBons);
  readonly bons = this.store.selectSignal(selectFilteredVidangeBons);
  readonly selectedChefId = this.store.selectSignal(selectVidangeChefVidangeLavageId);
  readonly filteredTotal = computed(() => computeVidangeBonsTotal(this.bons()));
  readonly loading = this.store.selectSignal(selectVidangeBonsLoading);
  readonly loadError = this.store.selectSignal(selectVidangeBonsError);
  readonly canProceed = this.store.selectSignal(selectCanProceedVidangeStep);
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

  readonly suggestedBonNumber = computed(() => suggestNextVidangeBonNumber(this.allBons()));

  readonly computeBonTotal = computeBonTotal;
  readonly computeBonServicesAmount = computeBonServicesAmount;
  readonly computeBonConsumedQty = computeBonConsumedQty;

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadVidangeBons());
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
    this.store.dispatch(JourneeActions.setVidangeChefVidangeLavage({ chefVidangeLavageId }));
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
    const chefVidangeLavageId = this.selectedChefId();
    if (chefVidangeLavageId == null) {
      return;
    }
    const bonWithChef = { ...bon, chefVidangeLavageId };
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateVidangeBon({ id, bon: bonWithChef }));
    } else {
      this.store.dispatch(JourneeActions.addVidangeBon({ bon: bonWithChef }));
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

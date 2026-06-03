import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JOURNEE_BON_VIDANGE_CONFIG } from '../../../shared/models/bon-vidange';
import { VidangeBonDraftInput } from '../../../shared/models/bon-vidange';
import { BonVidangePage } from '../../../shared/pages/bon-vidange/bon-vidange.page';
import { computeVidangeBonsTotal, suggestNextVidangeBonNumber } from '../../models/vidange-bon.model';
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

/** Journée wizard step 4 — hosts the shared bon de vidange page. */
@Component({
  selector: 'app-bon-vidange-step4-page',
  imports: [BonVidangePage],
  template: `
    <app-bon-vidange-page
      [config]="config"
      [bons]="bons()"
      [selectedChefId]="selectedChefId()"
      [filteredTotal]="filteredTotal()"
      [loading]="loading()"
      [loadError]="loadError()"
      [canProceed]="canProceed()"
      [operators]="operators()"
      [operatorsLoading]="operatorsLoading()"
      [dialogOpen]="dialogOpen()"
      [suggestedBonNumber]="suggestedBonNumber()"
      [editingBon]="editingBon()"
      (chefChangeRequested)="onChefChange($event)"
      (newBonRequested)="openNewBonDialog()"
      (editBonRequested)="openEditBonDialog($event)"
      (removeBonRequested)="removeBon($event)"
      (bonSaved)="onBonSaved($event)"
      (dialogClosed)="closeDialog()"
      (nextRequested)="onNext()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonVidangeStep4Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_VIDANGE_CONFIG;

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

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.draft().id == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadVidangeBons());
    this.store.dispatch(JourneeActions.loadOperators());
  }

  onChefChange(chefVidangeLavageId: number | null): void {
    this.store.dispatch(JourneeActions.setVidangeChefVidangeLavage({ chefVidangeLavageId }));
  }

  openNewBonDialog(): void {
    if (this.selectedChefId() == null) {
      return;
    }
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

  onNext(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(this.config.nextLink);
  }
}

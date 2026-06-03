import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JOURNEE_BON_LAVAGE_CONFIG, LavageBonDraftInput } from '../../../shared/models/bon-lavage';
import { BonLavagePage } from '../../../shared/pages/bon-lavage/bon-lavage.page';
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
import { computeLavageBonsTotal, suggestNextLavageBonNumber } from '../../models/lavage-bon.model';

/** Journée wizard step 3 — hosts the shared bon de lavage page. */
@Component({
  selector: 'app-bon-lavage-step3-page',
  imports: [BonLavagePage],
  template: `
    <app-bon-lavage-page
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
export class BonLavageStep3Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_LAVAGE_CONFIG;

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

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.draft().id == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadLavageBons());
    this.store.dispatch(JourneeActions.loadOperators());
  }

  onChefChange(chefVidangeLavageId: number | null): void {
    this.store.dispatch(JourneeActions.setLavageChefVidangeLavage({ chefVidangeLavageId }));
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

  onNext(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(this.config.nextLink);
  }
}

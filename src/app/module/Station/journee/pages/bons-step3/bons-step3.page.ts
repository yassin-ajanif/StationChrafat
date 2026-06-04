import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JOURNEE_BON_CONFIG, StationBon, StationBonDraftInput, suggestNextStationBonNumber } from '../../../shared/models/bon';
import { BonPage } from '../../../shared/pages/bon/bon.page';
import { computeStationBonsTotal } from '../../../shared/models/bon';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedBonsStep,
  selectDraft,
  selectFilteredStationBons,
  selectOperators,
  selectOperatorsLoading,
  selectStationBons,
  selectStationBonsChefId,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-bons-step3-page',
  imports: [BonPage],
  template: `
    <app-bon-page
      [config]="config"
      [bons]="bons()"
      [selectedChefId]="selectedChefId()"
      [filteredTotal]="filteredTotal()"
      [loading]="false"
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
export class BonsStep3Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_CONFIG;

  readonly draft = this.store.selectSignal(selectDraft);
  readonly allBons = this.store.selectSignal(selectStationBons);
  readonly bons = this.store.selectSignal(selectFilteredStationBons);
  readonly selectedChefId = this.store.selectSignal(selectStationBonsChefId);
  readonly filteredTotal = computed(() => computeStationBonsTotal(this.bons()));
  readonly canProceed = this.store.selectSignal(selectCanProceedBonsStep);
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

  readonly suggestedBonNumber = computed(() => suggestNextStationBonNumber(this.allBons(), 'LAV', 8800));

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.draft().id == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadOperators());
  }

  onChefChange(chefVidangeLavageId: number | null): void {
    this.store.dispatch(JourneeActions.setStationBonsChefId({ chefVidangeLavageId }));
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

  onBonSaved(bon: StationBonDraftInput): void {
    const chefVidangeLavageId = this.selectedChefId();
    if (chefVidangeLavageId == null) {
      return;
    }
    const bonWithChef = { ...bon, chefVidangeLavageId };
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateStationBon({ id, bon: bonWithChef }));
    } else {
      this.store.dispatch(JourneeActions.addStationBon({ bon: bonWithChef }));
    }
    this.closeDialog();
  }

  removeBon(id: number): void {
    this.store.dispatch(JourneeActions.removeStationBon({ id }));
  }

  onNext(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(this.config.nextLink);
  }
}

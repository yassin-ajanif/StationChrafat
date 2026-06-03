import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JOURNEE_BON_LIVRAISON_CONFIG } from '../../../shared/models/bon-livraison-carburant';
import { BonLivraisonCarburantPage } from '../../../shared/pages/bon-livraison-carburant/bon-livraison-carburant.page';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectAvailableNozzleBombistes,
  selectCanProceedNozzleStep,
  selectDraft,
  selectNozzleBombisteGroups,
  selectNozzleIndexesError,
  selectNozzleIndexesLoading,
  selectOperatorsLoading,
} from '../../state/journee.selectors';

/** Journée wizard step 2 — hosts the shared fuel delivery (bon de livraison) page. */
@Component({
  selector: 'app-index-pistoles-step2-page',
  imports: [BonLivraisonCarburantPage],
  template: `
    <app-bon-livraison-carburant-page
      [config]="config"
      [bombisteGroups]="bombisteGroups()"
      [availableBombistes]="availableBombistes()"
      [loading]="loading()"
      [operatorsLoading]="operatorsLoading()"
      [loadError]="loadError()"
      [canProceed]="canProceed()"
      (addBombisteRequested)="onAddBombiste($event)"
      (removeBombisteRequested)="onRemoveBombiste($event)"
      (indexChangeRequested)="onIndexChange($event)"
      (paymentChangeRequested)="onPaymentChange($event)"
      (nextRequested)="onNext()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPistolesStep2Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_LIVRAISON_CONFIG;

  readonly draft = this.store.selectSignal(selectDraft);
  readonly bombisteGroups = this.store.selectSignal(selectNozzleBombisteGroups);
  readonly availableBombistes = this.store.selectSignal(selectAvailableNozzleBombistes);
  readonly loading = this.store.selectSignal(selectNozzleIndexesLoading);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly loadError = this.store.selectSignal(selectNozzleIndexesError);
  readonly canProceed = this.store.selectSignal(selectCanProceedNozzleStep);

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.draft().id == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadOperators());
    this.store.dispatch(JourneeActions.loadNozzleIndexes());
  }

  onAddBombiste(bombisteId: number): void {
    this.store.dispatch(JourneeActions.addNozzleBombiste({ bombisteId }));
  }

  onRemoveBombiste(bombisteId: number): void {
    this.store.dispatch(JourneeActions.removeNozzleBombiste({ bombisteId }));
  }

  onIndexChange(event: {
    lineId: number;
    field: 'entree' | 'sortie';
    value: number | null;
  }): void {
    this.store.dispatch(
      JourneeActions.updateNozzleIndex({
        lineId: event.lineId,
        ...(event.field === 'entree'
          ? { indexEntree: event.value }
          : { indexSortie: event.value }),
      }),
    );
  }

  onPaymentChange(event: {
    bombisteId: number;
    field: 'cash' | 'tpe' | 'bons';
    value: number;
  }): void {
    this.store.dispatch(
      JourneeActions.updateNozzleBombistePayment({
        bombisteId: event.bombisteId,
        [event.field]: event.value,
      }),
    );
  }

  onNext(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(this.config.nextLink);
  }
}

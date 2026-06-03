import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CARBURANT_BON_LIVRAISON_CONFIG } from '../../../shared/models/bon-livraison-carburant';
import { BonLivraisonCarburantPage } from '../../../shared/pages/bon-livraison-carburant/bon-livraison-carburant.page';
import { JourneeActions } from '../../../journee/state/journee.actions';
import {
  selectAvailableNozzleBombistes,
  selectCanProceedNozzleStep,
  selectNozzleBombisteGroups,
  selectNozzleIndexesError,
  selectNozzleIndexesLoading,
  selectOperatorsLoading,
} from '../../../journee/state/journee.selectors';

/** Carburant module — hosts the shared pistolets / bon de livraison carburant UI. */
@Component({
  selector: 'app-carburant-bon-livraison-carburant-page',
  standalone: true,
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
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarburantBonLivraisonCarburantPage implements OnInit {
  private readonly store = inject(Store);

  readonly config = CARBURANT_BON_LIVRAISON_CONFIG;

  readonly bombisteGroups = this.store.selectSignal(selectNozzleBombisteGroups);
  readonly availableBombistes = this.store.selectSignal(selectAvailableNozzleBombistes);
  readonly loading = this.store.selectSignal(selectNozzleIndexesLoading);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);
  readonly loadError = this.store.selectSignal(selectNozzleIndexesError);
  readonly canProceed = this.store.selectSignal(selectCanProceedNozzleStep);

  ngOnInit(): void {
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
}

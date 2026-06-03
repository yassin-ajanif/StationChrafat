import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AVOIR_FOURNISSEUR_STATUT_LABELS,
  AvoirFournisseurStatut,
} from '../../../models/achat';
import { LavageActions } from '../../../state/lavage.actions';
import {
  selectAvoirsFournisseur,
  selectAvoirsFournisseurError,
  selectAvoirsFournisseurLoading,
} from '../../../state/lavage.selectors';

@Component({
  selector: 'app-lavage-achat-avoirs-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AchatAvoirsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly avoirs = this.store.selectSignal(selectAvoirsFournisseur);
  readonly loading = this.store.selectSignal(selectAvoirsFournisseurLoading);
  readonly error = this.store.selectSignal(selectAvoirsFournisseurError);
  readonly statutLabels = AVOIR_FOURNISSEUR_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(LavageActions.loadAvoirsFournisseur());
  }

  statutClass(statut: AvoirFournisseurStatut): string {
    const map: Record<AvoirFournisseurStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      recu: 'bg-secondary/15 text-secondary',
      applique: 'bg-success/15 text-success',
    };
    return map[statut];
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  LIVRAISON_STATUT_LABELS,
  LivraisonStatut,
} from '../../../models/ventes';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectLivraisons,
  selectLivraisonsError,
  selectLivraisonsLoading,
} from '../../../state/vidange.selectors';

@Component({
  selector: 'app-Vidange-livraisons-list-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class LivraisonsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly livraisons = this.store.selectSignal(selectLivraisons);
  readonly loading = this.store.selectSignal(selectLivraisonsLoading);
  readonly error = this.store.selectSignal(selectLivraisonsError);
  readonly statutLabels = LIVRAISON_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadLivraisons());
  }

  statutClass(statut: LivraisonStatut): string {
    const map: Record<LivraisonStatut, string> = {
      planifiee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { LivraisonsListPage as VentesLivraisonsListPage };

import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FACTURE_STATUT_LABELS, FactureStatut } from '../../../models/ventes';
import { CarburantActions } from '../../../state/carburant.actions';
import {
  selectFactures,
  selectFacturesError,
  selectFacturesLoading,
} from '../../../state/carburant.selectors';

@Component({
  selector: 'app-carburant-factures-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './factures-list.page.html',
  styleUrl: './factures-list.page.scss',
})
export class FacturesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly factures = this.store.selectSignal(selectFactures);
  readonly loading = this.store.selectSignal(selectFacturesLoading);
  readonly error = this.store.selectSignal(selectFacturesError);
  readonly statutLabels = FACTURE_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(CarburantActions.loadFactures());
  }

  statutClass(statut: FactureStatut): string {
    const map: Record<FactureStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      emise: 'bg-secondary/15 text-secondary',
      payee: 'bg-success/15 text-success',
      en_retard: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { FacturesListPage as VentesFacturesListPage };

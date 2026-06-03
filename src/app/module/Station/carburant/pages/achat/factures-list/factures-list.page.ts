import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FACTURE_FOURNISSEUR_STATUT_LABELS,
  FactureFournisseurStatut,
} from '../../../models/achat';
import { CarburantActions } from '../../../state/carburant.actions';
import {
  selectFacturesFournisseur,
  selectFacturesFournisseurError,
  selectFacturesFournisseurLoading,
} from '../../../state/carburant.selectors';

@Component({
  selector: 'app-carburant-achat-factures-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './factures-list.page.html',
  styleUrl: './factures-list.page.scss',
})
export class AchatFacturesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly factures = this.store.selectSignal(selectFacturesFournisseur);
  readonly loading = this.store.selectSignal(selectFacturesFournisseurLoading);
  readonly error = this.store.selectSignal(selectFacturesFournisseurError);
  readonly statutLabels = FACTURE_FOURNISSEUR_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(CarburantActions.loadFacturesFournisseur());
  }

  statutClass(statut: FactureFournisseurStatut): string {
    const map: Record<FactureFournisseurStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      recue: 'bg-secondary/15 text-secondary',
      payee: 'bg-success/15 text-success',
      en_retard: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

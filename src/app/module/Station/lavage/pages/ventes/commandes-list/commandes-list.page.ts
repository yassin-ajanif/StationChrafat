import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  COMMANDE_STATUT_LABELS,
  CommandeStatut,
} from '../../../models/ventes';
import { LavageActions } from '../../../state/lavage.actions';
import {
  selectCommandes,
  selectCommandesError,
  selectCommandesLoading,
} from '../../../state/lavage.selectors';

@Component({
  selector: 'app-lavage-commandes-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class CommandesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly commandes = this.store.selectSignal(selectCommandes);
  readonly loading = this.store.selectSignal(selectCommandesLoading);
  readonly error = this.store.selectSignal(selectCommandesError);
  readonly statutLabels = COMMANDE_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(LavageActions.loadCommandes());
  }

  statutClass(statut: CommandeStatut): string {
    const map: Record<CommandeStatut, string> = {
      en_attente: 'bg-warning-bg text-warning-text',
      confirmee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { CommandesListPage as VentesCommandesListPage };

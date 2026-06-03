import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  COMMANDE_ACHAT_STATUT_LABELS,
  CommandeAchatStatut,
} from '../../../models/achat';
import { LavageActions } from '../../../state/lavage.actions';
import {
  selectCommandesAchat,
  selectCommandesAchatError,
  selectCommandesAchatLoading,
} from '../../../state/lavage.selectors';

@Component({
  selector: 'app-lavage-achat-commandes-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class AchatCommandesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly commandes = this.store.selectSignal(selectCommandesAchat);
  readonly loading = this.store.selectSignal(selectCommandesAchatLoading);
  readonly error = this.store.selectSignal(selectCommandesAchatError);
  readonly statutLabels = COMMANDE_ACHAT_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(LavageActions.loadCommandesAchat());
  }

  statutClass(statut: CommandeAchatStatut): string {
    const map: Record<CommandeAchatStatut, string> = {
      en_attente: 'bg-warning-bg text-warning-text',
      confirmee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      recue: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

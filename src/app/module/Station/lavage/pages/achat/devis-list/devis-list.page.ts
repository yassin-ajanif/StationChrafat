import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DEVIS_ACHAT_STATUT_LABELS,
  DevisAchatStatut,
} from '../../../models/achat';
import { LavageActions } from '../../../state/lavage.actions';
import {
  selectDevisAchat,
  selectDevisAchatError,
  selectDevisAchatLoading,
} from '../../../state/lavage.selectors';

@Component({
  selector: 'app-lavage-achat-devis-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './devis-list.page.html',
  styleUrl: './devis-list.page.scss',
})
export class AchatDevisListPage implements OnInit {
  private readonly store = inject(Store);

  readonly devis = this.store.selectSignal(selectDevisAchat);
  readonly loading = this.store.selectSignal(selectDevisAchatLoading);
  readonly error = this.store.selectSignal(selectDevisAchatError);
  readonly statutLabels = DEVIS_ACHAT_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(LavageActions.loadDevisAchat());
  }

  statutClass(statut: DevisAchatStatut): string {
    const map: Record<DevisAchatStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      envoye: 'bg-secondary/15 text-secondary',
      accepte: 'bg-success/15 text-success',
      refuse: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  RECEPTION_STATUT_LABELS,
  ReceptionStatut,
} from '../../../models/achat';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectReceptions,
  selectReceptionsError,
  selectReceptionsLoading,
} from '../../../state/vidange.selectors';

@Component({
  selector: 'app-Vidange-achat-livraisons-list-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class AchatLivraisonsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly receptions = this.store.selectSignal(selectReceptions);
  readonly loading = this.store.selectSignal(selectReceptionsLoading);
  readonly error = this.store.selectSignal(selectReceptionsError);
  readonly statutLabels = RECEPTION_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadReceptions());
  }

  statutClass(statut: ReceptionStatut): string {
    const map: Record<ReceptionStatut, string> = {
      planifiee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-warning-bg text-warning-text',
      recue: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

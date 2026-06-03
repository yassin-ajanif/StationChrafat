import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AVOIR_STATUT_LABELS, AvoirStatut } from '../../../models/ventes';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectAvoirs,
  selectAvoirsError,
  selectAvoirsLoading,
} from '../../../state/vidange.selectors';

@Component({
  selector: 'app-Vidange-avoirs-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AvoirsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly avoirs = this.store.selectSignal(selectAvoirs);
  readonly loading = this.store.selectSignal(selectAvoirsLoading);
  readonly error = this.store.selectSignal(selectAvoirsError);
  readonly statutLabels = AVOIR_STATUT_LABELS;

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadAvoirs());
  }

  statutClass(statut: AvoirStatut): string {
    const map: Record<AvoirStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      emis: 'bg-secondary/15 text-secondary',
      applique: 'bg-success/15 text-success',
    };
    return map[statut];
  }
}

export { AvoirsListPage as VentesAvoirsListPage };

import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  LIVRAISON_STATUT_LABELS,
  Livraison,
  LivraisonDraft,
  LivraisonStatut,
} from '../../../models/ventes';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectLivraisons,
  selectLivraisonsError,
  selectLivraisonsLoading,
  selectLivraisonsSaving,
} from '../../../state/vidange.selectors';
import { LivraisonFormDialogComponent } from './dialogs/livraison-form-dialog/livraison-form-dialog.component';

@Component({
  selector: 'app-vidange-livraisons-list-page',
  standalone: true,
  imports: [ButtonComponent, LivraisonFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class LivraisonsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly livraisons = this.store.selectSignal(selectLivraisons);
  readonly loading = this.store.selectSignal(selectLivraisonsLoading);
  readonly error = this.store.selectSignal(selectLivraisonsError);
  readonly saving = this.store.selectSignal(selectLivraisonsSaving);

  readonly statutLabels = LIVRAISON_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingLivraison = signal<Livraison | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadLivraisons());
  }

  openNew(): void {
    this.editingLivraison.set(null);
    this.showDialog.set(true);
  }

  openEdit(livraison: Livraison): void {
    this.editingLivraison.set(livraison);
    this.showDialog.set(true);
  }

  onSaved(draft: LivraisonDraft): void {
    const editing = this.editingLivraison();
    if (editing) {
      this.store.dispatch(VidangeActions.updateLivraison({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VidangeActions.addLivraison({ draft }));
    }
    this.showDialog.set(false);
    this.editingLivraison.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingLivraison.set(null);
  }

  removeLivraison(id: number): void {
    if (confirm('Supprimer cette livraison ?')) {
      this.store.dispatch(VidangeActions.removeLivraison({ id }));
    }
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

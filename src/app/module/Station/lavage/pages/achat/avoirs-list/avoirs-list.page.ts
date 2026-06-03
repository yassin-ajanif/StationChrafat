import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  AVOIR_FOURNISSEUR_STATUT_LABELS,
  AvoirFournisseur,
  AvoirFournisseurDraft,
  AvoirFournisseurStatut,
} from '../../../models/achat';
import { LavageActions } from '../../../state/lavage.actions';
import {
  selectAvoirsFournisseur,
  selectAvoirsFournisseurError,
  selectAvoirsFournisseurLoading,
  selectAvoirsFournisseurSaving,
} from '../../../state/lavage.selectors';
import { AvoirFournisseurFormDialogComponent } from './dialogs/avoir-fournisseur-form-dialog/avoir-fournisseur-form-dialog.component';

@Component({
  selector: 'app-lavage-achat-avoirs-list-page',
  standalone: true,
  imports: [ButtonComponent, AvoirFournisseurFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AchatAvoirsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly avoirs = this.store.selectSignal(selectAvoirsFournisseur);
  readonly loading = this.store.selectSignal(selectAvoirsFournisseurLoading);
  readonly error = this.store.selectSignal(selectAvoirsFournisseurError);
  readonly saving = this.store.selectSignal(selectAvoirsFournisseurSaving);

  readonly statutLabels = AVOIR_FOURNISSEUR_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingAvoir = signal<AvoirFournisseur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(LavageActions.loadAvoirsFournisseur());
  }

  openNew(): void {
    this.editingAvoir.set(null);
    this.showDialog.set(true);
  }

  openEdit(avoir: AvoirFournisseur): void {
    this.editingAvoir.set(avoir);
    this.showDialog.set(true);
  }

  onSaved(draft: AvoirFournisseurDraft): void {
    const editing = this.editingAvoir();
    if (editing) {
      this.store.dispatch(LavageActions.updateAvoirFournisseur({ id: editing.id, draft }));
    } else {
      this.store.dispatch(LavageActions.addAvoirFournisseur({ draft }));
    }
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  removeAvoir(id: number): void {
    if (confirm('Supprimer cet avoir fournisseur ?')) {
      this.store.dispatch(LavageActions.removeAvoirFournisseur({ id }));
    }
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

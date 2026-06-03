import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { AVOIR_STATUT_LABELS, Avoir, AvoirDraft, AvoirStatut } from '../../../models/ventes';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectAvoirs,
  selectAvoirsError,
  selectAvoirsLoading,
  selectAvoirsSaving,
} from '../../../state/vidange.selectors';
import { AvoirFormDialogComponent } from './dialogs/avoir-form-dialog/avoir-form-dialog.component';

@Component({
  selector: 'app-vidange-avoirs-list-page',
  standalone: true,
  imports: [ButtonComponent, AvoirFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AvoirsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly avoirs = this.store.selectSignal(selectAvoirs);
  readonly loading = this.store.selectSignal(selectAvoirsLoading);
  readonly error = this.store.selectSignal(selectAvoirsError);
  readonly saving = this.store.selectSignal(selectAvoirsSaving);

  readonly statutLabels = AVOIR_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingAvoir = signal<Avoir | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadAvoirs());
  }

  openNew(): void {
    this.editingAvoir.set(null);
    this.showDialog.set(true);
  }

  openEdit(avoir: Avoir): void {
    this.editingAvoir.set(avoir);
    this.showDialog.set(true);
  }

  onSaved(draft: AvoirDraft): void {
    const editing = this.editingAvoir();
    if (editing) {
      this.store.dispatch(VidangeActions.updateAvoir({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VidangeActions.addAvoir({ draft }));
    }
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  removeAvoir(id: number): void {
    if (confirm('Supprimer cet avoir ?')) {
      this.store.dispatch(VidangeActions.removeAvoir({ id }));
    }
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

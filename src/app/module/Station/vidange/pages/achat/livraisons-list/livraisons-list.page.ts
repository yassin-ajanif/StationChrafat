import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  RECEPTION_STATUT_LABELS,
  Reception,
  ReceptionDraft,
  ReceptionStatut,
} from '../../../models/achat';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectReceptions,
  selectReceptionsError,
  selectReceptionsLoading,
  selectReceptionsSaving,
} from '../../../state/vidange.selectors';
import { ReceptionFormDialogComponent } from './dialogs/reception-form-dialog/reception-form-dialog.component';

@Component({
  selector: 'app-vidange-achat-livraisons-list-page',
  standalone: true,
  imports: [ButtonComponent, ReceptionFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class AchatLivraisonsListPage implements OnInit {
  private readonly store = inject(Store);

  readonly receptions = this.store.selectSignal(selectReceptions);
  readonly loading = this.store.selectSignal(selectReceptionsLoading);
  readonly error = this.store.selectSignal(selectReceptionsError);
  readonly saving = this.store.selectSignal(selectReceptionsSaving);

  readonly statutLabels = RECEPTION_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingReception = signal<Reception | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadReceptions());
  }

  openNew(): void {
    this.editingReception.set(null);
    this.showDialog.set(true);
  }

  openEdit(reception: Reception): void {
    this.editingReception.set(reception);
    this.showDialog.set(true);
  }

  onSaved(draft: ReceptionDraft): void {
    const editing = this.editingReception();
    if (editing) {
      this.store.dispatch(VidangeActions.updateReception({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VidangeActions.addReception({ draft }));
    }
    this.showDialog.set(false);
    this.editingReception.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingReception.set(null);
  }

  removeReception(id: number): void {
    if (confirm('Supprimer cette réception ?')) {
      this.store.dispatch(VidangeActions.removeReception({ id }));
    }
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

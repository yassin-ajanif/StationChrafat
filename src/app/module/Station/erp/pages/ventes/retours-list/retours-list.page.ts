import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RETOUR_STATUT_LABELS, Retour, RetourDraft, RetourStatut } from '../../../models/ventes';
import { ErpActions } from '../../../state/erp.actions';
import {
  selectRetours,
  selectRetoursError,
  selectRetoursLoading,
  selectRetoursSaving,
} from '../../../state/erp.selectors';
import { RetourFormDialogComponent } from './dialogs/retour-form-dialog/retour-form-dialog.component';

@Component({
  selector: 'app-erp-retours-list-page',
  standalone: true,
  imports: [ButtonComponent, RetourFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './retours-list.page.html',
  styleUrl: './retours-list.page.scss',
})
export class RetoursListPage implements OnInit {
  private readonly store = inject(Store);

  readonly retours = this.store.selectSignal(selectRetours);
  readonly loading = this.store.selectSignal(selectRetoursLoading);
  readonly error = this.store.selectSignal(selectRetoursError);
  readonly saving = this.store.selectSignal(selectRetoursSaving);

  readonly statutLabels = RETOUR_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingRetour = signal<Retour | null>(null);

  ngOnInit(): void {
    this.store.dispatch(ErpActions.loadRetours());
  }

  openNew(): void {
    this.editingRetour.set(null);
    this.showDialog.set(true);
  }

  openEdit(retour: Retour): void {
    this.editingRetour.set(retour);
    this.showDialog.set(true);
  }

  onSaved(draft: RetourDraft): void {
    const editing = this.editingRetour();
    if (editing) {
      this.store.dispatch(ErpActions.updateRetour({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ErpActions.addRetour({ draft }));
    }
    this.showDialog.set(false);
    this.editingRetour.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingRetour.set(null);
  }

  removeRetour(id: number): void {
    if (confirm('Supprimer ce bon de retour ?')) {
      this.store.dispatch(ErpActions.removeRetour({ id }));
    }
  }

  statutClass(statut: RetourStatut): string {
    const map: Record<RetourStatut, string> = {
      en_attente: 'bg-surface-container text-on-surface-variant',
      recu: 'bg-secondary/15 text-secondary',
      traite: 'bg-success/15 text-success',
      refuse: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { RetoursListPage as VentesRetoursListPage };

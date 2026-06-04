import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  DEVIS_ACHAT_STATUT_LABELS,
  DevisAchat,
  DevisAchatDraft,
  DevisAchatStatut,
} from '../../../models/achat';
import { ErpActions } from '../../../state/erp.actions';
import {
  selectDevisAchat,
  selectDevisAchatError,
  selectDevisAchatLoading,
  selectDevisAchatSaving,
} from '../../../state/erp.selectors';
import { DevisAchatFormDialogComponent } from './dialogs/devis-achat-form-dialog/devis-achat-form-dialog.component';

@Component({
  selector: 'app-erp-achat-devis-list-page',
  standalone: true,
  imports: [ButtonComponent, DevisAchatFormDialogComponent, DecimalPipe, DatePipe],
  templateUrl: './devis-list.page.html',
  styleUrl: './devis-list.page.scss',
})
export class AchatDevisListPage implements OnInit {
  private readonly store = inject(Store);

  readonly devis = this.store.selectSignal(selectDevisAchat);
  readonly loading = this.store.selectSignal(selectDevisAchatLoading);
  readonly error = this.store.selectSignal(selectDevisAchatError);
  readonly saving = this.store.selectSignal(selectDevisAchatSaving);

  readonly statutLabels = DEVIS_ACHAT_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingDevis = signal<DevisAchat | null>(null);

  ngOnInit(): void {
    this.store.dispatch(ErpActions.loadDevisAchat());
  }

  openNew(): void {
    this.editingDevis.set(null);
    this.showDialog.set(true);
  }

  openEdit(devis: DevisAchat): void {
    this.editingDevis.set(devis);
    this.showDialog.set(true);
  }

  onSaved(draft: DevisAchatDraft): void {
    const editing = this.editingDevis();
    if (editing) {
      this.store.dispatch(ErpActions.updateDevisAchat({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ErpActions.addDevisAchat({ draft }));
    }
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  removeDevis(id: number): void {
    if (confirm('Supprimer ce devis fournisseur ?')) {
      this.store.dispatch(ErpActions.removeDevisAchat({ id }));
    }
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

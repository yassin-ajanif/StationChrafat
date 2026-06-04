import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  COMMANDE_STATUT_LABELS,
  Commande,
  CommandeDraft,
  CommandeStatut,
} from '../../../models/ventes';
import { ErpActions } from '../../../state/erp.actions';
import {
  selectCommandes,
  selectCommandesError,
  selectCommandesLoading,
  selectCommandesSaving,
} from '../../../state/erp.selectors';
import { CommandeFormDialogComponent } from './dialogs/commande-form-dialog/commande-form-dialog.component';

@Component({
  selector: 'app-erp-commandes-list-page',
  standalone: true,
  imports: [ButtonComponent, CommandeFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class CommandesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly commandes = this.store.selectSignal(selectCommandes);
  readonly loading = this.store.selectSignal(selectCommandesLoading);
  readonly error = this.store.selectSignal(selectCommandesError);
  readonly saving = this.store.selectSignal(selectCommandesSaving);

  readonly statutLabels = COMMANDE_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingCommande = signal<Commande | null>(null);

  ngOnInit(): void {
    this.store.dispatch(ErpActions.loadCommandes());
  }

  openNew(): void {
    this.editingCommande.set(null);
    this.showDialog.set(true);
  }

  openEdit(commande: Commande): void {
    this.editingCommande.set(commande);
    this.showDialog.set(true);
  }

  onSaved(draft: CommandeDraft): void {
    const editing = this.editingCommande();
    if (editing) {
      this.store.dispatch(ErpActions.updateCommande({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ErpActions.addCommande({ draft }));
    }
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  removeCommande(id: number): void {
    if (confirm('Supprimer cette commande ?')) {
      this.store.dispatch(ErpActions.removeCommande({ id }));
    }
  }

  statutClass(statut: CommandeStatut): string {
    const map: Record<CommandeStatut, string> = {
      en_attente: 'bg-warning-bg text-warning-text',
      confirmee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { CommandesListPage as VentesCommandesListPage };

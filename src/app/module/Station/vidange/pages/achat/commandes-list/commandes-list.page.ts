import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  COMMANDE_ACHAT_STATUT_LABELS,
  CommandeAchat,
  CommandeAchatDraft,
  CommandeAchatStatut,
} from '../../../models/achat';
import { VidangeActions } from '../../../state/vidange.actions';
import {
  selectCommandesAchat,
  selectCommandesAchatError,
  selectCommandesAchatLoading,
  selectCommandesAchatSaving,
} from '../../../state/vidange.selectors';
import { CommandeAchatFormDialogComponent } from './dialogs/commande-achat-form-dialog/commande-achat-form-dialog.component';

@Component({
  selector: 'app-vidange-achat-commandes-list-page',
  standalone: true,
  imports: [ButtonComponent, CommandeAchatFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class AchatCommandesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly commandes = this.store.selectSignal(selectCommandesAchat);
  readonly loading = this.store.selectSignal(selectCommandesAchatLoading);
  readonly error = this.store.selectSignal(selectCommandesAchatError);
  readonly saving = this.store.selectSignal(selectCommandesAchatSaving);

  readonly statutLabels = COMMANDE_ACHAT_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingCommande = signal<CommandeAchat | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VidangeActions.loadCommandesAchat());
  }

  openNew(): void {
    this.editingCommande.set(null);
    this.showDialog.set(true);
  }

  openEdit(commande: CommandeAchat): void {
    this.editingCommande.set(commande);
    this.showDialog.set(true);
  }

  onSaved(draft: CommandeAchatDraft): void {
    const editing = this.editingCommande();
    if (editing) {
      this.store.dispatch(VidangeActions.updateCommandeAchat({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VidangeActions.addCommandeAchat({ draft }));
    }
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  removeCommande(id: number): void {
    if (confirm('Supprimer cette commande fournisseur ?')) {
      this.store.dispatch(VidangeActions.removeCommandeAchat({ id }));
    }
  }

  statutClass(statut: CommandeAchatStatut): string {
    const map: Record<CommandeAchatStatut, string> = {
      en_attente: 'bg-warning-bg text-warning-text',
      confirmee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      recue: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

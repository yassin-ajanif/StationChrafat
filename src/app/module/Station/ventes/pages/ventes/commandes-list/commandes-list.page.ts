import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RecordListCardComponent } from '../../../../../../shared/components/record-list-card/record-list-card.component';
import { Commande, CommandeDraft, CommandeStatut } from '../../../state/store';

const COMMANDE_STATUT_KEYS: Record<CommandeStatut, string> = {
  en_attente: 'ventes.commande.statusEnAttente',
  confirmee: 'ventes.commande.statusConfirmee',
  en_cours: 'ventes.commande.statusEnCours',
  livree: 'ventes.commande.statusLivree',
  annulee: 'ventes.commande.statusAnnulee',
};
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectCommandes,
  selectCommandesError,
  selectCommandesLoading,
  selectCommandesSaving,
} from '../../../state/ventes.selectors';
import { CommandeFormDialogComponent } from './dialogs/commande-form-dialog/commande-form-dialog.component';

@Component({
  selector: 'app-erp-commandes-list-page',
  standalone: true,
  imports: [ButtonComponent, CommandeFormDialogComponent, DatePipe, LocaleCurrencyPipe, RecordListCardComponent, TranslatePipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class CommandesListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly commandes = this.store.selectSignal(selectCommandes);
  readonly loading = this.store.selectSignal(selectCommandesLoading);
  readonly error = this.store.selectSignal(selectCommandesError);
  readonly saving = this.store.selectSignal(selectCommandesSaving);

  readonly statutKeys = COMMANDE_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingCommande = signal<Commande | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadCommandes());
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
      this.store.dispatch(VentesActions.updateCommande({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VentesActions.addCommande({ draft }));
    }
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingCommande.set(null);
  }

  removeCommande(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteCommande'))) {
      this.store.dispatch(VentesActions.removeCommande({ id }));
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

import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RetourFournisseur, RetourFournisseurDraft, RetourFournisseurStatut } from '../../../state/store';

const RETOUR_FOURNISSEUR_STATUT_KEYS: Record<RetourFournisseurStatut, string> = {
  en_attente: 'achat.retour.statusEnAttente',
  envoye: 'achat.retour.statusEnvoye',
  recu: 'achat.retour.statusRecu',
  refuse: 'achat.retour.statusRefuse',
};
import { AchatActions } from '../../../state/achat.actions';
import {
  selectRetoursFournisseur,
  selectRetoursFournisseurError,
  selectRetoursFournisseurLoading,
  selectRetoursFournisseurSaving,
} from '../../../state/achat.selectors';
import { RetourFournisseurFormDialogComponent } from './dialogs/retour-fournisseur-form-dialog/retour-fournisseur-form-dialog.component';

@Component({
  selector: 'app-erp-retours-fournisseur-list-page',
  standalone: true,
  imports: [ButtonComponent, RetourFournisseurFormDialogComponent, DatePipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './retours-list.page.html',
  styleUrl: './retours-list.page.scss',
})
export class RetoursListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly retours = this.store.selectSignal(selectRetoursFournisseur);
  readonly loading = this.store.selectSignal(selectRetoursFournisseurLoading);
  readonly error = this.store.selectSignal(selectRetoursFournisseurError);
  readonly saving = this.store.selectSignal(selectRetoursFournisseurSaving);

  readonly statutKeys = RETOUR_FOURNISSEUR_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingRetour = signal<RetourFournisseur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(AchatActions.loadRetoursFournisseur());
  }

  openNew(): void {
    this.editingRetour.set(null);
    this.showDialog.set(true);
  }

  openEdit(retour: RetourFournisseur): void {
    this.editingRetour.set(retour);
    this.showDialog.set(true);
  }

  onSaved(draft: RetourFournisseurDraft): void {
    const editing = this.editingRetour();
    if (editing) {
      this.store.dispatch(AchatActions.updateRetourFournisseur({ id: editing.id, draft }));
    } else {
      this.store.dispatch(AchatActions.addRetourFournisseur({ draft }));
    }
    this.showDialog.set(false);
    this.editingRetour.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingRetour.set(null);
  }

  removeRetour(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteRetour'))) {
      this.store.dispatch(AchatActions.removeRetourFournisseur({ id }));
    }
  }

  statutClass(statut: RetourFournisseurStatut): string {
    const map: Record<RetourFournisseurStatut, string> = {
      en_attente: 'bg-surface-container text-on-surface-variant',
      envoye: 'bg-secondary/15 text-secondary',
      recu: 'bg-success/15 text-success',
      refuse: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { RetoursListPage as AchatRetoursListPage };

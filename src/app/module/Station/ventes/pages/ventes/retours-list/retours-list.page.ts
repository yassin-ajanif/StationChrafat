import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { Retour, RetourDraft, RetourStatut } from '../../../state/store';

const RETOUR_STATUT_KEYS: Record<RetourStatut, string> = {
  en_attente: 'ventes.retour.statusEnAttente',
  recu: 'ventes.retour.statusRecu',
  traite: 'ventes.retour.statusTraite',
  refuse: 'ventes.retour.statusRefuse',
};
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectRetours,
  selectRetoursError,
  selectRetoursLoading,
  selectRetoursSaving,
} from '../../../state/ventes.selectors';
import { RetourFormDialogComponent } from './dialogs/retour-form-dialog/retour-form-dialog.component';

@Component({
  selector: 'app-erp-retours-list-page',
  standalone: true,
  imports: [ButtonComponent, RetourFormDialogComponent, DatePipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './retours-list.page.html',
  styleUrl: './retours-list.page.scss',
})
export class RetoursListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly retours = this.store.selectSignal(selectRetours);
  readonly loading = this.store.selectSignal(selectRetoursLoading);
  readonly error = this.store.selectSignal(selectRetoursError);
  readonly saving = this.store.selectSignal(selectRetoursSaving);

  readonly statutKeys = RETOUR_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingRetour = signal<Retour | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadRetours());
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
      this.store.dispatch(VentesActions.updateRetour({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VentesActions.addRetour({ draft }));
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
      this.store.dispatch(VentesActions.removeRetour({ id }));
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

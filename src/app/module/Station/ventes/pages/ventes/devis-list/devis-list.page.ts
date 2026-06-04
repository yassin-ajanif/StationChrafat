import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { DevisFormDialogComponent } from './dialogs/devis-form-dialog/devis-form-dialog.component';
import { Devis, DevisDraft, DevisStatut, STATUT_KEYS } from '../../../models/ventes';
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectDevis,
  selectDevisError,
  selectDevisLoading,
  selectDevisSaving,
} from '../../../state/ventes.selectors';

@Component({
  selector: 'app-erp-devis-list-page',
  standalone: true,
  imports: [ButtonComponent, DevisFormDialogComponent, DatePipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './devis-list.page.html',
  styleUrl: './devis-list.page.scss',
})
export class DevisListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly devis = this.store.selectSignal(selectDevis);
  readonly loading = this.store.selectSignal(selectDevisLoading);
  readonly error = this.store.selectSignal(selectDevisError);
  readonly saving = this.store.selectSignal(selectDevisSaving);

  readonly statutKeys = STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingDevis = signal<Devis | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadDevis());
  }

  openNew(): void {
    this.editingDevis.set(null);
    this.showDialog.set(true);
  }

  openEdit(devis: Devis): void {
    this.editingDevis.set(devis);
    this.showDialog.set(true);
  }

  onSaved(draft: DevisDraft): void {
    const editing = this.editingDevis();
    if (editing) {
      this.store.dispatch(VentesActions.updateDevis({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VentesActions.addDevis({ draft }));
    }
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  removeDevis(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteDevis'))) {
      this.store.dispatch(VentesActions.removeDevis({ id }));
    }
  }

  statutClass(statut: DevisStatut): string {
    const map: Record<DevisStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      envoye: 'bg-secondary/15 text-secondary',
      accepte: 'bg-success/15 text-success',
      refuse: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { DevisListPage as VentesDevisListPage };

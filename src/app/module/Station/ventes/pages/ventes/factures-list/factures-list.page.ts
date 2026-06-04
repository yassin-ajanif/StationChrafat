import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  FACTURE_STATUT_LABELS,
  Facture,
  FactureDraft,
  FactureStatut,
} from '../../../models/ventes';
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectFactures,
  selectFacturesError,
  selectFacturesLoading,
  selectFacturesSaving,
} from '../../../state/ventes.selectors';
import { FactureFormDialogComponent } from './dialogs/facture-form-dialog/facture-form-dialog.component';

@Component({
  selector: 'app-erp-factures-list-page',
  standalone: true,
  imports: [ButtonComponent, FactureFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './factures-list.page.html',
  styleUrl: './factures-list.page.scss',
})
export class FacturesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly factures = this.store.selectSignal(selectFactures);
  readonly loading = this.store.selectSignal(selectFacturesLoading);
  readonly error = this.store.selectSignal(selectFacturesError);
  readonly saving = this.store.selectSignal(selectFacturesSaving);

  readonly statutLabels = FACTURE_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingFacture = signal<Facture | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadFactures());
  }

  openNew(): void {
    this.editingFacture.set(null);
    this.showDialog.set(true);
  }

  openEdit(facture: Facture): void {
    this.editingFacture.set(facture);
    this.showDialog.set(true);
  }

  onSaved(draft: FactureDraft): void {
    const editing = this.editingFacture();
    if (editing) {
      this.store.dispatch(VentesActions.updateFacture({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VentesActions.addFacture({ draft }));
    }
    this.showDialog.set(false);
    this.editingFacture.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingFacture.set(null);
  }

  removeFacture(id: number): void {
    if (confirm('Supprimer cette facture ?')) {
      this.store.dispatch(VentesActions.removeFacture({ id }));
    }
  }

  statutClass(statut: FactureStatut): string {
    const map: Record<FactureStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      emise: 'bg-secondary/15 text-secondary',
      payee: 'bg-success/15 text-success',
      en_retard: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { FacturesListPage as VentesFacturesListPage };

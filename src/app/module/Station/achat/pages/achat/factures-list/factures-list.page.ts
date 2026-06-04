import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import {
  FACTURE_FOURNISSEUR_STATUT_LABELS,
  FactureFournisseur,
  FactureFournisseurDraft,
  FactureFournisseurStatut,
} from '../../../models/achat';
import { AchatActions } from '../../../state/achat.actions';
import {
  selectFacturesFournisseur,
  selectFacturesFournisseurError,
  selectFacturesFournisseurLoading,
  selectFacturesFournisseurSaving,
} from '../../../state/achat.selectors';
import { FactureFournisseurFormDialogComponent } from './dialogs/facture-fournisseur-form-dialog/facture-fournisseur-form-dialog.component';

@Component({
  selector: 'app-erp-achat-factures-list-page',
  standalone: true,
  imports: [ButtonComponent, FactureFournisseurFormDialogComponent, DatePipe, DecimalPipe],
  templateUrl: './factures-list.page.html',
  styleUrl: './factures-list.page.scss',
})
export class AchatFacturesListPage implements OnInit {
  private readonly store = inject(Store);

  readonly factures = this.store.selectSignal(selectFacturesFournisseur);
  readonly loading = this.store.selectSignal(selectFacturesFournisseurLoading);
  readonly error = this.store.selectSignal(selectFacturesFournisseurError);
  readonly saving = this.store.selectSignal(selectFacturesFournisseurSaving);

  readonly statutLabels = FACTURE_FOURNISSEUR_STATUT_LABELS;
  readonly showDialog = signal(false);
  readonly editingFacture = signal<FactureFournisseur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(AchatActions.loadFacturesFournisseur());
  }

  openNew(): void {
    this.editingFacture.set(null);
    this.showDialog.set(true);
  }

  openEdit(facture: FactureFournisseur): void {
    this.editingFacture.set(facture);
    this.showDialog.set(true);
  }

  onSaved(draft: FactureFournisseurDraft): void {
    const editing = this.editingFacture();
    if (editing) {
      this.store.dispatch(AchatActions.updateFactureFournisseur({ id: editing.id, draft }));
    } else {
      this.store.dispatch(AchatActions.addFactureFournisseur({ draft }));
    }
    this.showDialog.set(false);
    this.editingFacture.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingFacture.set(null);
  }

  removeFacture(id: number): void {
    if (confirm('Supprimer cette facture fournisseur ?')) {
      this.store.dispatch(AchatActions.removeFactureFournisseur({ id }));
    }
  }

  statutClass(statut: FactureFournisseurStatut): string {
    const map: Record<FactureFournisseurStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      recue: 'bg-secondary/15 text-secondary',
      payee: 'bg-success/15 text-success',
      en_retard: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

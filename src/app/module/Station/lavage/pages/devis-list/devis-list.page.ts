import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DevisFormDialogComponent } from '../../../../../shared/ventes/components/devis-form-dialog/devis-form-dialog.component';
import { Devis, DevisDraft, DevisStatut, STATUT_LABELS, VentesModule } from '../../../../../shared/ventes/models/ventes.model';
import { VentesActions } from '../../../../../shared/ventes/state/ventes.actions';
import { selectDevis, selectDevisLoading, selectDevisError, selectSaving } from '../../../../../shared/ventes/state/ventes.selectors';

@Component({
  selector: 'app-devis-list-page',
  standalone: true,
  imports: [ButtonComponent, DevisFormDialogComponent, DecimalPipe, DatePipe],
  templateUrl: './devis-list.page.html',
  styleUrl: './devis-list.page.scss',
})
export class DevisListPage implements OnInit {
  private readonly store = inject(Store);

  readonly module: VentesModule = 'lavage';

  readonly devis = this.store.selectSignal(selectDevis);
  readonly loading = this.store.selectSignal(selectDevisLoading);
  readonly error = this.store.selectSignal(selectDevisError);
  readonly saving = this.store.selectSignal(selectSaving);

  readonly statutLabels = STATUT_LABELS;

  readonly showDialog = signal(false);
  readonly editingDevis = signal<Devis | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadDevis({ module: this.module }));
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
      this.store.dispatch(VentesActions.addDevis({ draft, module: this.module }));
    }
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingDevis.set(null);
  }

  removeDevis(id: number): void {
    if (confirm('Supprimer ce devis ?')) {
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

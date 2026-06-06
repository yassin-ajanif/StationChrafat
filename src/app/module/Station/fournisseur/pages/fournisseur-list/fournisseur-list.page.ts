import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '../../../../../core/i18n';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Fournisseur, FournisseurDraft } from '../../state/fournisseur.store';
import { FournisseurActions } from '../../state/fournisseur.actions';
import {
  selectError,
  selectFilteredFournisseurs,
  selectLoading,
  selectSaving,
  selectSearchQuery,
} from '../../state/fournisseur.selectors';
import { FournisseurFormDialogComponent } from './dialogs/fournisseur-form-dialog/fournisseur-form-dialog.component';

@Component({
  selector: 'app-fournisseur-list-page',
  standalone: true,
  imports: [ButtonComponent, FournisseurFormDialogComponent, TranslatePipe],
  templateUrl: './fournisseur-list.page.html',
  styleUrl: './fournisseur-list.page.scss',
})
export class FournisseurListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly fournisseurs = this.store.selectSignal(selectFilteredFournisseurs);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly error = this.store.selectSignal(selectError);

  readonly dialogOpen = signal(false);
  readonly editingFournisseur = signal<Fournisseur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(FournisseurActions.loadFournisseurs());
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(FournisseurActions.setSearchQuery({ query }));
  }

  openNew(): void {
    this.editingFournisseur.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(fournisseur: Fournisseur): void {
    this.editingFournisseur.set(fournisseur);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingFournisseur.set(null);
  }

  onSaved(draft: FournisseurDraft): void {
    const editing = this.editingFournisseur();
    if (editing) {
      this.store.dispatch(FournisseurActions.updateFournisseur({ id: editing.id, draft }));
    } else {
      this.store.dispatch(FournisseurActions.addFournisseur({ draft }));
    }
    this.closeDialog();
  }

  removeFournisseur(id: number): void {
    if (confirm(this.translate.instant('fournisseur.confirmDelete'))) {
      this.store.dispatch(FournisseurActions.removeFournisseur({ id }));
    }
  }
}

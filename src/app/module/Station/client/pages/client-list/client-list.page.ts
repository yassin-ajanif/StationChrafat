import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '../../../../../core/i18n';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Client, ClientDraft } from '../../state/client.store';
import { ClientActions } from '../../state/client.actions';
import {
  selectError,
  selectFilteredClients,
  selectLoading,
  selectSaving,
  selectSearchQuery,
} from '../../state/client.selectors';
import { ClientFormDialogComponent } from './dialogs/client-form-dialog/client-form-dialog.component';

@Component({
  selector: 'app-client-list-page',
  standalone: true,
  imports: [ButtonComponent, ClientFormDialogComponent, TranslatePipe],
  templateUrl: './client-list.page.html',
  styleUrl: './client-list.page.scss',
})
export class ClientListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly clients = this.store.selectSignal(selectFilteredClients);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly error = this.store.selectSignal(selectError);

  readonly dialogOpen = signal(false);
  readonly editingClient = signal<Client | null>(null);

  ngOnInit(): void {
    this.store.dispatch(ClientActions.loadClients());
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(ClientActions.setSearchQuery({ query }));
  }

  openNew(): void {
    this.editingClient.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(client: Client): void {
    this.editingClient.set(client);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingClient.set(null);
  }

  onSaved(draft: ClientDraft): void {
    const editing = this.editingClient();
    if (editing) {
      this.store.dispatch(ClientActions.updateClient({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ClientActions.addClient({ draft }));
    }
    this.closeDialog();
  }

  removeClient(id: number): void {
    if (confirm(this.translate.instant('client.confirmDelete'))) {
      this.store.dispatch(ClientActions.removeClient({ id }));
    }
  }
}

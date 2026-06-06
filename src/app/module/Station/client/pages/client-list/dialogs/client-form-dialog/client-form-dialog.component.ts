import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { TranslatePipe } from '../../../../../../../core/i18n';
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import { Client, ClientDraft } from '../../../../state/client.store';

@Component({
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './client-form-dialog.component.html',
  styleUrl: './client-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormDialogComponent {
  readonly open = input(false);
  readonly editClient = input<Client | null>(null);
  readonly saving = input(false);

  readonly saved = output<ClientDraft>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editClient() != null);

  readonly name = signal('');
  readonly phone = signal('');
  readonly email = signal('');
  readonly ice = signal('');
  readonly address = signal('');
  readonly city = signal('');
  readonly active = signal(true);

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const client = this.editClient();
      if (client) {
        this.name.set(client.name);
        this.phone.set(client.phone);
        this.email.set(client.email);
        this.ice.set(client.ice);
        this.address.set(client.address);
        this.city.set(client.city);
        this.active.set(client.active);
        return;
      }
      this.name.set('');
      this.phone.set('');
      this.email.set('');
      this.ice.set('');
      this.address.set('');
      this.city.set('');
      this.active.set(true);
    });
  }

  isValid(): boolean {
    return this.name().trim().length > 0;
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }

  cancel(): void {
    this.closed.emit();
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }
    this.saved.emit({
      name: this.name().trim(),
      phone: this.phone().trim(),
      email: this.email().trim(),
      ice: this.ice().trim(),
      address: this.address().trim(),
      city: this.city().trim(),
      active: this.active(),
    });
  }
}

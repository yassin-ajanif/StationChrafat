import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { TranslatePipe } from '../../../../../../../core/i18n';
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import { Fournisseur, FournisseurDraft } from '../../../../state/fournisseur.store';

@Component({
  selector: 'app-fournisseur-form-dialog',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './fournisseur-form-dialog.component.html',
  styleUrl: './fournisseur-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FournisseurFormDialogComponent {
  readonly open = input(false);
  readonly editFournisseur = input<Fournisseur | null>(null);
  readonly saving = input(false);

  readonly saved = output<FournisseurDraft>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editFournisseur() != null);

  readonly name = signal('');
  readonly phone = signal('');
  readonly email = signal('');
  readonly ice = signal('');
  readonly address = signal('');
  readonly city = signal('');
  readonly paymentTermsDays = signal(30);
  readonly active = signal(true);

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const fournisseur = this.editFournisseur();
      if (fournisseur) {
        this.name.set(fournisseur.name);
        this.phone.set(fournisseur.phone);
        this.email.set(fournisseur.email);
        this.ice.set(fournisseur.ice);
        this.address.set(fournisseur.address);
        this.city.set(fournisseur.city);
        this.paymentTermsDays.set(fournisseur.paymentTermsDays);
        this.active.set(fournisseur.active);
        return;
      }
      this.name.set('');
      this.phone.set('');
      this.email.set('');
      this.ice.set('');
      this.address.set('');
      this.city.set('');
      this.paymentTermsDays.set(30);
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
      paymentTermsDays: Math.max(0, this.paymentTermsDays()),
      active: this.active(),
    });
  }
}

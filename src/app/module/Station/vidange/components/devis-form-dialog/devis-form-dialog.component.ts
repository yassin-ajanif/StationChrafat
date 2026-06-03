import { DecimalPipe } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  DEFAULT_TVA,
  Devis,
  DevisDraft,
  DevisStatut,
  STATUT_LABELS,
  computeTTC,
} from '../../models/ventes';

@Component({
  selector: 'app-devis-form-dialog',
  standalone: true,
  imports: [ButtonComponent, DecimalPipe],
  templateUrl: './devis-form-dialog.component.html',
  styleUrl: './devis-form-dialog.component.scss',
})
export class DevisFormDialogComponent {
  readonly open = input(false);
  readonly editDevis = input<Devis | null>(null);
  readonly saved = output<DevisDraft>();
  readonly closed = output<void>();

  readonly statutLabels = STATUT_LABELS;
  readonly statutOptions: DevisStatut[] = ['brouillon', 'envoye', 'accepte', 'refuse'];

  readonly client = signal('');
  readonly montantHT = signal(0);
  readonly tva = signal(DEFAULT_TVA);
  readonly statut = signal<DevisStatut>('brouillon');
  readonly dateValidite = signal('');
  readonly notes = signal('');

  readonly montantTTC = () => computeTTC(this.montantHT(), this.tva());

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const edit = this.editDevis();
      if (edit) {
        this.client.set(edit.client);
        this.montantHT.set(edit.montantHT);
        this.tva.set(edit.tva);
        this.statut.set(edit.statut);
        this.dateValidite.set(edit.dateValidite);
        this.notes.set(edit.notes);
      } else {
        this.client.set('');
        this.montantHT.set(0);
        this.tva.set(DEFAULT_TVA);
        this.statut.set('brouillon');
        this.dateValidite.set('');
        this.notes.set('');
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }

  cancel(): void {
    this.closed.emit();
  }

  submit(): void {
    if (!this.client().trim()) {
      return;
    }
    this.saved.emit({
      client: this.client().trim(),
      montantHT: this.montantHT(),
      tva: this.tva(),
      statut: this.statut(),
      dateValidite: this.dateValidite(),
      notes: this.notes(),
    });
  }
}

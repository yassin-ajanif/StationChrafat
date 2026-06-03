import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { DEFAULT_TVA, Devis, DevisDraft, DevisStatut, STATUT_LABELS, computeTTC } from '../../models/ventes.model';

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

  readonly isEditMode = computed(() => this.editDevis() != null);

  readonly client = signal('');
  readonly montantHT = signal<number | null>(null);
  readonly tva = signal(DEFAULT_TVA);
  readonly statut = signal<DevisStatut>('brouillon');
  readonly dateValidite = signal('');
  readonly notes = signal('');

  readonly montantTTC = computed(() => {
    const ht = this.montantHT();
    if (ht == null || isNaN(ht)) return 0;
    return computeTTC(ht, this.tva());
  });

  readonly canSave = computed(() => {
    const client = this.client().trim();
    const ht = this.montantHT();
    return client.length > 0 && ht != null && ht > 0;
  });

  readonly statutLabels = STATUT_LABELS;
  readonly statutOptions: DevisStatut[] = ['brouillon', 'envoye', 'accepte', 'refuse'];

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const editing = this.editDevis();
      if (editing) {
        this.client.set(editing.client);
        this.montantHT.set(editing.montantHT);
        this.tva.set(editing.tva);
        this.statut.set(editing.statut);
        this.dateValidite.set(editing.dateValidite);
        this.notes.set(editing.notes);
      } else {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.client.set('');
    this.montantHT.set(null);
    this.tva.set(DEFAULT_TVA);
    this.statut.set('brouillon');
    this.dateValidite.set('');
    this.notes.set('');
  }

  onMontantHTInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    this.montantHT.set(parsed != null && !Number.isNaN(parsed) ? parsed : null);
  }

  onTvaInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? DEFAULT_TVA : Number(raw);
    this.tva.set(!Number.isNaN(parsed) ? parsed : DEFAULT_TVA);
  }

  onStatutChange(event: Event): void {
    this.statut.set((event.target as HTMLSelectElement).value as DevisStatut);
  }

  save(): void {
    if (!this.canSave()) return;
    this.saved.emit({
      client: this.client().trim(),
      montantHT: this.montantHT()!,
      tva: this.tva(),
      statut: this.statut(),
      dateValidite: this.dateValidite(),
      notes: this.notes().trim(),
    });
  }

  cancel(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Livraison, LIVRAISON_STATUT_LABELS, LivraisonStatut, VentesModule } from '../../../../../shared/ventes/models/ventes.model';
import { VentesApi } from '../../../../../shared/ventes/data-access/ventes.api';

@Component({
  selector: 'app-livraisons-list-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class LivraisonsListPage implements OnInit {
  private readonly api = inject(VentesApi);

  readonly module: VentesModule = 'vidange';
  readonly livraisons = signal<Livraison[]>([]);
  readonly loading = signal(true);
  readonly statutLabels = LIVRAISON_STATUT_LABELS;

  ngOnInit(): void {
    this.api.getLivraisons(this.module).subscribe((liv) => {
      this.livraisons.set(liv);
      this.loading.set(false);
    });
  }

  statutClass(statut: LivraisonStatut): string {
    const map: Record<LivraisonStatut, string> = {
      planifiee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

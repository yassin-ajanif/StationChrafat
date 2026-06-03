import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Commande, COMMANDE_STATUT_LABELS, CommandeStatut, VentesModule } from '../../../../../../shared/ventes/models/ventes.model';
import { VentesApi } from '../../../../../../shared/ventes/data-access/ventes.api';

@Component({
  selector: 'app-commandes-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './commandes-list.page.html',
  styleUrl: './commandes-list.page.scss',
})
export class CommandesListPage implements OnInit {
  private readonly api = inject(VentesApi);

  readonly module: VentesModule = 'carburant';
  readonly commandes = signal<Commande[]>([]);
  readonly loading = signal(true);
  readonly statutLabels = COMMANDE_STATUT_LABELS;

  ngOnInit(): void {
    this.api.getCommandes(this.module).subscribe((cmd) => {
      this.commandes.set(cmd);
      this.loading.set(false);
    });
  }

  statutClass(statut: CommandeStatut): string {
    const map: Record<CommandeStatut, string> = {
      en_attente: 'bg-warning-bg text-warning-text',
      confirmee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

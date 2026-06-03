import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Devis, DevisDraft, VentesModule } from '../models/ventes.model';

function randomDelay(): number {
  return 200 + Math.floor(Math.random() * 300);
}

const demoDevis: Devis[] = [
  {
    id: 1, numero: 'DEV-L-0001', client: 'Garage Al Amal', module: 'lavage',
    montantHT: 1200, tva: 20, montantTTC: 1440,
    statut: 'accepte', dateCreation: '2026-05-15', dateValidite: '2026-06-15', notes: 'Lavage complet flotte véhicules',
  },
  {
    id: 2, numero: 'DEV-L-0002', client: 'Auto Propre SARL', module: 'lavage',
    montantHT: 850, tva: 20, montantTTC: 1020,
    statut: 'envoye', dateCreation: '2026-05-20', dateValidite: '2026-06-20', notes: 'Forfait lavage mensuel',
  },
  {
    id: 3, numero: 'DEV-V-0001', client: 'Transport Rif', module: 'vidange',
    montantHT: 2500, tva: 20, montantTTC: 3000,
    statut: 'brouillon', dateCreation: '2026-05-22', dateValidite: '2026-06-22', notes: 'Vidange complète 12 camions',
  },
  {
    id: 4, numero: 'DEV-V-0002', client: 'Société Atlas Logistique', module: 'vidange',
    montantHT: 1800, tva: 20, montantTTC: 2160,
    statut: 'accepte', dateCreation: '2026-05-25', dateValidite: '2026-06-25', notes: '',
  },
  {
    id: 5, numero: 'DEV-C-0001', client: 'Station Service Tanger', module: 'carburant',
    montantHT: 45000, tva: 20, montantTTC: 54000,
    statut: 'envoye', dateCreation: '2026-05-28', dateValidite: '2026-06-28', notes: 'Approvisionnement gazoil juin',
  },
  {
    id: 6, numero: 'DEV-C-0002', client: 'Transport Union', module: 'carburant',
    montantHT: 32000, tva: 20, montantTTC: 38400,
    statut: 'brouillon', dateCreation: '2026-06-01', dateValidite: '2026-07-01', notes: 'Devis carburant flotte',
  },
  {
    id: 7, numero: 'DEV-L-0003', client: 'Lavage Express', module: 'lavage',
    montantHT: 600, tva: 20, montantTTC: 720,
    statut: 'refuse', dateCreation: '2026-06-02', dateValidite: '2026-07-02', notes: 'Devis lavage mains',
  },
];

const demoCommandes = [
  { id: 1, numero: 'CMD-L-0001', client: 'Garage Al Amal', module: 'lavage' as const, montant: 1440, statut: 'confirmee' as const, dateCreation: '2026-05-16', description: 'Commande suite devis DEV-L-0001' },
  { id: 2, numero: 'CMD-V-0001', client: 'Transport Rif', module: 'vidange' as const, montant: 3000, statut: 'en_cours' as const, dateCreation: '2026-05-23', description: 'Vidanges camions en cours' },
  { id: 3, numero: 'CMD-C-0001', client: 'Station Service Tanger', module: 'carburant' as const, montant: 54000, statut: 'en_attente' as const, dateCreation: '2026-05-29', description: 'En attente de confirmation' },
  { id: 4, numero: 'CMD-L-0002', client: 'Auto Propre SARL', module: 'lavage' as const, montant: 1020, statut: 'livree' as const, dateCreation: '2026-05-21', description: 'Forfait lavage livré' },
];

const demoLivraisons = [
  { id: 1, numero: 'LIV-L-0001', client: 'Garage Al Amal', module: 'lavage' as const, dateLivraison: '2026-05-18', statut: 'livree' as const, adresse: 'Zone Industrielle, Lot 12', description: 'Livraison lavage effectuée' },
  { id: 2, numero: 'LIV-V-0001', client: 'Transport Rif', module: 'vidange' as const, dateLivraison: '2026-05-30', statut: 'planifiee' as const, adresse: 'Route de Tétouan, Km 5', description: 'Planifiée pour fin mai' },
  { id: 3, numero: 'LIV-C-0001', client: 'Station Service Tanger', module: 'carburant' as const, dateLivraison: '2026-06-10', statut: 'planifiee' as const, adresse: 'Avenue Mohammed V, Tanger', description: 'Livraison carburant prévue' },
];

@Injectable({ providedIn: 'root' })
export class VentesApi {
  getDevis(module: VentesModule) {
    return of(demoDevis.filter((d) => d.module === module)).pipe(delay(randomDelay()));
  }

  getAllDevis() {
    return of([...demoDevis]).pipe(delay(randomDelay()));
  }

  addDevis(draft: DevisDraft, module: VentesModule) {
    const nextId = Math.max(...demoDevis.map((d) => d.id), 0) + 1;
    const numero = `DEV-${module === 'lavage' ? 'L' : module === 'vidange' ? 'V' : 'C'}-${String(nextId).padStart(4, '0')}`;
    const devis: Devis = {
      id: nextId,
      numero,
      client: draft.client,
      module,
      montantHT: draft.montantHT,
      tva: draft.tva,
      montantTTC: draft.montantHT + (draft.montantHT * draft.tva) / 100,
      statut: draft.statut,
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: draft.dateValidite,
      notes: draft.notes,
    };
    demoDevis.push(devis);
    return of(devis).pipe(delay(randomDelay()));
  }

  updateDevis(id: number, draft: DevisDraft) {
    const idx = demoDevis.findIndex((d) => d.id === id);
    if (idx === -1) {
      throw new Error('Devis introuvable');
    }
    const existing = demoDevis[idx];
    const updated: Devis = {
      ...existing,
      client: draft.client,
      montantHT: draft.montantHT,
      tva: draft.tva,
      montantTTC: draft.montantHT + (draft.montantHT * draft.tva) / 100,
      statut: draft.statut,
      dateValidite: draft.dateValidite,
      notes: draft.notes,
    };
    demoDevis[idx] = updated;
    return of(updated).pipe(delay(randomDelay()));
  }

  removeDevis(id: number) {
    const idx = demoDevis.findIndex((d) => d.id === id);
    if (idx !== -1) {
      demoDevis.splice(idx, 1);
    }
    return of(true).pipe(delay(randomDelay()));
  }

  getCommandes(module: VentesModule) {
    return of(demoCommandes.filter((c) => c.module === module)).pipe(delay(randomDelay()));
  }

  getLivraisons(module: VentesModule) {
    return of(demoLivraisons.filter((l) => l.module === module)).pipe(delay(randomDelay()));
  }
}

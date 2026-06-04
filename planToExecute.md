Unified Station menu — structure plan

Target sidebar (what you described)

Station
├── Ventes
│   ├── Devis
│   ├── Bon de commande
│   ├── Bon de livraison          ← ERP BL client (carburant = product line)
│   ├── Factures
│   ├── Bon de retour             ← NEW (not in codebase today)
│   └── Avoirs
├── Achats
│   ├── Devis
│   ├── Bon de commande
│   ├── Bon de livraison          ← réception fournisseur (today: achat/livraisons)
│   ├── Factures
│   ├── Bon de retour             ← NEW
│   └── Avoirs
├── Stock
└── Journée                       ← OUT OF SCOPE (no moves, no refactors)

Removed from nav: Lavage, Vidange, Carburant as separate branches ([app-shell.component.ts](FrontEnd/src/app/shared/components/app-shell/app-shell.component.ts)).

Removed from Station routes: [/station/carburant/bon-livraison](FrontEnd/src/app/module/Station/carburant/carburant.routes.ts) pistolets host — that UI stays only under Journée ([bon-livraison-carburant](FrontEnd/src/app/module/Station/shared/pages/bon-livraison-carburant/)).



Target routes (single lazy module)







Menu item



Route





Ventes → Devis



/station/ventes/devis





Ventes → Bon de commande



/station/ventes/commandes





Ventes → Bon de livraison



/station/ventes/livraisons





Ventes → Factures



/station/ventes/factures





Ventes → Bon de retour



/station/ventes/retours





Ventes → Avoirs



/station/ventes/avoirs





Achats → (same 6)



/station/achat/...





Stock



/station/stock





Journée



/journees (unchanged)

Replace [station.routes.ts](FrontEnd/src/app/module/Station/station.routes.ts) children lavage / vidange / carburant with one station.routes feature tree under module/Station/erp/ (name flexible: erp, documents, or flat pages/).



Folder layout (mirrors current lavage pattern × 12 + stock)

module/Station/
├── shared/                    ← KEEP (document-lines-table, bon-recap-payments, bon-livraison-carburant for journée only)
├── journee/                   ← DO NOT TOUCH
├── erp/                       ← NEW unified slice
│   ├── erp.routes.ts
│   ├── models/
│   │   ├── ventes/            (devis, commande, livraison, facture, retour, avoir)
│   │   └── achat/             (devis-achat, commande-achat, reception, facture-fournisseur, retour-fournisseur, avoir-fournisseur)
│   ├── data-access/erp.api.ts
│   ├── state/                 (erp.actions | reducer | effects | selectors — one feature)
│   └── pages/
│       ├── stock-overview/
│       ├── ventes/
│       │   ├── devis-list/
│       │   │   ├── devis-list.page.{ts,html,scss}
│       │   │   └── dialogs/devis-form-dialog/
│       │   ├── commandes-list/ + dialogs/commande-form-dialog/
│       │   ├── livraisons-list/ + dialogs/livraison-form-dialog/
│       │   ├── factures-list/ + dialogs/facture-form-dialog/
│       │   ├── retours-list/ + dialogs/retour-form-dialog/     ← NEW
│       │   └── avoirs-list/ + dialogs/avoir-form-dialog/
│       └── achat/
│           ├── devis-list/ + dialogs/devis-achat-form-dialog/
│           ├── commandes-list/ + dialogs/commande-achat-form-dialog/
│           ├── livraisons-list/ + dialogs/reception-form-dialog/
│           ├── factures-list/ + dialogs/facture-fournisseur-form-dialog/
│           ├── retours-list/ + dialogs/retour-fournisseur-form-dialog/  ← NEW
│           └── avoirs-list/ + dialogs/avoir-fournisseur-form-dialog/
└── station.routes.ts          ← lazy-load erp only (+ redirect /station → /station/stock)

Delete after migration: lavage/, vidange/, carburant/ modules (pages, models, api, state) and their provideState / effects in [app.config.ts](FrontEnd/src/app/app.config.ts).

Source templates to copy: [lavage/pages/](FrontEnd/src/app/module/Station/lavage/pages/) (full ventes + achat + both line tables). Strip “— Lavage” titles; use neutral “Station” labels and unified numbering prefix (e.g. DEV-S-0001).



UI visual wireframes (what you will see on screen)

These mockups match your existing design system: 280px dark sidebar, cream main area (#fcf9f8), Barlow Condensed uppercase titles, burgundy table headers with white labels, red primary buttons (44px min height, 2px radius), orange secondary text actions, amounts in fr-MA + DH, status as small colored pills.

Legend used in boxes:

[■■]  = primary red button (CTA)
[···] = secondary/orange text button
(●)   = status pill (green/orange/grey/red tint)
░░░   = dimmed backdrop when dialog open



A) Application chrome (every Station page)

┌──────────────────┬──────────────────────────────────────────────────────────────┐
│ ▓▓ SIDEBAR 280px │ MAIN CONTENT (scrollable, padding, gap between blocks)      │
│ ▓▓ inverse dark  │                                                              │
│                  │                                                              │
│ CHARAFATE        │   ← page wireframes B–N render in this area only             │
│ Management Portal│                                                              │
│                  │                                                              │
│ ▸ Dashboard      │                                                              │
│ ▾ Station        │                                                              │
│    ▸ Ventes      │                                                              │
│       Devis      │                                                              │
│       Bon de cmd │                                                              │
│       Bon livr.  │                                                              │
│       Factures   │                                                              │
│       Bon retour │                                                              │
│       Avoirs     │                                                              │
│    ▸ Achats      │                                                              │
│       (same 6)   │                                                              │
│    Stock         │                                                              │
│    Journée       │  ← unchanged link to /journees                               │
│                  │                                                              │
└──────────────────┴──────────────────────────────────────────────────────────────┘



B) Master layout — LIST page (all 12 document screens)

Same visual shell for every list; only title, columns, and CTA label change.

┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  DEVIS CLIENT — STATION                          ┌──────────────────────┐  │
│  Gestion des devis clients (tous produits).      │  + NOUVEAU DEVIS       │  │
│  (subtitle, DM Sans 14px, brown-grey)            │  [■■ red, 44px tall]   │  │
│                                                  └──────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ TABLE HEADER (burgundy) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││
│  │ N° DEVIS │ CLIENT      │ MONTANT TTC │ STATUT │ DATE    │ ACTIONS     ││
│  ├──────────┼─────────────┼─────────────┼────────┼─────────┼─────────────┤│
│  │ DEV-S-01 │ Garage Amal │  12 450,00  │ (●)    │ 04/06/26│ [···] [···] ││
│  │          │             │         DH  │ ENVOYÉ │         │ Mod.  Supp. ││
│  ├──────────┼─────────────┼─────────────┼────────┼─────────┼─────────────┤│
│  │ DEV-S-02 │ Fleet Maroc │   8 200,00  │ (●)    │ 01/06/26│ [···] [···] ││
│  │          │             │         DH  │BROUILL.│         │             ││
│  ├──────────┴─────────────┴─────────────┴────────┴─────────┴─────────────┤│
│  │  (zebra rows: white / light grey; mono font on document numbers)       ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  (optional, after save)  Enregistrement en cours…                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Empty state (centered inside table card): Aucun devis pour le moment.

Loading state: centred grey text e.g. Chargement des devis…

Error state: red-tinted bordered alert bar above the table.



C) Master layout — FORM DIALOG (opens over list, all documents)

Semi-transparent dark overlay; centred white card max ~1150px wide, scrollable body.

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░  ┌────────────────────────────────────────────────────────────────────┐ ░░
░░  │ NOUVEAU DEVIS                                              [  ×  ] │ ░░
░░  │ Remplissez les tableaux produits et produits consommés.            │ ░░
░░  ├────────────────────────────────────────────────────────────────────┤ ░░
░░  │ ┌─────────────────────┐  ┌─────────────────────┐                   │ ░░
░░  │ │ Client              │  │ Statut ▼            │                   │ ░░
░░  │ │ [Garage Al Amal___] │  │ [ Envoyé        ▼]  │                   │ ░░
░░  │ └─────────────────────┘  └─────────────────────┘                   │ ░░
░░  │ ┌─────────────────────┐  ┌─────────────────────┐                   │ ░░
░░  │ │ Valide jusqu'au     │  │ Notes               │                   │ ░░
░░  │ │ [📅 2026-07-04    ] │  │ [Commentaire____] │                   │ ░░
░░  │ └─────────────────────┘  └─────────────────────┘                   │ ░░
░░  │                                                                    │ ░░
░░  │ PRODUITS                                                           │ ░░
░░  │ [☑ Réf] [☑ Désignation] [☑ Qté] [☑ Unité] [☑ PU HT] [☑ TVA] …     │ ░░
░░  │ ┌──┬────────┬──────────────────┬─────┬────┬───────┬─────┬────────┐ │ ░░
░░  │ │# │ Réf    │ Désignation      │ Qté │ U  │ PU HT │ TVA │ Effacer│ │ ░░
░░  │ ├──┼────────┼──────────────────┼─────┼────┼───────┼─────┼────────┤ │ ░░
░░  │ │1 │ GO-10  │ Gazoil 10 ppm    │40000│ L  │  9,50 │ 20% │  [×]   │ │ ░░
░░  │ │2 │ CIRE   │ Cire premium     │  12 │ u  │ 85,00 │ 20% │  [×]   │ │ ░░
░░  │ └──┴────────┴──────────────────┴─────┴────┴───────┴─────┴────────┘ │ ░░
░░  │ [ + Ajouter une ligne produit ]                                    │ ░░
░░  │                                                                    │ ░░
░░  │ PRODUITS CONSOMMÉS                                                 │ ░░
░░  │ (same line grid + column toggles + add row)                        │ ░░
░░  │                                                                    │ ░░
░░  │ ┌─ Récapitulatif du bon ─────────────────────────────────────────┐ │ ░░
░░  │ │ Total produits consommés TTC     1 200,00 DH                   │ │ ░░
░░  │ │ Total produits TTC             456 000,00 DH                   │ │ ░░
░░  │ │ ─────────────────────────────────────────────                  │ │ ░░
░░  │ │ TOTAL TTC DU BON              457 200,00 DH  (big red number)│ │ ░░
░░  │ │ Répartition: [Espèces] [TPE] [Chèques] [Virement] [Bons]        │ │ ░░
░░  │ └────────────────────────────────────────────────────────────────┘ │ ░░
░░  ├────────────────────────────────────────────────────────────────────┤ ░░
░░  │ Montant devis = 457 200,00 DH    [ Annuler ]  [■■ Enregistrer ]   │ ░░
░░  └────────────────────────────────────────────────────────────────────┘ ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

Achats dialogs: replace Client with Fournisseur; same two line tables + recap.

Bon de retour dialogs: add fields Facture / BL lié(e), Motif du retour; line tables titled Produits retournés (and consommés if needed).



Per-screen wireframes (list view + dialog fields)

Below: what appears on screen for each menu item. Dialog = fields + sections inside mockup C.



VENTES

1. Devis client — /station/ventes/devis

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ DEVIS CLIENT — STATION                              [■■ + NOUVEAU DEVIS]   │
│ Devis pour clients (carburant, lavage, vidange, tous produits).           │
├────────────────────────────────────────────────────────────────────────────┤
│ N° DEVIS  │ CLIENT           │ MONTANT TTC  │ STATUT    │ VALIDE JUSQU'AU │
│ DEV-S-001 │ Garage Al Amal   │  12 450,00 DH│ (●) ENVOYÉ│ 04/07/2026      │
│ DEV-S-002 │ Transport Union  │  54 000,00 DH│ (●) ACCEPTÉ│ 28/06/2026     │
└────────────────────────────────────────────────────────────────────────────┘

Dialog (mockup C): Client, Statut, Valide jusqu'au, Notes → Produits → Produits consommés → recap → Enregistrer.



2. Bon de commande client — /station/ventes/commandes

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE COMMANDE — STATION                    [■■ + NOUVEAU BON DE COMMANDE]│
│ Commandes clients avant livraison ou facturation.                          │
├────────────────────────────────────────────────────────────────────────────┤
│ N° BC     │ CLIENT           │ MONTANT      │ STATUT      │ DATE CRÉATION │
│ BC-S-001  │ Fleet Maroc      │  32 500,00 DH│ (●) CONFIRMÉ│ 02/06/2026    │
│ BC-S-002  │ Station Tanger   │  54 000,00 DH│ (●) EN ATT. │ 29/05/2026    │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Client, Statut, Description (textarea) → Produits → Produits consommés → recap.



3. Bon de livraison client — /station/ventes/livraisons

(ERP document — carburant is a normal product line in litres; no pistolets here.)

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE LIVRAISON CLIENT — STATION          [■■ + NOUVEAU BON DE LIVRAISON] │
│ Sortie stock / livraison vers le client (y compris carburant en litres).    │
├────────────────────────────────────────────────────────────────────────────┤
│ N° BL     │ CLIENT           │ MONTANT      │ STATUT     │ DATE LIVRAISON  │
│ BL-S-001  │ Fleet Maroc      │  12 500,00 DH│ (●) LIVRÉE │ 05/06/2026      │
│ BL-S-002  │ Garage Al Amal   │   8 400,00 DH│ (●) PLANIF.│ 10/06/2026      │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Client, Date livraison, Adresse, Statut, Description → Produits (e.g. GO-10 5000 L) → Produits consommés → recap.



4. Factures client — /station/ventes/factures

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ FACTURES CLIENT — STATION                        [■■ + NOUVELLE FACTURE]   │
│ Facturation clients après livraison ou prestation.                         │
├────────────────────────────────────────────────────────────────────────────┤
│ N° FACTURE│ CLIENT           │ MONTANT TTC  │ STATUT     │ ÉCHÉANCE        │
│ FAC-S-001 │ Fleet Maroc      │  54 000,00 DH│ (●) PAYÉE  │ 15/07/2026      │
│ FAC-S-002 │ Transport Union  │  38 400,00 DH│ (●) ÉMISE  │ 01/07/2026      │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Client, Statut, Date facture, Date échéance, Notes → Produits → Produits consommés → recap + paiements.



5. Bon de retour client — /station/ventes/retours (NEW)

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE RETOUR CLIENT — STATION               [■■ + NOUVEAU BON DE RETOUR]  │
│ Marchandises retournées par le client (avant ou en lien avec un avoir).    │
├────────────────────────────────────────────────────────────────────────────┤
│ N° RETOUR │ CLIENT      │ FACTURE LIÉE │ MONTANT     │ STATUT  │ DATE     │
│ RET-S-001 │ Fleet Maroc │ FAC-S-001    │  1 200,00 DH│ (●) REÇU│ 03/06/26 │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Client, N° facture/BL lié (optional), Motif, Statut, Date → Produits retournés (line table) → Produits consommés (optional) → recap.



6. Avoirs client — /station/ventes/avoirs

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ AVOIRS CLIENT — STATION                            [■■ + NOUVEL AVOIR]     │
│ Notes de crédit émises au client (suite retour ou remise commerciale).     │
├────────────────────────────────────────────────────────────────────────────┤
│ N° AVOIR  │ CLIENT      │ FACTURE LIÉE │ MONTANT     │ STATUT   │ DATE    │
│ AV-S-001  │ Fleet Maroc │ FAC-S-001    │  1 200,00 DH│ (●) APPL.│ 04/06/26│
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Client, Facture liée, Statut, Date → Produits → Produits consommés → recap.



ACHATS

7. Devis fournisseur — /station/achat/devis

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ DEVIS FOURNISSEUR — STATION                         [■■ + NOUVEAU DEVIS]   │
│ Devis reçus avant bon de commande fournisseur.                             │
├────────────────────────────────────────────────────────────────────────────┤
│ N° DEVIS  │ FOURNISSEUR        │ MONTANT TTC  │ STATUT    │ DATE           │
│ DAF-S-001 │ TotalEnergies Maroc│ 456 000,00 DH│ (●) ACCEPTÉ│ 18/05/2026    │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Statut, Valide jusqu'au, Notes → Produits → Produits consommés → recap.



8. Bon de commande fournisseur — /station/achat/commandes

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE COMMANDE FOURNISSEUR — STATION      [■■ + NOUVEAU BON DE COMMANDE]  │
├────────────────────────────────────────────────────────────────────────────┤
│ N° BCF    │ FOURNISSEUR        │ MONTANT      │ STATUT     │ DATE           │
│ BCF-S-001 │ Shell Distribution │  89 500,00 DH│ (●) CONFIRMÉ│ 02/06/2026    │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Statut, Description → Produits → Produits consommés → recap.



9. Bon de livraison fournisseur — /station/achat/livraisons

(Réception marchandises — entrée stock.)

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE LIVRAISON FOURNISSEUR — STATION     [■■ + NOUVEAU BON DE LIVRAISON] │
│ Réception fournisseur (citerne, consommables, pièces).                     │
├────────────────────────────────────────────────────────────────────────────┤
│ N° BR     │ FOURNISSEUR        │ MONTANT      │ STATUT     │ DATE RÉCEPTION│
│ BR-S-001  │ TotalEnergies Maroc│ 456 000,00 DH│ (●) REÇUE  │ 08/06/2026    │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Date réception, Réf. BL fournisseur, Statut, Description → Produits → Produits consommés → recap.



10. Factures fournisseur — /station/achat/factures

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ FACTURES FOURNISSEUR — STATION                   [■■ + NOUVELLE FACTURE]   │
├────────────────────────────────────────────────────────────────────────────┤
│ N° FF     │ FOURNISSEUR        │ MONTANT TTC  │ STATUT     │ ÉCHÉANCE       │
│ FF-S-001  │ TotalEnergies Maroc│ 456 000,00 DH│ (●) REÇUE  │ 30/06/2026     │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Statut, Date réception, Date échéance → Produits → Produits consommés → recap.



11. Bon de retour fournisseur — /station/achat/retours (NEW)

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ BON DE RETOUR FOURNISSEUR — STATION          [■■ + NOUVEAU BON DE RETOUR]  │
│ Marchandises renvoyées au fournisseur.                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ N° RETOUR │ FOURNISSEUR   │ FACTURE LIÉE │ MONTANT    │ STATUT │ DATE      │
│ RETF-S-01 │ Shell Distrib.│ FF-S-002     │  4 500,00DH│ (●) ENVOYÉ│01/06/26│
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Facture/réception liée, Motif, Statut, Date → Produits retournés → recap.



12. Avoirs fournisseur — /station/achat/avoirs

List screen

┌────────────────────────────────────────────────────────────────────────────┐
│ AVOIRS FOURNISSEUR — STATION                       [■■ + NOUVEL AVOIR]     │
│ Crédits reçus du fournisseur (retours, remises).                           │
├────────────────────────────────────────────────────────────────────────────┤
│ N° AF     │ FOURNISSEUR   │ FACTURE LIÉE │ MONTANT    │ STATUT  │ DATE     │
│ AF-S-001  │ Shell Distrib.│ FF-S-002     │  2 100,00DH│ (●) REÇU│ 05/06/26 │
└────────────────────────────────────────────────────────────────────────────┘

Dialog: Fournisseur, Facture liée, Statut, Date → Produits → Produits consommés → recap.



STOCK

13. Stock — /station/stock

List only (no dialog in v1). Read-only overview card.

┌────────────────────────────────────────────────────────────────────────────┐
│ STOCK — STATION                                                            │
│ Tous produits station : carburant, lavage, vidange (seuils et alertes).   │
├────────────────────────────────────────────────────────────────────────────┤
│ PRODUIT              │ FAMILLE    │ QTÉ STOCK │ UNITÉ │ SEUIL MIN │ STATUT│
│ Gazoil 10 ppm        │ Carburant  │    38 200 │ L     │    10 000 │ (●) OK│
│ Shampoing auto       │ Lavage     │        48 │ L     │        20 │ (●) OK│
│ Filtre à huile 5W40  │ Vidange    │        62 │ pcs   │        15 │ (●) AL│
│ Excellium            │ Carburant  │     8 400 │ L     │     5 000 │ (●) OK│
└────────────────────────────────────────────────────────────────────────────┘

Status pills: Optimal (green), Alerte (amber), Critique (red tint) — same as current stock pages.



Journée (out of scope — reference only)

Pistolets / bombistes UI stays here, not under Station ▸ Ventes ▸ Bon de livraison:

/journees/.../index-pistoles-step2  →  existing bon-livraison-carburant screen
(no change planned)



UI consistency rules (implementation)







Element



Visual rule





Page title



font-display, 24px, bold, UPPERCASE, dark text





Primary CTA



Red #bb0014, min height 44px, label + Nouveau …





Table header row



Burgundy bg-table-header, white 11px uppercase labels





Row actions



Orange Modifier, red Supprimer, text buttons (not icons-only)





Money



Right-aligned tabular nums, suffix DH, locale fr-MA





Dialog



Centred card, scroll body max ~70vh, footer sticky with total + buttons





Line tables



Column visibility checkboxes above grid; horizontal scroll on small screens

Partner field naming







Side



List column + dialog label





Ventes



Client





Achats



Fournisseur



Data / state consolidation

flowchart TB
  subgraph pages [erp/pages]
    ListPage[List page]
    Dialog[Form dialog]
  end
  subgraph state [erp/state NgRx]
    Actions
    Effects
    Reducer
  end
  subgraph data [erp/data-access]
    ErpApi[erp.api.ts]
  end
  ListPage -->|dispatch load/add/update/remove| Actions
  Actions --> Effects
  Effects --> ErpApi
  Dialog -->|saved draft| ListPage





One erpFeature in app.config.ts instead of lavageFeature, vidangeFeature, carburantFeature.



One demo catalog: merged product references in line pickers (carburant L, shampoing, filtre, etc.).



Numbering: single prefix per doc type (drop -L / -V / -C suffixes).



Bon de retour: new models retour.model.ts / retour-fournisseur.model.ts + CRUD in api/effects (mirror [avoir.model.ts](FrontEnd/src/app/module/Station/lavage/models/ventes/avoir.model.ts) with distinct statuts/motif).



Journée (explicitly excluded)





No route or menu changes under [journee/](FrontEnd/src/app/module/Station/journee/).



[shared/pages/bon-livraison-carburant](FrontEnd/src/app/module/Station/shared/pages/bon-livraison-carburant/) remains imported by journée step 2 only.



NgRx journeeFeature untouched.



Migration order (when you approve implementation)





Scaffold erp/ routes + empty list pages + nav in app-shell (6+6+stock).



Copy/adapt lavage list+dialog sets → ventes/achat (10 existing doc types).



Add Bon de retour ventes + achat (models, api, state, pages, dialogs).



Merge stock API + single stock page.



Wire erp NgRx; remove old features from app.config.ts.



Delete lavage/, vidange/, carburant/; add redirects /station/lavage → /station/stock (optional).



Build + fix selectors/imports.



What stays the same vs what changes







Unchanged



Changes





List + dedicated dialog per document



3 activity modules → 1 erp module





app-document-lines-table × 2



Nav: flat Ventes / Achats / Stock





app-bon-recap-payments



+2 document types (bon de retour)





Journée + pistolets BL



Carburant ERP BL = normal livraison list





Project layer rules (pages/, data-access/, state/)



3 NgRx slices → 1


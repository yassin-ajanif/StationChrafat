import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

interface NavLeaf {
  label: string;
  route?: string;
}

interface NavBranch {
  id: string;
  label: string;
  baseRoute: string;
  children: NavEntry[];
}

type NavEntry = NavLeaf | NavBranch;

interface PrincipalMenu {
  id: string;
  label: string;
  baseRoute: string;
  entries: NavEntry[];
}

function isNavBranch(entry: NavEntry): entry is NavBranch {
  return 'children' in entry;
}

const VENTES_DOCUMENT_CHILDREN: NavLeaf[] = [
  { label: 'Devis', route: '/devis' },
  { label: 'Bon de commande', route: '/commandes' },
  { label: 'Bon de livraison', route: '/livraisons' },
  { label: 'Factures', route: '/factures' },
  { label: 'Avoirs', route: '/avoirs' },
];

const ACHAT_DOCUMENT_CHILDREN: NavLeaf[] = [
  { label: 'Devis', route: '/devis' },
  { label: 'Bon de commande', route: '/commandes' },
  { label: 'Bon de livraison', route: '/livraisons' },
  { label: 'Factures', route: '/factures' },
  { label: 'Avoirs', route: '/avoirs' },
];

/** Ventes + Achat only (5 document types each). Used by Carburant, Lavage, Vidange. */
function activityVentesAchatChildren(baseRoute: string, idPrefix: string): NavBranch[] {
  return [
    {
      id: `${idPrefix}-ventes`,
      label: 'Ventes',
      baseRoute: `${baseRoute}/ventes`,
      children: VENTES_DOCUMENT_CHILDREN.map((item) => ({
        ...item,
        route: `${baseRoute}/ventes${item.route}`,
      })),
    },
    {
      id: `${idPrefix}-achat`,
      label: 'Achat',
      baseRoute: `${baseRoute}/achat`,
      children: ACHAT_DOCUMENT_CHILDREN.map((item) => ({
        ...item,
        route: `${baseRoute}/achat${item.route}`,
      })),
    },
  ];
}

/** Station business lines — only one expanded at a time in the sidebar. */
const STATION_ACTIVITY_IDS = ['station-lavage', 'station-vidange', 'station-carburant'] as const;

const STATION_ACTIVITY_NESTED_IDS: Record<(typeof STATION_ACTIVITY_IDS)[number], string[]> = {
  'station-lavage': ['station-lavage-ventes', 'station-lavage-achat'],
  'station-vidange': ['station-vidange-ventes', 'station-vidange-achat'],
  'station-carburant': ['station-carburant-ventes', 'station-carburant-achat'],
};

const STATION_ACTIVITY_BASE_ROUTES: Record<(typeof STATION_ACTIVITY_IDS)[number], string> = {
  'station-lavage': '/station/lavage',
  'station-vidange': '/station/vidange',
  'station-carburant': '/station/carburant',
};

function isStationActivityId(id: string): id is (typeof STATION_ACTIVITY_IDS)[number] {
  return (STATION_ACTIVITY_IDS as readonly string[]).includes(id);
}

/** Ventes / Achat under one activity — only one expanded at a time. */
function isActivityDocumentGroupId(id: string): boolean {
  return id.endsWith('-ventes') || id.endsWith('-achat');
}

function getActivityDocumentSiblingId(id: string): string | null {
  if (id.endsWith('-ventes')) {
    return `${id.slice(0, -'-ventes'.length)}-achat`;
  }
  if (id.endsWith('-achat')) {
    return `${id.slice(0, -'-achat'.length)}-ventes`;
  }
  return null;
}

function getParentActivityId(documentGroupId: string): (typeof STATION_ACTIVITY_IDS)[number] | null {
  const parent = documentGroupId.replace(/-(ventes|achat)$/, '');
  return isStationActivityId(parent) ? parent : null;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);

  readonly navLinks: NavLeaf[] = [{ label: 'Dashboard', route: '/journees' }];

  readonly principalMenus: PrincipalMenu[] = [
    {
      id: 'station',
      label: 'Station',
      baseRoute: '/station',
      entries: [
        {
          id: 'station-lavage',
          label: 'Lavage',
          baseRoute: '/station/lavage',
          children: [
            { label: 'Stock', route: '/station/lavage/stock' },
            ...activityVentesAchatChildren('/station/lavage', 'station-lavage'),
          ],
        },
        {
          id: 'station-vidange',
          label: 'Vidange',
          baseRoute: '/station/vidange',
          children: [
            { label: 'Stock', route: '/station/vidange/stock' },
            ...activityVentesAchatChildren('/station/vidange', 'station-vidange'),
          ],
        },
        {
          id: 'station-carburant',
          label: 'Carburant',
          baseRoute: '/station/carburant',
          children: [
            { label: 'Stock', route: '/station/carburant/stock' },
            {
              id: 'station-carburant-ventes',
              label: 'Ventes',
              baseRoute: '/station/carburant/ventes',
              children: [
                { label: 'Devis', route: '/station/carburant/ventes/devis' },
                { label: 'Bon de commande', route: '/station/carburant/ventes/commandes' },
                { label: 'Bon de livraison', route: '/station/carburant/bon-livraison' },
                { label: 'Factures', route: '/station/carburant/ventes/factures' },
                { label: 'Avoirs', route: '/station/carburant/ventes/avoirs' },
              ],
            },
            {
              id: 'station-carburant-achat',
              label: 'Achat',
              baseRoute: '/station/carburant/achat',
              children: ACHAT_DOCUMENT_CHILDREN.map((item) => ({
                ...item,
                route: `/station/carburant/achat${item.route}`,
              })),
            },
          ],
        },
        { label: 'Journée', route: '/journees' },
      ],
    },
  ];

  readonly expandedGroups = signal<Set<string>>(
    new Set(['station', 'station-carburant', 'station-carburant-ventes']),
  );

  private readonly navigationUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    effect(() => {
      const url = this.navigationUrl();
      if (url) {
        this.syncStationActivityExpansionFromUrl(url);
      }
    });
  }

  readonly isStationRoute = computed(
    () => this.router.url.startsWith('/station') || this.router.url.startsWith('/journees'),
  );

  isPrincipalActive(menu: PrincipalMenu): boolean {
    if (menu.id === 'station') {
      return this.isStationRoute();
    }
    return this.router.url.startsWith(menu.baseRoute);
  }

  isBranchActive(branch: NavBranch): boolean {
    return this.router.url.startsWith(branch.baseRoute);
  }

  isExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      const willExpand = !next.has(id);

      if (isStationActivityId(id)) {
        this.collapseStationActivities(next, willExpand ? id : undefined);
        if (willExpand) {
          next.add('station');
          next.add(id);
        } else {
          next.delete(id);
          for (const nestedId of STATION_ACTIVITY_NESTED_IDS[id]) {
            next.delete(nestedId);
          }
        }
        return next;
      }

      if (isActivityDocumentGroupId(id)) {
        if (willExpand) {
          const sibling = getActivityDocumentSiblingId(id);
          if (sibling) {
            next.delete(sibling);
          }
          const parentActivity = getParentActivityId(id);
          if (parentActivity) {
            next.add('station');
            this.collapseStationActivities(next, parentActivity);
            next.add(parentActivity);
          }
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      }

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  private collapseStationActivities(expanded: Set<string>, exceptId?: string): void {
    for (const activityId of STATION_ACTIVITY_IDS) {
      if (activityId === exceptId) {
        continue;
      }
      expanded.delete(activityId);
      for (const nestedId of STATION_ACTIVITY_NESTED_IDS[activityId]) {
        expanded.delete(nestedId);
      }
    }
  }

  private syncStationActivityExpansionFromUrl(url: string): void {
    const activeActivity = STATION_ACTIVITY_IDS.find((id) =>
      url.startsWith(STATION_ACTIVITY_BASE_ROUTES[id]),
    );
    if (!activeActivity) {
      return;
    }

    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');
      this.collapseStationActivities(next, activeActivity);
      next.add(activeActivity);

      if (url.includes('/achat')) {
        next.add(`${activeActivity}-achat`);
      } else if (url.includes('/ventes')) {
        next.add(`${activeActivity}-ventes`);
      }

      return next;
    });
  }

  isBranch(entry: NavEntry): entry is NavBranch {
    return isNavBranch(entry);
  }

  /** Every sidebar entry with a route is navigable (no gray “Bientôt disponible” stubs). */
  isImplementedRoute(route: string | undefined): boolean {
    return !!route;
  }
}

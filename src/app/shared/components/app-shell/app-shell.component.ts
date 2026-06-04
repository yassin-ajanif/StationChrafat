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
  children: NavLeaf[];
}

interface PrincipalMenu {
  id: string;
  label: string;
  baseRoute: string;
  entries: (NavLeaf | NavBranch)[];
}

function isNavBranch(entry: NavLeaf | NavBranch): entry is NavBranch {
  return 'children' in entry;
}

const VENTES_CHILDREN: NavLeaf[] = [
  { label: 'Devis', route: '/station/ventes/devis' },
  { label: 'Bon de commande', route: '/station/ventes/commandes' },
  { label: 'Bon de livraison', route: '/station/ventes/livraisons' },
  { label: 'Factures', route: '/station/ventes/factures' },
  { label: 'Bon de retour', route: '/station/ventes/retours' },
  { label: 'Avoirs', route: '/station/ventes/avoirs' },
];

const ACHATS_CHILDREN: NavLeaf[] = [
  { label: 'Devis', route: '/station/achat/devis' },
  { label: 'Bon de commande', route: '/station/achat/commandes' },
  { label: 'Bon de livraison', route: '/station/achat/livraisons' },
  { label: 'Factures', route: '/station/achat/factures' },
  { label: 'Bon de retour', route: '/station/achat/retours' },
  { label: 'Avoirs', route: '/station/achat/avoirs' },
];

const SIDEBAR_GROUP_IDS = ['station', 'station-ventes', 'station-achats'] as const;
type SidebarGroupId = (typeof SIDEBAR_GROUP_IDS)[number];

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
          id: 'station-ventes',
          label: 'Ventes',
          baseRoute: '/station/ventes',
          children: VENTES_CHILDREN,
        },
        {
          id: 'station-achats',
          label: 'Achats',
          baseRoute: '/station/achat',
          children: ACHATS_CHILDREN,
        },
        { label: 'Stock', route: '/station/stock' },
        { label: 'Journée', route: '/journees' },
      ],
    },
  ];

  readonly expandedGroups = signal<Set<string>>(
    new Set(['station', 'station-ventes']),
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
        this.syncSidebarExpansionFromUrl(url);
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  private syncSidebarExpansionFromUrl(url: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');

      if (url.includes('/ventes')) {
        next.add('station-ventes');
      }
      if (url.includes('/achat')) {
        next.add('station-achats');
      }

      return next;
    });
  }

  isBranch(entry: NavLeaf | NavBranch): entry is NavBranch {
    return isNavBranch(entry);
  }

  isImplementedRoute(route: string | undefined): boolean {
    return !!route;
  }
}

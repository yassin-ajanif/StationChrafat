import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  SidebarNavIconComponent,
  SidebarNavIconId,
} from '../sidebar-nav-icon/sidebar-nav-icon.component';

interface NavLeaf {
  label: string;
  route?: string;
  icon?: SidebarNavIconId;
}

interface NavBranch {
  id: string;
  label: string;
  baseRoute: string;
  icon: SidebarNavIconId;
  children: NavLeaf[];
}

interface PrincipalMenu {
  id: string;
  label: string;
  baseRoute: string;
  icon: SidebarNavIconId;
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

const STOCK_CHILDREN: NavLeaf[] = [
  { label: 'Gestion des stocks', route: '/station/stock/gestion' },
  { label: 'Pistolets et cuves', route: '/station/stock/pistolets-cuves' },
];

const SIDEBAR_GROUP_IDS = ['station', 'station-ventes', 'station-achats'] as const;
type SidebarGroupId = (typeof SIDEBAR_GROUP_IDS)[number];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SidebarNavIconComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private static readonly SIDEBAR_COLLAPSED_KEY = 'charafate-sidebar-collapsed';

  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(this.readSidebarCollapsedPreference());

  readonly navLinks: NavLeaf[] = [
    { label: 'Dashboard', route: '/journees', icon: 'dashboard' },
  ];

  readonly principalMenus: PrincipalMenu[] = [
    {
      id: 'station',
      label: 'Station',
      baseRoute: '/station',
      icon: 'station',
      entries: [
        {
          id: 'station-ventes',
          label: 'Ventes',
          baseRoute: '/station/ventes',
          icon: 'ventes',
          children: VENTES_CHILDREN,
        },
        {
          id: 'station-achats',
          label: 'Achats',
          baseRoute: '/station/achat',
          icon: 'achats',
          children: ACHATS_CHILDREN,
        },
        {
          id: 'station-stock',
          label: 'Stock',
          baseRoute: '/station/stock',
          icon: 'stock',
          children: STOCK_CHILDREN,
        },
        {
          label: 'Produits & services',
          route: '/station/produits-services',
          icon: 'catalogue',
        },
        { label: 'Journée', route: '/journees', icon: 'journee' },
      ],
    },
  ];

  readonly expandedGroups = signal<Set<string>>(
    new Set(['station']),
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

  /** Click on Ventes / Achats / Stock: expand submenu and open first child route. */
  onBranchClick(branch: NavBranch): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');
      next.delete('station-ventes');
      next.delete('station-achats');
      next.delete('station-stock');
      next.add(branch.id);
      return next;
    });

    const defaultRoute = branch.children.find((child) => child.route)?.route;
    if (defaultRoute) {
      void this.router.navigateByUrl(defaultRoute);
    }
  }

  private syncSidebarExpansionFromUrl(url: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');
      next.delete('station-ventes');
      next.delete('station-achats');
      next.delete('station-stock');

      if (url.includes('/ventes')) {
        next.add('station-ventes');
      } else if (url.includes('/achat')) {
        next.add('station-achats');
      } else if (url.includes('/stock')) {
        next.add('station-stock');
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

  entryIcon(entry: NavLeaf | NavBranch): SidebarNavIconId {
    return entry.icon ?? 'station';
  }

  collapsedLeafClick(entry: NavLeaf): void {
    if (entry.route) {
      void this.router.navigateByUrl(entry.route);
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.persistSidebarCollapsedPreference(next);
      return next;
    });
  }

  sidebarToggleLabel(): string {
    return this.sidebarCollapsed() ? 'Afficher le menu' : 'Masquer le menu';
  }

  private readSidebarCollapsedPreference(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem(AppShellComponent.SIDEBAR_COLLAPSED_KEY) === 'true';
  }

  private persistSidebarCollapsedPreference(collapsed: boolean): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(AppShellComponent.SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }
}
